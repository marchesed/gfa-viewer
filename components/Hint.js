import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

export default function Hint ({ hintDismissed, dismissHint }) {

    return (
        <View style={[styles.hintContainer, hintDismissed ? styles.hintDismissed : '']}>
            <Text style={[styles.hintText, styles.flex7]}>Hint: You can pinch to zoom in/out on the graph. You can also rotate the graph using 2 fingers.</Text>
            <TouchableHighlight 
                style={styles.hintCloseCircle} 
                underlayColor={'grey'}
                onPress={() => dismissHint()}>
                <Text style={styles.hintCloseX}>x</Text>
            </TouchableHighlight>
        </View>
    )
}

const styles = StyleSheet.create({
    hintContainer: {
        display: 'flex',
        flex: 10,
        flexDirection: 'row',
        position: 'absolute',
        padding: 10,
        margin: 10,
        backgroundColor: '#757471',
        borderRadius: 4,
        width: windowWidth - 20,
        zIndex: 420
    },
    hintText: {
        color: 'white',
        fontWeight: 'bold',
    },
    hintCloseX: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold'
    },
    hintCloseCircle: {
        display: 'flex',
        backgroundColor: 'white',
        width: 30,
        height: 30,
        borderRadius: 15,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    flex7: {
        flex: 7,
    },
    hintDismissed: {
        display: 'none'
    }
})