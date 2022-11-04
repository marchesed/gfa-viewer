import { TouchableHighlight, Text, StyleSheet } from "react-native";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function randNum () {
    return Math.floor(Math.random() * 12345);
}

export default function ButtonList({links, navigation}) {
    let now = new Date();
    let thisHour = now.getHours();
    let UTCHour = now.getUTCHours();
    let UTCDiff = UTCHour - thisHour;

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
        let incrementDay = false;
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
        let buttonText = `Valid on ${months[now.getMonth()]} ${date} at ${hour} UTC (${EstDiff + ":00"} EST)`;

        return (
            <TouchableHighlight 
                underlayColor={'aqua'} 
                style={styles.btn} 
                onPress={() => navigation.navigate('Map', { imageURL: link })}
                key={randNum()}
            >
                <Text style={styles.btnText}>{buttonText}</Text>
            </TouchableHighlight>
        )
    })
}

const styles = StyleSheet.create({
    btn: {
        padding: 10,
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