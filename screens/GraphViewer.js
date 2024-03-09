import React, { useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import Hint from "../components/Hint";
import AsyncStorage from '@react-native-async-storage/async-storage';
const dismissHintKey = "@dismissed_hint";

export default function GraphViewer({ route, navigation }) {

    const { imageURL, region, hour, hintDismissed } = route.params;

    const [dismissHintClicked, setDismissHintClicked] = useState(false);
    const [gestureDetected, setGestureDetected] = useState(false);
    
    useEffect(() => {
        navigation.setOptions({ title: region + ' valid on ' + hour + ' UTC'});
    }, []);

    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const xPosition = useSharedValue(0);
    const savedXPosition = useSharedValue(0);
    const yPosition = useSharedValue(0);
    const savedYPosition = useSharedValue(0);
    const rotation = useSharedValue(0);
    const savedRotation = useSharedValue(0);

    const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
        scale.value = savedScale.value * e.scale;
    })
    .onEnd((e) => {
        if (e.scale < 1) {
            scale.value = 1;
            xPosition.value = 0;
            yPosition.value = 0;
        }
        runOnJS(setGestureDetected)(true);
        savedScale.value = scale.value;
    });

    // const doubleTap = Gesture.Tap()
    // .numberOfTaps(2)
    // .maxDuration(250)
    // .onStart(() => {
    //     if (scale.value <= 1) {
    //         scale.value = savedScale.value * 2;
    //     } else {
    //         xPosition.value = 0;
    //         yPosition.value = 0;
    //         savedXPosition.value = 0;
    //         savedYPosition.value = 0;
    //         scale.value = 1;
    //     }
    //     savedScale.value = scale.value;
    // });

    const panGesture = Gesture.Pan()
    .onUpdate((e) => {
        if (scale.value !== 1) {
            xPosition.value = savedXPosition.value + e.translationX;
            yPosition.value = savedYPosition.value + e.translationY;
        }
    })
    .onEnd((e) => {
        if (xPosition.value < -200 || xPosition.value > 200) {
            xPosition.value = withTiming(0, { duration: 100 });
        }
        savedXPosition.value = xPosition.value;
        savedYPosition.value = yPosition.value;
    });

    const rotate = Gesture.Rotation()
    .onUpdate((e) => {
        rotation.value = savedRotation.value + e.rotation;
    })
    .onEnd(() => {
        savedRotation.value = rotation.value;
        runOnJS(setGestureDetected)(true)
    });

    const composed = Gesture.Simultaneous(pinchGesture, panGesture, rotate);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { scale: scale.value }, 
                { translateX: xPosition.value }, 
                { translateY: yPosition.value},
                { rotateZ: `${(rotation.value / Math.PI) * 180}deg` }
            ],
        }
    });

    const dismissHint = async() => {
        setDismissHintClicked(true);
        try {
            await AsyncStorage.setItem(dismissHintKey, JSON.stringify(true))
        } catch (error) {
            console.error(`Error setting ${dismissHintKey}`)
        }
    }

    const resetImage = async() => {
        scale.value = 1;
        savedScale.value = 1;
        xPosition.value = 0;
        savedXPosition.value = 0;
        yPosition.value = 0;
        savedYPosition.value = 0;
        rotation.value = 0;
        savedRotation.value = 0;
        setGestureDetected(false);
    }

    return (
        <GestureHandlerRootView>
            <View>
                {gestureDetected &&
                    <TouchableHighlight onPress={() => resetImage()} style={styles.resetButton}>
                        <Text style={styles.resetButtonText}>Reset Graph</Text>
                    </TouchableHighlight>
                }
                <Hint hintDismissed={hintDismissed || dismissHintClicked} dismissHint={dismissHint} />
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
        </GestureHandlerRootView>
    )
}
const styles = StyleSheet.create({
    resetButton: {
        margin: 20,
        padding: 10,
        position: 'absolute',
        right: 0,
        bottom: 20,
        zIndex: 999,
        backgroundColor: 'grey',
        borderRadius: 4
    },
    resetButtonText: {
        color: 'white',
        fontWeight: 'bold'
    }
});
