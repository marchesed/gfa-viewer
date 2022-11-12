import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function GraphViewer({ route, navigation }) {

    const { imageURL, region, hour } = route.params;

    navigation.setOptions({ title: region + ' valid on ' + hour + ' UTC'})

    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const END_POSITION = 200;
    const onLeft = useSharedValue(true);
    const xPosition = useSharedValue(0);
    const yPosition = useSharedValue(0);

    const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
        scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
        if (scale.value < 1) {
            scale.value = 1;
            xPosition.value = 0;
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
            xPosition.value = 0;
            scale.value = 1;
        }
        savedScale.value = scale.value;
    });

    const panGesture = Gesture.Pan()
    .onUpdate((e) => {
        if (scale.value !== 1) {
            if (onLeft.value) {
                xPosition.value = e.translationX;
                yPosition.value = e.translationY;
            } else {
                xPosition.value = END_POSITION + e.translationX;
                yPosition.value = END_POSITION + e.translationY;
            }
        }
    })
    .onEnd((e) => {
        if (xPosition.value < -200 || xPosition.value > 200) {
            xPosition.value = withTiming(0, { duration: 100 });
            onLeft.value = true;
        }
    });

    const composed = Gesture.Simultaneous(pinchGesture, panGesture, doubleTap);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }, { translateX: xPosition.value }, { translateY: yPosition.value}],
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
