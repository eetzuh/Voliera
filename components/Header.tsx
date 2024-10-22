import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { DrawerActions } from '@react-navigation/native'
import { useTheme } from '../context/Context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, { SharedValue } from 'react-native-reanimated'

const Header = ({ offset }: { offset: SharedValue<number> }) => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    return (
        <Animated.View style={{ height: 65, top: offset, width: "100%", flexDirection: 'row', gap: 30, justifyContent: 'space-between', paddingHorizontal: 24, alignItems: 'center', position: 'absolute', zIndex: 10 }}>
            <TouchableOpacity style={{ backgroundColor: theme.bgColorPrimay, padding: 6, borderRadius: 13 }} onPress={() => { navigation.dispatch(DrawerActions.toggleDrawer()) }}>
                <MaterialIcons name="format-list-bulleted" size={26} color={theme.textColorPrimary} />
            </TouchableOpacity>
            <View style={{ backgroundColor: theme.colorLight, flex: 1, borderRadius: 18, height: 38, marginRight: 5, justifyContent: 'center', paddingHorizontal: 20 }}>
                <TextInput style={{ fontSize: 16, color: theme.textColorPrimary }} placeholderTextColor={theme.textColorSecondary} placeholder='Search...'></TextInput>
            </View>
        </Animated.View>
    )
}

export default Header