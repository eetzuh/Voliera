import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SongsScreen from "./screens/SongsScreen";
import { ThemeContext } from "../context/Context";
import { useContext} from "react";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    const theme = useContext(ThemeContext)
    return (
        <Tab.Navigator
            screenOptions={
                {
                    tabBarShowLabel: false,
                    headerShown: false,
                    tabBarStyle: {
                        position: "absolute",
                        backgroundColor: theme.colorSecondary,
                        borderTopLeftRadius: 16, borderTopRightRadius: 16,
                        borderBlockColor: "transparent",
                    }
                }}>
            <Tab.Screen name="Songs" component={SongsScreen} />
        </Tab.Navigator>
    );
}