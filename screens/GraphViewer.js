import React from "react";
import { View, Text, Dimensions, StyleSheet, Alert} from "react-native";
import { StatusBar } from 'expo-status-bar';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withDelay } from 'react-native-reanimated';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function GraphViewer({ route, navigation }) {

    const { imageURL } = route.params;

    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);

    const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
        scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
        if (scale.value < 1) {
            scale.value = 1;
        }
        savedScale.value = scale.value;
    });

    const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDuration(250)
    .onStart(() => {
        if (scale.value <= 1) {
            scale.value = savedScale.value * 2;
        } else {
            scale.value = 1;
        }
        savedScale.value = scale.value;
    });

    const composed = Gesture.Simultaneous(pinchGesture, doubleTap);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
      }));

    return(
        <View>
            <GestureDetector gesture={composed}>
                <Animated.Image
                    source={{ uri: imageURL }}
                    style={[{
                        width: '100%',
                        height: '100%'
                    }, animatedStyle]}
                    resizeMode="contain"
                />
            </GestureDetector>
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        width: windowWidth,
        height: windowHeight - 100
    }
});