import { useEffect, useState, useCallback } from "react";
import { Text, StyleSheet, SafeAreaView, View, Platform, StatusBar, TouchableHighlight, ScrollView } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import ButtonList from "../components/ButtonList";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clock from '../components/Clock';
import { useFocusEffect } from '@react-navigation/native';
import { useAnalytics } from '@segment/analytics-react-native';

const userRegionKey = "@user_region";
const dismissHintKey = "@dismissed_hint";

const regions = [
    {
        label: 'Pacific',
        value: 'gfacn31',
        airportCode: 'CYVR'
    },
    {
        label: 'Prairies',
        value: 'gfacn32',
        airportCode: 'CYYC'
    },
    {
        label: 'Ontario & Quebec',
        value: 'gfacn33',
        airportCode: 'CYTZ'
    },
    {
        label: 'Atlantic',
        value: 'gfacn34',
        airportCode: 'CYYG'
    },
    {
        label: 'Yukon & NWT',
        value: 'gfacn35',
        airportCode: 'CYXY'
    },
    {
        label: 'Nunavut',
        value: 'gfacn36',
        airportCode: 'CYFB'
    },
    {
        label: 'Arctic',
        value: 'gfacn37',
        airportCode: 'CYAB'
    }
];

function format(value) {
	if (value < 10) {
		return "00" + value;
	} else {
		return "0" + value;
	}
};

export default function Home({ navigation }) {
    const { track } = useAnalytics();

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('gfacn33');
    const [label, setLabel] = useState('Ontario & Quebec');
    const [items, setItems] = useState(regions);
    const [selectedRegion, setSelectedRegion] = useState(items[2]);
    const [hintDismissed, setHintDismissed] = useState(false);
    const [loading, setLoading] = useState(true);

    const [weatherLinks, setWeatherLinks] = useState([]);
    const [icingLinks, setIcingLinks] = useState([]);

    const getWeatherImages = async (airportCode) => {
        try {
          const response = await fetch(`https://plan.navcanada.ca/weather/api/alpha/?site=${airportCode}&image=GFA/CLDWX&image=GFA/TURBC`);
          const json = await response.json();
          return json;
        } catch (error) {
          console.error(error);
        }
      };

    useEffect(() => {
      async function fetchData() {
        if (!loading) setLoading(true);
        let foundRegion;
        if (value) {
            foundRegion = items.find(item => item.value === value);
        }
        else {
            foundRegion = items[2];
            setValue(foundRegion.value);
        }
        setLabel(foundRegion.label);
        setSelectedRegion(foundRegion);
        const weatherData = await getWeatherImages(foundRegion.airportCode);
        const cloudLinks = _buildLinks(weatherData.data[0].text);
        const iceTurbLinks = _buildLinks(weatherData.data[1].text);
        setWeatherLinks(cloudLinks);
        setIcingLinks(iceTurbLinks);
        setLoading(false);
      }
      fetchData();
    }, [value]);

    useEffect(() => {
        getLocalStorageValue(userRegionKey, setValue);
        getLocalStorageValue(dismissHintKey, setHintDismissed);
    }, []);

    useFocusEffect(
        useCallback(() => {
          getLocalStorageValue(dismissHintKey, setHintDismissed);
        }, [])
    );

    // Keeping in for dev purposes
    const setLocalStorageValue = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value)
        } catch (error) {
            console.error(`Error setting ${key}`)
        }
    }

    const getLocalStorageValue = async (key, setter) => {
        try {
            const localValue = await AsyncStorage.getItem(key);
            if (localValue) {
                setter(localValue);
            }
        } catch (error) {
            console.error(`Error getting ${key}`);
            return null;
        }
    }

    const clearLocalValue = async () => {
        await AsyncStorage.removeItem(dismissHintKey)
    }

    const refreshLinks = async() => {
        setLoading(true);
        track('Refresh Links Pressed');
        const weatherData = await getWeatherImages(selectedRegion.airportCode);
        const cloudLinks = _buildLinks(weatherData.data[0].text);
        const iceTurbLinks = _buildLinks(weatherData.data[1].text);
        setWeatherLinks(cloudLinks);
        setIcingLinks(iceTurbLinks);
        setLoading(false);
    }

    function _buildLinks(weatherData){
        let allFrames = JSON.parse(weatherData).frame_lists[2].frames;
        let links = [];
        allFrames.forEach(frame => {
            links.push(`https://plan.navcanada.ca/weather/images/${frame.images[0].id}.png`);
        })
        return links;
    }

    return (
        <SafeAreaView>
            <Text style={styles.header}>Canadian GFA Viewer</Text>
            {/* <TouchableHighlight onPress={() => clearLocalValue()}>
                <Text>clear</Text>
            </TouchableHighlight> */}
            <View style={styles.dropdownContainer}>
                <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    onChangeValue={(value) => setLocalStorageValue(userRegionKey, value)}
                    labelStyle={{
                        fontWeight: 'bold'
                    }}
                />
            </View>
            <Text style={styles.subheader}>Region: {label} ({value})</Text>
            <Clock />
            {loading &&
                <Text style={styles.copy}>Loading map links...</Text>
            }
            {!loading &&
                <View>
                    <TouchableHighlight style={styles.btn} onPress={() => refreshLinks()} underlayColor={'#edae00'}>
                        <Text style={styles.btnText}>Refresh Links</Text>
                    </TouchableHighlight>
                    <Text style={styles.copy}>Clouds & Weather Maps:</Text>
                    <ScrollView>
                        <ButtonList 
                            links={weatherLinks} 
                            navigation={navigation} 
                            region={label} 
                            hintDismissed={hintDismissed} />
                    </ScrollView>
                    <Text style={styles.copy}>Icing, Turbulence & Freezing Maps:</Text>
                    <ScrollView>
                        <ButtonList 
                            links={icingLinks} 
                            navigation={navigation} 
                            region={label} 
                            hintDismissed={hintDismissed} />
                    </ScrollView>
                </View>
            }
            <StatusBar barStyle={'dark-content'} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    AndroidSafeArea: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    header: {
        fontSize: 22,
        padding: 10,
        fontWeight: 'bold'
    },
    subheader: {
        fontSize: 18,
        paddingHorizontal: 10,
        fontWeight: '500'
    },
    copy: {
        fontSize: 16,
        padding: 10,
        fontWeight: '400'
    },
    dropdownContainer: {
        margin: 10,
        zIndex: 999
    },
    btn: {
        backgroundColor: 'yellow',
        padding: 10,
        tex: 'white',
        width: 150,
        alignItems: 'center',
        marginLeft: 10,
        borderRadius: 5
    },
    btnText: {
        fontWeight: 'bold'
    }
});