import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SongsScreen from "./screens/SongsScreen";
import { useTheme } from "../context/Context";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    const {theme, artworkColors} = useTheme();
    return (
        <Tab.Navigator
            screenOptions={
                {
                    tabBarShowLabel: false,
                    headerShown: false,
                    tabBarStyle: {
                        position: "absolute",
                        height: 58,
                        backgroundColor: theme.colorSecondary,
                        borderTopLeftRadius: 16, borderTopRightRadius: 16,
                        borderBlockColor: "transparent",
                    }
                }}>
            <Tab.Screen name="Songs" component={SongsScreen} />
        </Tab.Navigator>
    );
}