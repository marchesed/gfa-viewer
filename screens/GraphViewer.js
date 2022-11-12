import React from "react";
import { View, Text, Dimensions, StyleSheet, Alert} from "react-native";
import { StatusBar } from 'expo-status-bar';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function GraphViewer({ route, navigation }) {

    const { imageURL } = route.params;

    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const END_POSITION = 200;
    const onLeft = useSharedValue(true);
    const onRight = useSharedValue(true);
    const leftPosition = useSharedValue(0);

    const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
        scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
        if (scale.value < 1) {
            scale.value = 1;
            leftPosition.value = 0;
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
            leftPosition.value = 0;
            scale.value = 1;
        }
        savedScale.value = scale.value;
    });

    const panGesture = Gesture.Pan()
    .onUpdate((e) => {
        if (scale.value !== 1) {
            if (onLeft.value) {
                leftPosition.value = e.translationX;
            } else {
                leftPosition.value = END_POSITION + e.translationX;
            }
        }
    })
    .onEnd((e) => {
        if (leftPosition.value < -200 || leftPosition.value > 200) {
            leftPosition.value = withTiming(0, { duration: 100 });
            onLeft.value = true;
        }
    });

    const composed = Gesture.Simultaneous(pinchGesture, panGesture, doubleTap);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }, { translateX: leftPosition.value }],
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