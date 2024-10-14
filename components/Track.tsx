import { View, Text, Image, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as FileSystem from 'expo-file-system';
import parse from 'id3-parser'
import { toByteArray } from 'react-native-quick-base64';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Track = ({ uri, duration, date, id }: { uri: string, duration: number, date: number, id:string }) => {

  interface ID3Structure {
    artist: string | undefined;
    album: string | undefined;
    albumTrack: string | number | undefined;
    title: string | undefined;
    year: string | undefined;
    image: string | undefined;
    genre: string | undefined;
    duration: number;
    date: number;
  }

  const [songInfo, setSongInfo] = useState<ID3Structure>({
    artist: undefined,
    album: undefined,
    albumTrack: undefined,
    title: uri.split("/")[uri.split("/").length-1],
    year: undefined,
    image: undefined,
    genre: undefined,
    duration: duration,
    date: date,
  })

  // async function findTrackInLocalStorage(){
  //   try{
  //     const value= await AsyncStorage.getItem(id);
  //   }catch(e){
  //     console.log(e)
  //   }
  // }

  const [artwork, setArtwork] = useState<string | undefined>();

  function arrayBufferToBase64(buffer: ArrayLike<number>) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  function createBase64Artwork(imageArray:ArrayLike<number> | undefined){
    if(imageArray){
      const base64Image = arrayBufferToBase64(imageArray);
      return base64Image
    }
    return undefined
  }


  async function getSongInfo(uri: string) {
    const readFileInfo = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    const ID3Tags = parse(toByteArray(readFileInfo))    
    if (ID3Tags) {
      console.log(ID3Tags.version);
      setSongInfo({
        ...songInfo,
        artist: ID3Tags.artist,
        album: ID3Tags.album,
        albumTrack: ID3Tags.track,
        title: ID3Tags.title ? ID3Tags.title : uri.split("/")[uri.split("/").length-1],
        year: ID3Tags.year,
        genre: ID3Tags.genre,
        // image: createBase64Artwork(ID3Tags.image?.data),
      })
      if (ID3Tags.image?.data) {
        setArtwork(createBase64Artwork(ID3Tags.image.data));
      }
    }else{
      console.log("NEMA");
      
    }
  }

  useEffect(() => {
    getSongInfo(uri)
  }, [])

  return (
    <View style={{ width: "100%", height: 65, backgroundColor: '#76738160', alignItems:'center', paddingHorizontal: 20, flexDirection:'row', gap:20 }}>
      {
        artwork !== undefined ?
        <Image source={{ uri: `data:image/jpeg;base64,${artwork}` }}
          style={{ width: 60, height: 60, borderWidth: 2, borderRadius: 10 }} />
          :
          <Text style={{width:60}}>nema</Text>
      }
      <Text numberOfLines={1} style={{width:"70%"}}>{songInfo.title}</Text>
      <Pressable>
        <Text>...</Text>
      </Pressable>
    </View>
  )
}

export default Track