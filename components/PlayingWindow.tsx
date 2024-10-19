import { View, Text, Image } from 'react-native'
import React from 'react'
import { useTracks, useTheme } from '../context/Context'

const PlayingWindow = () => {
  const { artwork64, playing } = useTracks()
  const { theme } = useTheme()

  return (
    playing && (
      <View style={{ position: 'absolute', bottom: 0, height: 180, backgroundColor: theme.colorSecondary, width: '100%', borderTopLeftRadius: 16, borderTopRightRadius: 16, elevation: 10 }}>
        <Image source={artwork64 !== undefined ? { uri: `data:image/jpeg;base64,${artwork64}` } : require('../assets/artworkPlaceholder.jpg')}
          style={{ width: "100%", height: 58, borderTopLeftRadius: 16, borderTopRightRadius: 16, opacity: 0.5 }}></Image>
        <Text style={{ color: theme.textColorPrimary, fontWeight: 500, paddingHorizontal: 20, marginVertical: 10, fontSize: 16.5 }}>{playing.artist && playing.artist + " - "}{playing.title}</Text>
      </View>
    )

  )
}

export default PlayingWindow