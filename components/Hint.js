import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { padHour } from "../utils/utils";
import { Dimensions } from 'react-native';
import { TouchableHighlight } from "react-native-gesture-handler";

const windowWidth = Dimensions.get('window').width;

export default function Hint () {

    // const [date, setDate] = useState(new Date())

    useEffect(() => {
        // setInterval(() => setDate(new Date()), 10000);
    }, []);

    return (
        <View style={styles.hintContainer}>
            <Text style={styles.hintText}>Hint: You can pinch or double tap to zoom in on the graph</Text>
            <TouchableHighlight>
                <Text style={styles.hintText}>X</Text>
            </TouchableHighlight>
        </View>
    )
}

const styles = StyleSheet.create({
    hintContainer: {
        display: 'flex',
        alignContent: 'space-between',
        position: 'absolute',
        padding: 10,
        margin: 10,
        backgroundColor: 'black',
        borderRadius: 4,
        width: windowWidth - 20
    },
    hintText: {
        color: 'white',
        fontWeight: 'bold'
    }
})