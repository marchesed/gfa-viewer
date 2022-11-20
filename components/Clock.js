import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { padHour } from "../utils/utils";


export default function Clock () {

    const [date, setDate] = useState(new Date())

    useEffect(() => {
        setInterval(() => setDate(new Date()), 10000);
    }, []);

    return (
        <View style={styles.timeContainer}>
            <Text>Current Zulu time: {padHour(date.getUTCHours())}:{padHour(date.getUTCMinutes())}</Text> 
            <Text>Current Local time: {padHour(date.getHours())}:{padHour(date.getMinutes())}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    timeContainer: {
        padding: 10
    }
})