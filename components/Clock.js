import { View, Text, StyleSheet } from "react-native";


export default function Clock () {
    let now = new Date();
    return (
        <View style={styles.timeContainer}>
            <Text>Current Zulu time: {now.getUTCHours()}:{now.getUTCMinutes()}</Text> 
            <Text>Current Local time: {now.getHours()}:{now.getMinutes()}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    timeContainer: {
        padding: 10
    }
})