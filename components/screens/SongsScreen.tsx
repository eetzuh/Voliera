import React, { useContext } from 'react'
import { View, Text } from 'react-native'
import { styles } from '../../styles/AppStyles'
import { ThemeContext } from '../../context/Context'

const SongsScreen = () => {
    const theme = useContext(ThemeContext);

    return (
        <View style={[styles.container,{backgroundColor:theme.bgColorPrimay}]}>
            <View style={{height:50, width:"100%", borderBottomWidth:1, borderColor:theme.colorLight}}></View>
            <Text>Songs...</Text>
        </View>
    )
}

export default SongsScreen