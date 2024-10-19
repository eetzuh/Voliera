import { PermissionsAndroid, useColorScheme, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { light, dark } from './styles/Colors';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeContext, TrackContext } from './context/Context';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTabs from './components/BottomTabs';
import { useEffect, useState } from 'react';
import * as MediaLibrary from "expo-media-library"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDB } from './db/database';
import { TagStructure, AndroidArtworkColors } from './interfaces/Interfaces';
import 'react-native-gesture-handler';
import DrawerNav from './components/DrawerNav';

export default function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? dark : light;

  const [tracks, setTracks] = useState<MediaLibrary.Asset[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState<TagStructure | false>(false);
  const [artwork64, setArtwork64] = useState<string | undefined>(undefined)
  const [artworkColors, setArtworkColors] = useState<AndroidArtworkColors | null>({
    dominant: "#000000",
    average: "#000000",
    vibrant: "#000000",
    darkVibrant: "#000000",
    lightVibrant: "#000000",
    darkMuted: "#000000",
    lightMuted: "#000000",
    muted: "#000000",
    platform: "android"
  });
  const [savedMetadata, setSavedMetadata] = useState<boolean>(false)

  async function getSongs() {
    let allAssets: MediaLibrary.Asset[] = [];
    let hasMore = true;
    let after: undefined | MediaLibrary.AssetRef = undefined;

    const excludeDir = ['/Ringtones', '/Notifications', '/Alarms', '/System']
    while (hasMore) {
      const { assets, endCursor, hasNextPage } = await MediaLibrary.getAssetsAsync({
        mediaType: 'audio',
        first: 60,
        after: after,
      });

      allAssets = [...allAssets, ...assets];
      after = endCursor;
      hasMore = hasNextPage;
    }
    const filteredAssets = allAssets.filter(file => {
      return !excludeDir.some(excludeDir => file.uri.includes(excludeDir));
    })

    setTracks(filteredAssets.sort((a, b) => b.modificationTime - a.modificationTime))
    setLoading(false)

    return filteredAssets
  }

  const requestStorageAccessPermission = async () => {
    const readPermission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO;
    const hasPermission = await PermissionsAndroid.check(readPermission);
    if (hasPermission) {
      await getSongs();
      console.log('Permission Granted');
      return true;
    } else {
      try {
        const status = await PermissionsAndroid.request(readPermission);
        if (status === PermissionsAndroid.RESULTS.GRANTED) {
          await getSongs();
          console.log('Permission Granted');
          return true;
        } else {
          console.log('Permission Denied');
          return false;
        }
      } catch (error) {
        console.error('Permission Request Error: ', error);
        return false;
      }
    }
  }

  async function hasSavedMetadata() {
    try {
      const saved = await AsyncStorage.getItem("metadata_saved")
      if (saved) {
        console.log(saved);
        setSavedMetadata(true)
        return
      }
      await createDB();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const initialize = async () => {
      await hasSavedMetadata()
      await requestStorageAccessPermission()
    }
    initialize()
  }, [])

  const renderDrawer= () =>{
    return(
        <View>
            <Text>ASDF</Text>
        </View>
    )
}

  return (
    <View style={{ flex: 1, backgroundColor: theme.bgColorPrimay }}>
      <SafeAreaView style={{ flex: 1 }}>
          <NavigationContainer>
            <TrackContext.Provider value={{ tracks, loading, playing, setPlaying, artwork64, setArtwork64 }}>
              <ThemeContext.Provider value={{ theme, artworkColors, setArtworkColors }}>
                <StatusBar style="auto" />
                <DrawerNav />
              </ThemeContext.Provider>
            </TrackContext.Provider>
          </NavigationContainer>
      </SafeAreaView>
    </View>
  );
}
