import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from "react";
import { Text, StyleSheet, SafeAreaView, View} from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import ButtonList from "../components/ButtonList";

const numOfForecasts = 3;
//https://flightplanning.navcanada.ca/Latest/gfa/anglais/produits/uprair/gfa/gfacn33/Latest-gfacn33_turbc_000.png

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
]

function format(value) {
	if (value < 10) {
		return "00" + value;
	} else {
		return "0" + value;
	}
}

export default function Home({ navigation }) {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('gfacn33');
    const [label, setLabel] = useState('Ontario & Quebec');
    const [items, setItems] = useState(regions)

    const [weatherLinks, setWeatherLinks] = useState([]);
    const [icingLinks, setIcingLinks] = useState([]);

    useEffect(() => {
      makeLinks();
    }, [value])

    const makeLinks = () => {
        let foundRegion = items.find(item => item.value === value)
        setLabel(foundRegion.label)
        let weatherlLinks = [];
        let icingLinks = [];
        for(let i = 0; i < numOfForecasts; i++) {
            let num = format(i*6);
            weatherlLinks.push(`https://flightplanning.navcanada.ca/Latest/gfa/anglais/produits/uprair/gfa/${value}/Latest-${value}_cldwx_${num}.png`);
            icingLinks.push(`https://flightplanning.navcanada.ca/Latest/gfa/anglais/produits/uprair/gfa/${value}/Latest-${value}_turbc_${num}.png`);
        }
        setWeatherLinks(weatherlLinks);
        setIcingLinks(icingLinks);
    }
    

    return (
        <SafeAreaView>
            <Text style={styles.header}>Welcome to GFA Viewer!</Text>
            <View style={styles.dropdownContainer}>
                <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                />
            </View>
            <Text style={styles.subheader}>Region: {label} ({value})</Text>
            <Text style={styles.copy}>Clouds & Weather Maps:</Text>
            <ButtonList links={weatherLinks} navigation={navigation} />
            <Text style={styles.copy}>Icing, Turbulence & Freezing Maps:</Text>
            <ButtonList links={icingLinks} navigation={navigation} />
            <StatusBar style="dark" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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