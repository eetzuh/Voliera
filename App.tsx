import { useColorScheme, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { light, dark } from './styles/Colors';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeContext } from './context/Context';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTabs from './components/BottomTabs';

export default function App() {
  const colorScheme = useColorScheme();
  const themeStyle = colorScheme === "dark" ? dark : light;

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
