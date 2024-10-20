import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { DrawerActions } from '@react-navigation/native'
import { useTheme } from '../context/Context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Header = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    return (
        <View style={{ height: 65, width: "100%", flexDirection: 'row', gap: 30, justifyContent: 'space-between', paddingHorizontal: 24, alignItems: 'center' }}>
            <TouchableOpacity style={{ }} onPress={() => { navigation.dispatch(DrawerActions.toggleDrawer()) }}>
            <MaterialIcons name="format-list-bulleted" size={26} color={theme.textColorPrimary} />
            </TouchableOpacity>
            <View style={{backgroundColor:theme.colorLight, flex:1, borderRadius:18, height:38, marginRight:5, justifyContent:'center',paddingHorizontal:20}}>
                <TextInput style={{fontSize:16, color:theme.textColorPrimary}} placeholderTextColor={theme.textColorSecondary} placeholder='Search...'></TextInput>
            </View>
        </View>
    )
}

export default Header