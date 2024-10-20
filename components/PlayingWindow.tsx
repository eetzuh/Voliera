import { View, Text, Image, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { useTracks, useTheme } from '../context/Context'
import { TouchableOpacity } from 'react-native'
import { GestureDetector, Gesture, Directions } from 'react-native-gesture-handler';
import { runOnJS, withTiming } from 'react-native-reanimated';
import { Play, Pause, Stop } from '../helpers/Helpers';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Animated, { useSharedValue } from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
import { changePosition } from '../helpers/Helpers';

const PlayingWindow = () => {
    const { artwork64, playing, setPlaying, paused, setPaused } = useTracks()
    const { theme, artworkColors } = useTheme()
    const [minimized, setMinimized] = useState<boolean>(true);
    const height = useSharedValue(132)
    const color = useSharedValue(theme.colorSecondary)
    const screenHeight = Dimensions.get('window').height;

    const close = Gesture.Fling().direction(Directions.DOWN).onEnd(async () => {
        if (!minimized) {
            runOnJS(setMinimized)(true)
            height.value = withTiming(132);
            color.value = withTiming(theme.colorSecondary);
            return;
        }
        runOnJS(Stop)()
        runOnJS(setPlaying)(false)
    });
    const open = Gesture.Fling().direction(Directions.UP).onEnd(() => {
        height.value = withTiming(screenHeight * 0.98);
        artworkColors?.darkVibrant && (color.value = withTiming(artworkColors.darkVibrant));
        runOnJS(setMinimized)(false)
    });
    const openWithTap = Gesture.Tap().onEnd(() => {
        runOnJS(setMinimized)(false)
        height.value = withTiming(screenHeight * 0.9);
        console.log("TAP");
    })
    const gesture = Gesture.Simultaneous(close, open)

    const operateTrack = Gesture.Tap().onEnd(async () => {
        if (playing && playing.uri !== null) {
            if (paused) {
                runOnJS(Play)(playing.uri)
                runOnJS(setPaused)(false)
                return
            }
            runOnJS(Pause)()
            runOnJS(setPaused)(true)
        }
    })

    return (
        playing && (
            <GestureDetector gesture={gesture}>
                <Animated.View style={{ position: 'absolute', bottom: minimized ? 58 : 0, height: height, backgroundColor: color, width: '100%', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                    <Image source={artwork64 !== undefined ? { uri: `data:image/jpeg;base64,${artwork64}` } : require('../assets/artworkPlaceholder.jpg')}
                        style={{ width: "100%", height: 58, borderTopLeftRadius: 16, borderTopRightRadius: 16, opacity: 0.5 }}></Image>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, paddingHorizontal: 20, marginTop: 10, marginBottom: 5 }}>
                        <Text numberOfLines={1} style={{ color: theme.textColorPrimary, fontWeight: 500, fontSize: 16.5, flex: 1 }}>{playing.artist && playing.artist + " - "}{playing.title}</Text>
                        <GestureDetector gesture={operateTrack}>
                            <TouchableOpacity hitSlop={10} style={{ width: 32, alignItems: 'center', zIndex: 5 }}>
                                <FontAwesome6 name={paused ? "play" : "pause"} size={26} color={theme.textColorPrimary} iconStyle={{ elevation: 20 }} />
                            </TouchableOpacity>
                        </GestureDetector>
                    </View>
                    <View style={{ flex: 1, paddingHorizontal: 10 }}>
                        <Slider maximumValue={Math.floor(playing.duration)*1000} style={{ flex: 1 }} minimumTrackTintColor={artwork64 ? artworkColors?.vibrant : 'orange'} maximumTrackTintColor={theme.colorLight} thumbTintColor={theme.textColorPrimary}
                         onSlidingComplete={(res) => changePosition(res)
                        } />
                    </View>
                </Animated.View>
            </GestureDetector>
        )

    )
}

export default PlayingWindow