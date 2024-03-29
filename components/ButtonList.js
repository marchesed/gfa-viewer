import { TouchableHighlight, Text, StyleSheet } from "react-native";
import { months, padHour, randomNumber } from "../utils/utils";
import { useAnalytics } from '@segment/analytics-react-native';

export default function ButtonList({ links, navigation, region, hintDismissed }) {
    let now = new Date();
    let UTCHour = now.getUTCHours();
    let incrementDay = false;
    let UTCDiff = now.getTimezoneOffset() / 60;
    const { track } = useAnalytics();

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

    const buttonClick = (navigationProps) => {
        track(`Graph viewed ${navigationProps.region}`);
        navigation.navigate('Map', navigationProps);
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
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        let date = incrementDay ? tomorrow.getDate() : now.getDate();
        let month = incrementDay ? tomorrow.getMonth() : now.getMonth();
        let EstDiff = hour === 0 ? 24 - UTCDiff : hour - UTCDiff;
        let EstDiffFixed = EstDiff < 0 ? 24 + EstDiff : EstDiff;
        let buttonText = `Valid on ${months[month]} ${date} at ${padHour(hour) + ":00"} UTC (${padHour(EstDiffFixed) + ":00"} Local)`;

        const navigationProps = {
            imageURL: link,
            region: region,
            hour: hour,
            hintDismissed: hintDismissed
        };

        return (
            <TouchableHighlight 
                underlayColor={'aqua'} 
                style={styles.btn} 
                onPress={() => buttonClick(navigationProps)}
                key={randomNumber()}
            >
                <Text style={styles.btnText}>{buttonText}</Text>
            </TouchableHighlight>
        )
    })
}

const styles = StyleSheet.create({
    btn: {
        paddingHorizontal: 10,
        paddingVertical: 20,
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