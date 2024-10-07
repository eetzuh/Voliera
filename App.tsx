import { PermissionsAndroid, useColorScheme, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { light, dark } from './styles/Colors';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeContext, TrackContext } from './context/Context';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTabs from './components/BottomTabs';
import { useEffect, useState } from 'react';
import * as MediaLibrary from "expo-media-library"

export default function App() {
  const colorScheme = useColorScheme();
  const themeStyle = colorScheme === "dark" ? dark : light;

  const [tracks, setTracks] = useState<MediaLibrary.Asset[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  async function getSongs() {
    const { assets } = await MediaLibrary.getAssetsAsync({ mediaType: 'audio' });
    const excludeDir = ['/Ringtones', '/Notifications', '/Alarms', '/System', ".flac"]
    const filteredAssets = assets.filter(file => {
      return !excludeDir.some(excludeDir => file.uri.includes(excludeDir));
    })
    // setTracks(filteredAssets)
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
  useEffect(() => {
    requestStorageAccessPermission()
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: themeStyle.bgColorPrimay }}>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          {tracks &&
            <TrackContext.Provider value={{ tracks, loading }}>
              <ThemeContext.Provider value={themeStyle}>
                <StatusBar style="auto" />
                <BottomTabs />
              </ThemeContext.Provider>
            </TrackContext.Provider>
          }
        </NavigationContainer>
      </SafeAreaView>
    </View>
  );
}
