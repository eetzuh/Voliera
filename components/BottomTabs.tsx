import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SongsScreen from "./screens/SongsScreen";
import { useTheme, useTracks } from "../context/Context";
import PlayingWindow from "./PlayingWindow";
import React from "react";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    const { theme, artworkColors, setArtworkColors } = useTheme();
    const {playing} = useTracks();
    return (
        <Tab.Navigator
            screenOptions={
                {
                    tabBarBackground: () => (
                        <PlayingWindow></PlayingWindow>

                    ),
                    tabBarShowLabel: false,
                    headerShown: false,
                    tabBarStyle: {
                        position: "absolute",
                        height: playing == false ? 58 : 180,
                        backgroundColor: theme.colorSecondary,
                        borderTopLeftRadius: 16, borderTopRightRadius: 16,
                        borderBlockColor: "transparent",
                        zIndex: 2,
                        elevation: 10,
                        paddingTop:playing == false ? 0 : 122,
                    }
                }}>
            <Tab.Screen name="Songs" component={SongsScreen} />
            <Tab.Screen name="Songs1" component={SongsScreen} />
            <Tab.Screen name="Songs2" component={SongsScreen} />
        </Tab.Navigator>

    );
}