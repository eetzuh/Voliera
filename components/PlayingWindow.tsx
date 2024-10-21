import { View, Text, Image, Dimensions, NativeSyntheticEvent, TextLayoutEventData } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useTracks, useTheme } from '../context/Context'
import { TouchableOpacity } from 'react-native'
import { GestureDetector, Gesture, Directions } from 'react-native-gesture-handler';
import { Easing, runOnJS, withTiming } from 'react-native-reanimated';
import { Play, Pause, Stop } from '../helpers/Helpers';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Animated, { useSharedValue } from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
import { changePosition } from '../helpers/Helpers'
import { Marquee } from '@animatereactnative/marquee';

const PlayingWindow = () => {
    const { artwork64, playing, setPlaying, paused, setPaused, setPosition, position } = useTracks()
    const { theme, artworkColors } = useTheme()
    const [minimized, setMinimized] = useState<boolean>(true);
    const [linesOfText, setLinesOfText] = useState<number>(1)
    const [linesOfTextMin, setLinesOfTextMin] = useState<number>(1)
    const color = useSharedValue(theme.colorSecondary)
    const height = useSharedValue(132)
    const artworkHeight = useSharedValue(58);
    const screenHeight = Dimensions.get('window').height;
    const screenWidth = Dimensions.get('window').width;
    const bottom = useSharedValue(58)
    const imageOpacity = useSharedValue(0.5);

    const close = Gesture.Fling().direction(Directions.DOWN).onEnd(async () => {
        if (!minimized) {
            bottom.value = withTiming(58)
            imageOpacity.value = withTiming(0.5)
            color.value = withTiming(theme.colorSecondary);
            height.value = withTiming(132);
            artworkHeight.value = withTiming(58);
            runOnJS(setMinimized)(true)
            return;
        }
        runOnJS(Stop)()
        runOnJS(setPlaying)(false)
    });
    const open = Gesture.Fling().direction(Directions.UP).onEnd(() => {
        bottom.value = withTiming(0)
        imageOpacity.value = withTiming(1)
        height.value = withTiming(screenHeight * 0.98);
        artworkHeight.value = withTiming(screenWidth);
        artworkColors?.darkVibrant && (color.value = withTiming(artworkColors.darkVibrant, {
            duration: 400,
            easing: Easing.inOut(Easing.quad)
        }));
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

    const getNumberOfLines = (e: NativeSyntheticEvent<TextLayoutEventData>, type: string) => {
        const value = e.nativeEvent.lines.length
        if (type == "max") {
            setLinesOfText(value > 1 ? 2 : 1)
        } else {
            setLinesOfTextMin(value > 1 ? 2 : 1)
        }
    }


    return (
        playing && (
            <GestureDetector gesture={gesture}>
                <Animated.View style={{ position: 'absolute', bottom: bottom, height: height, backgroundColor: color, width: '100%', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                    <Animated.View style={{ width: '100%', height: artworkHeight, opacity: imageOpacity }}>
                        <Image source={artwork64 !== undefined ? { uri: `data:image/jpeg;base64,${artwork64}` } : require('../assets/artworkPlaceholder.jpg')}
                            style={{ width: "100%", height: "100%", borderTopLeftRadius: 16, borderTopRightRadius: 16 }}></Image>
                    </Animated.View>
                    <Animated.View style={[{ alignItems: 'center', gap: 20, paddingHorizontal: 20, height: !minimized ? 130 : "auto", marginTop: 10, flexDirection: !minimized ? "column" : "row" }, !minimized && { justifyContent: 'center', marginBottom: 20 }]}>
                        {minimized ?
                            <View style={{flex:1}}>
                                <Text onTextLayout={(e) => getNumberOfLines(e, "min")} style={{ color: theme.textColorPrimary, fontWeight: 500, fontSize: 16.5, maxHeight: 30, minHeight: 25, position: 'absolute', opacity: 0 }}>{playing.artist && playing.artist + " - "}{playing.title}</Text>
                                {linesOfTextMin > 1 ?
                                    
                                    <Marquee spacing={30} speed={0.4}>
                                        <Text numberOfLines={1} style={{ color: theme.textColorPrimary, fontWeight: 500, fontSize: 16.5, maxHeight: 30, minHeight: 25 }}>{playing.artist && playing.artist + " - "}{playing.title}</Text>
                                    </Marquee>
                                    :
                                    <Text numberOfLines={1} style={{ color: theme.textColorPrimary, fontWeight: 500, fontSize: 16.5, maxHeight: 30, minHeight: 25 }}>{playing.artist && playing.artist + " - "}{playing.title}</Text>
                                }
                            </View>
                            :
                            <View style={{ justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                                <Text onTextLayout={(e) => getNumberOfLines(e, "max")} style={{ color: artworkColors?.lightVibrant, fontWeight: 700, fontSize: 24, maxHeight: 30, minHeight: 25, position: 'absolute', opacity: 0 }}>{playing.title}</Text>
                                {linesOfText > 1 ?
                                    <Marquee spacing={30} speed={0.4}>
                                        <Text style={{ color: artworkColors?.lightVibrant && artworkColors?.lightVibrant !== "#000000" ? artworkColors.lightVibrant : theme.textColorPrimary, fontWeight: 700, fontSize: 24, maxHeight: 30, minHeight: 25 }}>{playing.title}</Text>
                                    </Marquee>
                                    :
                                    <Text style={{ color: artworkColors?.lightVibrant && artworkColors?.lightVibrant !== "#000000" ? artworkColors.lightVibrant : theme.textColorPrimary, fontWeight: 700, fontSize: 24, maxHeight: 30, minHeight: 25 }}>{playing.title}</Text>
                                }
                                <Text numberOfLines={1} style={{ color: theme.textColorSecondary, fontWeight: 500, fontSize: 17, maxHeight: 30, minHeight: 25 }}>{playing.artist ? playing.artist : "Unknown Artist"}</Text>
                            </View>

                        }
                        <GestureDetector gesture={operateTrack}>
                            <TouchableOpacity hitSlop={10} style={{ width: 32, alignItems: 'center', zIndex: 5 }}>
                                <FontAwesome6 name={paused ? "play" : "pause"} size={!minimized ? 34 : 26} color={theme.textColorPrimary} iconStyle={{ elevation: 20 }} />
                            </TouchableOpacity>
                        </GestureDetector>
                    </Animated.View>
                    <View style={{ paddingHorizontal: 10, flex: 1 }}>
                        <Slider maximumValue={Math.floor(playing.duration) * 1000} style={{ flex: 1, maxHeight: 30 }} minimumTrackTintColor={artwork64 ? artworkColors?.vibrant : 'orange'} maximumTrackTintColor={theme.colorLight} thumbTintColor={theme.textColorPrimary}
                            onSlidingComplete={(res) => { changePosition(res); setPosition(res / 1000) }} />
                        {!minimized &&
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                                <Text style={{ color: theme.textColorSecondary, fontWeight: 400, fontSize: 14 }}>{Math.floor(position / 60) < 10 && 0}{Math.floor(position / 60)}:{Math.floor(position % 60) < 10 && 0}{Math.floor(position % 60)}</Text>
                                <Text style={{ color: theme.textColorSecondary, fontWeight: 400, fontSize: 14 }}>{Math.floor(playing.duration / 60) < 10 && 0}{Math.floor(playing.duration / 60)}:{Math.floor(playing.duration % 60) < 10 && 0}{Math.floor(playing.duration % 60)}</Text>
                            </View>
                        }
                    </View>
                </Animated.View>
            </GestureDetector>
        )

    )
}

export default PlayingWindow