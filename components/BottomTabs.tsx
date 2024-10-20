import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SongsScreen from "./screens/SongsScreen";
import { useTheme, useTracks } from "../context/Context";
import React from "react";
import { View } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    const { theme, artworkColors, setArtworkColors } = useTheme();
    const { playing } = useTracks();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarBackground: () => (
                    playing &&
                    <View style={{ position: 'absolute', bottom: 0, height: 180, backgroundColor: theme.colorSecondary, width: '100%', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}></View>
                ),
                tabBarShowLabel: false,
                headerShown: false,
                tabBarStyle: {
                    position: "absolute",
                    paddingHorizontal:5,
                    // height: playing == false ? 58 : 180,
                    height: 58,
                    backgroundColor: theme.colorSecondary,
                    borderTopLeftRadius: 16, borderTopRightRadius: 16,
                    borderBlockColor: "transparent",
                    zIndex: 2,
                    elevation: 10,
                    // paddingTop:playing == false ? 0 : 122,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName : string= 'queue-music';
                    if (route.name == "Songs") {
                        iconName = 'music-note'
                    } else if (route.name == "Explore") {
                        iconName = 'library-music'
                    }

                    return (<View style={{width:65, backgroundColor:color, justifyContent:'center',alignItems:'center', height:40, borderRadius:16}}>
                        <MaterialIcons name={iconName as keyof typeof MaterialIcons.glyphMap} size={24} color={theme.textColorPrimary} />
                    </View>)
                },
                tabBarActiveTintColor: 'orange',
                tabBarInactiveTintColor: theme.colorLight
            })}>
            <Tab.Screen name="Explore" component={SongsScreen} />
            <Tab.Screen name="Songs" component={SongsScreen} />
            <Tab.Screen name="Playlists" component={SongsScreen} />
        </Tab.Navigator >

    );
}