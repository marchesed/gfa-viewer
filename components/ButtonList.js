import { TouchableHighlight, Text, StyleSheet } from "react-native";
import { months, padHour, randNum } from "../utils/utils";

export default function ButtonList({ links, navigation, region}) {
    let now = new Date();
    let UTCHour = now.getUTCHours();
    let incrementDay = false;
    let UTCDiff = now.getTimezoneOffset() / 60;


    const getFirstHour = () => {
        let firstHour;
        if (UTCHour < 6) {
            firstHour = 0
        }
        if (UTCHour >= 6) {
            firstHour = 6
        }
        if (UTCHour >= 12) {
            firstHour = 12
        }
        if (UTCHour >= 18) {
            firstHour = 18
        }
        return firstHour;
    }
    
    return links.map((link, i) => {
        let firstHour = getFirstHour();
        let hour = (i * 6) + firstHour;

        if (hour === 0) {
            incrementDay = true;
        }
        if (hour === 24 && i !== 0) {
            hour = 0;
            incrementDay = true;
        }
        if (hour === 30) {
            hour = 6;
            incrementDay = true;
        }
        let date = incrementDay ? now.getDate() + 1 : now.getDate();
        let EstDiff = hour === 0 ? 24 - UTCDiff : hour - UTCDiff
        let buttonText = `Valid on ${months[now.getMonth()]} ${date} at ${padHour(hour) + ":00"} UTC (${padHour(EstDiff) + ":00"} Local)`;

        return (
            <TouchableHighlight 
                underlayColor={'aqua'} 
                style={styles.btn} 
                onPress={() => navigation.navigate('Map', { imageURL: link, region: region, hour: hour })}
                key={randNum()}
            >
                <Text style={styles.btnText}>{buttonText}</Text>
            </TouchableHighlight>
        )
    })
}

const styles = StyleSheet.create({
    btn: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        margin: 10,
        backgroundColor: 'aquamarine',
        alignContent: 'center',
        borderRadius: 5
    },
    btnText: {
        fontWeight: 'bold',
        textAlign: 'center'
    }
});