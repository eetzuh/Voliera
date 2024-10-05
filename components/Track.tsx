import { View, Text, Image } from 'react-native'
import React from 'react'

const Track = ({albumImage}:{albumImage: string | null}) => {
  return (
    <View style={{width:"100%", height:60, backgroundColor:'#76738160'}}> 
    {albumImage !== null ?
        <Image source={{uri:`data:image/jpeg;base64,${albumImage}` }}
        style={{ width: 200, height: 200, borderWidth:2 }}/>
    :
    <Text>asd</Text>
    }
    </View>
  )
}

export default Track