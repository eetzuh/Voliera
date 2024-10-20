import { createDrawerNavigator } from '@react-navigation/drawer'
import React from 'react'
import Settings from './screens/Settings'
import BottomTabs from './BottomTabs'
import { useTheme } from '../context/Context'

const DrawerNav = () => {
    const Drawer = createDrawerNavigator()
    const { theme } = useTheme()

    return (
        <Drawer.Navigator
            id="DrawerNav"
            screenOptions={{
                drawerType: 'front',
                swipeEdgeWidth: 80,
                drawerStyle: {
                    width: 250,
                    backgroundColor: theme.colorLight, 
                },
                headerShown: false
            }}>
            <Drawer.Screen options={{
            }} name='Main' component={BottomTabs} />
        </Drawer.Navigator>
    )
}

export default DrawerNav;