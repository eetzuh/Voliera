import { StatusBar } from 'expo-status-bar';
import { styles } from './styles/AppStyles';
import { light, dark } from './styles/Colors';
import { StyleSheet, Text, View, Appearance, useColorScheme } from 'react-native';

export default function App() {

  const colorScheme = useColorScheme();
  const themeStyle = colorScheme === "dark" ? dark : light;

  return (
    <View style={[styles.container, {backgroundColor:themeStyle.bgColorPrimay}]}>
      <Text style={{color:themeStyle.textColorPrimary}}>Voliera</Text>
      <StatusBar style="auto" />
    </View>
  );
}
