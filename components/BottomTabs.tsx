import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SongsScreen from "./screens/SongsScreen";
import { useTheme, useTracks } from "../context/Context";
import React from "react";
import { View } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import PlayingWindow from "./PlayingWindow";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    const { theme, artworkColors, setArtworkColors } = useTheme();
    const { playing } = useTracks();
    return (
        <>
        {playing && <PlayingWindow></PlayingWindow>}
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarShowLabel: false,
                headerShown: false,
                tabBarStyle: {
                    position: "absolute",
                    paddingHorizontal:5,
                    height: 58,
                    backgroundColor: theme.colorSecondary,
                    borderTopLeftRadius: playing ? 0 : 16, 
                    borderTopRightRadius: playing ? 0 : 16,
                    borderBlockColor: "transparent",
                    zIndex: 2,
                    elevation: 10,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName : string= 'queue-music';
                    if (route.name == "Songs") {
                        iconName = 'music-note'
                    } else if (route.name == "Explore") {
                        iconName = 'library-music'
                    }

                    return (<View style={{width:65, backgroundColor:color, justifyContent:'center',alignItems:'center', height:40, borderRadius:16}}>
                        <MaterialIcons name={iconName as keyof typeof MaterialIcons.glyphMap} size={24} color={theme.theme == "dark" ? theme.textColorPrimary : theme.colorLight} />
                    </View>)
                },
                tabBarActiveTintColor: 'orange',
                tabBarInactiveTintColor: theme.colorLight
            })}>
            {/* <Tab.Screen name="Explore" component={SongsScreen} /> */}
            <Tab.Screen name="Songs" component={SongsScreen} />
            {/* <Tab.Screen name="Playlists" component={SongsScreen} /> */}
        </Tab.Navigator >
        </>

    );
}