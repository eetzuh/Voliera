import { View, Text, Image, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getTrackMetadata, insertTrackMedatada } from '../db/database';
import { getAudioMetadata } from '@missingcore/audio-metadata';
import { useTheme, useTracks } from '../context/Context';
import RNFS from "react-native-fs";
import { getColors } from 'react-native-image-colors'
import { TagStructure, AndroidArtworkColors } from '../interfaces/Interfaces';
import { Play, Pause } from '../helpers/Helpers';
import Ionicons from '@expo/vector-icons/Ionicons';

const Track = React.memo(({ uri, duration, date, id }: { uri: string, duration: number, date: number, id: number }) => {

  const [songInfo, setSongInfo] = useState<TagStructure>({
    id: id,
    artist: undefined,
    album: undefined,
    albumTrack: undefined,
    title: uri.split("/")[uri.split("/").length - 1],
    year: undefined,
  })

  const { theme, artworkColors, setArtworkColors } = useTheme();
  const { playing, setPlaying, setArtwork64, paused, setPaused } = useTracks();
  const [artwork, setArtwork] = useState<string | undefined>();
  const [colors, setColors] = useState<AndroidArtworkColors | null>(artworkColors);

  const getArtwork = async (uri: string | undefined, artwork: string | false) => {
    let base64: string | false = false;
    if (artwork) {
      base64 = artwork;
    } else {
      if (uri !== undefined) {
        const data = await getAudioMetadata(uri, ["artwork"])
        if (data.metadata.artwork) {
          base64 = data.metadata.artwork;
        }
      }
    }
    if (base64) {
      const base64Image = base64.replace(/^data:image\/\w+;base64,/, '');
      setArtwork(base64Image);
      getColors(base64).then((res) => {
        const colorData = res as AndroidArtworkColors
        setColors(colorData);
      }).catch((err) => {
        console.log(err);
      })
    }
  }

  async function getAndSaveSongInfo(uri: string) {
    const wantedTags = ['album', 'artist', 'name', 'track', 'year', 'artwork'] as const;
    try {
      const data = await getAudioMetadata(uri, wantedTags);
      if (data) {
        // console.log(data.metadata.name);
        setSongInfo({
          ...songInfo,
          artist: data.metadata.artist,
          album: data.metadata.album,
          albumTrack: data.metadata.track,
          title: data.metadata.name ? data.metadata.name : uri.split("/")[uri.split("/").length - 1],
          year: data.metadata.year,
        })
        if (data.metadata.artwork) {
          getArtwork(uri, data.metadata.artwork)
        }
      }
    } catch (error: any) {
      if (error.message.includes("Not an ID3v1 tag")) {
        try {
          const newFileUri = uri.replace(/\.\w+$/, `.m4a`);
          // console.log(uri);
          // await RNFS.moveFile(uri, newFileUri);
          // await RNFS.unlink(uri);
        } catch (error) {
          console.log(error);
        }
      }

    }
  }

  const [trackExists, setTrackExists] = useState<boolean>(false);

  useEffect(() => {
    async function checkTrackMetadata(trackID: number) {
      const metadata: TagStructure | undefined = await getTrackMetadata(trackID);
      if (metadata !== undefined) {
        setTrackExists(true)
        setSongInfo({
          ...songInfo,
          artist: metadata.artist,
          album: metadata.album,
          albumTrack: metadata.albumTrack,
          title: metadata.title,
          year: metadata.year,
        })
        getArtwork(uri, false)
        // console.log(JSON.stringify(metadata) + "*************DB");
        return
      } else {
        // console.log("tusam" + uri);
        await getAndSaveSongInfo(uri)
      }
    }

    checkTrackMetadata(id)
  }, [])

  useEffect(() => {
    async function insert() {
      await insertTrackMedatada(songInfo);
    }
    if (songInfo.artist && songInfo.title && !trackExists) {
      insert();
    }
  }, [songInfo]);

  const operateTrack = async () => {
    if (playing && playing.id == songInfo.id && !paused) {
      await Pause();
      setPaused(true);
      return;
    }
    await Play(uri);
    setPaused(false);
    setPlaying({ ...songInfo, uri: uri, duration: duration });
    setArtworkColors(colors);
    setArtwork64(artwork)
  }

  return (
    <Pressable onPress={async () => await operateTrack()}
      style={[{ width: "100%", height: 75, alignItems: 'center', flexDirection: 'row', gap: 20, paddingHorizontal: 22 },
      (playing !== false && playing.id == songInfo.id) && { backgroundColor: colors?.darkVibrant }]}>
      <View style={{elevation:4, width:60, height:60, borderRadius: 10}}>
        <Image source={artwork !== undefined ? { uri: `data:image/jpeg;base64,${artwork}` } : require('../assets/artworkPlaceholder.jpg')}
          style={{ width:'100%', height:'100%', borderRadius: 10 }} />
      </View>
      <View style={{ flex: 1, flexDirection: 'row', height: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ gap: 4, flex: 1, paddingRight: 20 }}>
          <Text numberOfLines={1} style={{ flex: 1, color: theme.textColorPrimary, fontWeight: 700, fontSize: 15, maxHeight: 20 }}>{songInfo.title}</Text>
          <View style={{ flex: 1, maxHeight: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text numberOfLines={1} style={{ flex: 1, color: theme.textColorSecondary, fontWeight: 400, fontSize: 14 }} >{songInfo.artist ? songInfo.artist : "Unknown Artist"}</Text>
            <Text style={{ color: theme.textColorSecondary, fontWeight: 400, fontSize: 14 }}>{Math.floor(duration / 60) < 10 && 0}{Math.floor(duration / 60)}:{Math.floor(duration % 60)}</Text>
          </View>
        </View>
        <Pressable>
        <Ionicons name="ellipsis-horizontal" size={24} color={theme.textColorPrimary} />
        </Pressable>
      </View>
    </Pressable>
  )
});

export default Track