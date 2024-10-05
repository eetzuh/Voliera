import { View, Text, Image } from 'react-native'
import React, {useEffect, useState} from 'react'
import * as FileSystem from 'expo-file-system';
import parse from 'id3-parser'
import { toByteArray } from 'react-native-quick-base64';

const Track = ({ uri, duration }: { uri: string, duration:number }) => {
  interface ID3Structure {
      artist: string | null;
      album: string | null;
      title: string | null;
      year: string | null;
      image: string | null;
  }

  const [artwork, setArtwork] = useState<string | null>(null)
  const [songInfo, setSongInfo] = useState<ID3Structure>()

  function arrayBufferToBase64(buffer: ArrayLike<number>) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
  async function getSongInfo(uri: string) {
    const readFileInfo = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    const ID3Tags = parse(toByteArray(readFileInfo))
     if (ID3Tags && ID3Tags.image && ID3Tags.image.data) {
      const base64Image = arrayBufferToBase64(ID3Tags.image.data);
      setArtwork(base64Image)
    }
  }
  useEffect(()=>{
    getSongInfo(uri)
  },[])

  return (
    <View style={{ width: "100%", height: 65, backgroundColor: '#76738160', justifyContent:'center', paddingHorizontal:20 }}>
      {artwork !== null ?
        <Image source={{ uri: `data:image/jpeg;base64,${artwork}` }}
          style={{ width: 60, height: 60, borderWidth: 2, borderRadius:10 }} />
        :
        <Text>nema</Text>
      }
    </View>
  )
}

export default Track