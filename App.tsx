import { PermissionsAndroid, useColorScheme, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { light, dark } from './styles/Colors';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeContext } from './context/Context';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTabs from './components/BottomTabs';
import { useEffect } from 'react';

export default function App() {
  const colorScheme = useColorScheme();
  const themeStyle = colorScheme === "dark" ? dark : light;

  const requestStorageAccessPermission = async()=>{
    const readPermission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO;
    const hasPermission = await PermissionsAndroid.check(readPermission);
    if (hasPermission) {
      console.log('Permission Granted');
      return true;
    } else {
      try {
        const status = await PermissionsAndroid.request(readPermission);
        if (status === PermissionsAndroid.RESULTS.GRANTED) {
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
  useEffect(()=>{
    requestStorageAccessPermission()
  },[])

  return (
    <View style={{ flex: 1, backgroundColor: themeStyle.bgColorPrimay }}>
      <NavigationContainer>
        <ThemeContext.Provider value={themeStyle}>
          <SafeAreaView style={{ flex: 1 }}>
            <StatusBar style="auto" />
            <BottomTabs />
          </SafeAreaView>
        </ThemeContext.Provider>
      </NavigationContainer>
    </View>
  );
}
