import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";


export default function Clock () {

    const [date, setDate] = useState(new Date())

    useEffect(() => {
        setInterval(() => setDate(new Date()), 30000);
    }, []);

    return (
        <View style={styles.timeContainer}>
            <Text>Current Zulu time: {date.getUTCHours()}:{date.getUTCMinutes()}</Text> 
            <Text>Current Local time: {date.getHours()}:{date.getMinutes()}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    timeContainer: {
        padding: 10
    }
})