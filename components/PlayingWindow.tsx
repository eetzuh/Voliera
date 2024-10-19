import { View, Text, Image } from 'react-native'
import React from 'react'
import { useTracks, useTheme } from '../context/Context'
import { TouchableOpacity } from 'react-native-gesture-handler'

const PlayingWindow = () => {
  const { artwork64, playing } = useTracks()
  const { theme } = useTheme()

  return (
    playing && (
      <View style={{ position: 'absolute', bottom: 0, height: 180, backgroundColor: theme.colorSecondary, width: '100%', borderTopLeftRadius: 16, borderTopRightRadius: 16, elevation: 10 }}>
        <Image source={artwork64 !== undefined ? { uri: `data:image/jpeg;base64,${artwork64}` } : require('../assets/artworkPlaceholder.jpg')}
          style={{ width: "100%", height: 58, borderTopLeftRadius: 16, borderTopRightRadius: 16, opacity: 0.5 }}></Image>
        <View style={{flexDirection:'row', alignItems:'center', gap:20, paddingHorizontal:20,marginVertical: 10 }}>
          <Text numberOfLines={1} style={{ color: theme.textColorPrimary, fontWeight: 500, fontSize: 16.5, flex:1 }}>{playing.artist && playing.artist + " - "}{playing.title}</Text>
          <TouchableOpacity onPress={()=>console.log("pocelo")} style={{backgroundColor:'red'}}>
            <Text style={{color:theme.textColorPrimary}}>PLAY</Text>
          </TouchableOpacity>
        </View>
      </View>
    )

  )
}

export default PlayingWindow