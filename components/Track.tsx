import { View, Text, Image, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getTrackMetadata } from '../db/database';
import { getAudioMetadata } from '@missingcore/audio-metadata';

const Track = ({ uri, duration, date, id }: { uri: string, duration: number, date: number, id:number }) => {

  interface ID3Structure {
    artist: string | undefined;
    album: string | undefined;
    albumTrack: number | undefined;
    title: string | undefined;
    year: number | undefined;
    image: string | undefined;
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
    duration: duration,
    date: date,
  })

  const [artwork, setArtwork] = useState<string | undefined>();

  // function arrayBufferToBase64(buffer: ArrayLike<number>) {
  //   let binary = '';
  //   const bytes = new Uint8Array(buffer);
  //   const len = bytes.byteLength;
  //   for (let i = 0; i < len; i++) {
  //     binary += String.fromCharCode(bytes[i]);
  //   }
  //   return window.btoa(binary);
  // }

  // function createBase64Artwork(imageArray:ArrayLike<number> | undefined){
  //   if(imageArray){
  //     const base64Image = arrayBufferToBase64(imageArray);
  //     return base64Image
  //   }
  //   return undefined
  // }


  async function getAndSaveSongInfo(uri: string) {
    const wantedTags = ['album', 'artist', 'name', 'track', 'year', 'artwork'] as const;
    try {
      const data = await getAudioMetadata(uri, wantedTags);
      if(data){
        setSongInfo({
          ...songInfo,
          artist: data.metadata.artist,
          album: data.metadata.album,
          albumTrack: data.metadata.track,
          title: data.metadata.name ? data.metadata.name : uri.split("/")[uri.split("/").length-1],
          year: data.metadata.year,
        })
        if (data.metadata.artwork) {
          const base64Image = data.metadata.artwork.replace(/^data:image\/\w+;base64,/, '');
              setArtwork(base64Image);
            }
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(() => {
    async function checkTrackMetadata(trackID : number){
      const metadata = await getTrackMetadata(trackID);
      if(metadata !== undefined){
        if(metadata.length!= 0){
          console.log(trackID);
          return
        }
      }      
      getAndSaveSongInfo(uri)
    }
    checkTrackMetadata(id)
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