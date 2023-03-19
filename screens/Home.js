import { useEffect, useState } from "react";
import { Text, StyleSheet, SafeAreaView, View, Platform, StatusBar} from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import ButtonList from "../components/ButtonList";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clock from '../components/Clock';

const numOfForecasts = 3;
const userRegionKey = "@user_region";
const dismissHintKey = "@dismissed_hint";

const regions = [
    {
        label: 'Pacific',
        value: 'gfacn31'
    },
    {
        label: 'Prairies',
        value: 'gfacn32'
    },
    {
        label: 'Ontario & Quebec',
        value: 'gfacn33'
    },
    {
        label: 'Atlantic',
        value: 'gfacn34'
    },
    {
        label: 'Yukon & NWT',
        value: 'gfacn35'
    },
    {
        label: 'Nunavut',
        value: 'gfacn36'
    },
    {
        label: 'Artic',
        value: 'gfacn37'
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

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('gfacn33');
    const [label, setLabel] = useState('Ontario & Quebec');
    const [items, setItems] = useState(regions);
    const [hintDismissed, setHintDismissed] = useState(false);

    const [weatherLinks, setWeatherLinks] = useState([]);
    const [icingLinks, setIcingLinks] = useState([]);

    useEffect(() => {
      makeLinks();
    }, [value])

    useEffect(() => {
        getLocalStorageValue(userRegionKey, setValue);
    }, []);

    const makeLinks = () => {
        let foundRegion;
        if (value) {
            foundRegion = items.find(item => item.value === value);
        }
        else {
            foundRegion = items[2];
            setValue(foundRegion.value)
        }

        setLabel(foundRegion.label)
        let weatherlLinks = [];
        let icingLinks = [];
        for(let i = 0; i < numOfForecasts; i++) {
            let num = format(i * 6);
            weatherlLinks.push(`https://flightplanning.navcanada.ca/Latest/gfa/anglais/produits/uprair/gfa/${value}/Latest-${value}_cldwx_${num}.png`);
            icingLinks.push(`https://flightplanning.navcanada.ca/Latest/gfa/anglais/produits/uprair/gfa/${value}/Latest-${value}_turbc_${num}.png`);
        }
        setWeatherLinks(weatherlLinks);
        setIcingLinks(icingLinks);
    }

    const setLocalStorageValue = async (key, value) => {
        try {
            console.log('setting new value',value)
            await AsyncStorage.setItem(key, value)
        } catch (error) {
            console.error(`Error setting ${key}`)
        }
    }

    const getLocalStorageValue = async (key, setter) => {
        try {
            const localValue = await AsyncStorage.getItem(key);
            if (localValue !== undefined) {
                setter(localValue);
            }
        } catch (error) {
            console.error(`Error getting ${key}`);
            return null;
        }
    }

    return (
        <SafeAreaView>
            <Text style={styles.header}>Canadian GFA Viewer</Text>
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
            <Text style={styles.copy}>Clouds & Weather Maps:</Text>
            <ButtonList links={weatherLinks} navigation={navigation} region={label} />
            <Text style={styles.copy}>Icing, Turbulence & Freezing Maps:</Text>
            <ButtonList links={icingLinks} navigation={navigation} region={label} />
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
    }
});