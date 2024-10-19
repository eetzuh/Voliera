import { View, Text, Image } from 'react-native'
import React from 'react'
import { useTracks, useTheme } from '../context/Context'
import { TouchableOpacity } from 'react-native'
import { GestureDetector, Gesture, Directions } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

const PlayingWindow = () => {
    const { artwork64, playing, setPlaying, paused, setPaused } = useTracks()
    const { theme } = useTheme()

    const close = Gesture.Fling().direction(Directions.DOWN).onEnd(() => {
        runOnJS(setPlaying)(false)
    });
    const open = Gesture.Fling().direction(Directions.UP).onEnd(() => {
        console.log("OTVORI");
    });
    const openWithTap = Gesture.Tap().onEnd(() => {
        console.log("TAP");
    })
    const gesture = Gesture.Simultaneous(close, open, openWithTap)

    return (
        playing && (
            <GestureDetector gesture={gesture}>
                <View style={{ position: 'absolute', bottom: 58, height: 122, backgroundColor: theme.colorSecondary, width: '100%', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                    <Image source={artwork64 !== undefined ? { uri: `data:image/jpeg;base64,${artwork64}` } : require('../assets/artworkPlaceholder.jpg')}
                        style={{ width: "100%", height: 58, borderTopLeftRadius: 16, borderTopRightRadius: 16, opacity: 0.5 }}></Image>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, paddingHorizontal: 20, marginVertical: 10 }}>
                        <Text numberOfLines={1} style={{ color: theme.textColorPrimary, fontWeight: 500, fontSize: 16.5, flex: 1 }}>{playing.artist && playing.artist + " - "}{playing.title}</Text>
                        <TouchableOpacity onPress={() => setPaused(!paused)} style={{ backgroundColor: 'red', zIndex: 5, width: 50 }}>
                            <Text style={{ color: theme.textColorPrimary }}>{paused ? "PLAY" : "PAUSE"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </GestureDetector>
        )

    )
}

export default PlayingWindow