import React, { useCallback, useContext } from 'react'
import { View, Text, FlatList } from 'react-native'
import { styles } from '../../styles/AppStyles'
import { ThemeContext, useTracks } from '../../context/Context'
import Track from '../Track';
import { Asset } from 'expo-media-library';
import * as SQLite from 'expo-sqlite';

const SongsScreen = () => {
    const theme = useContext(ThemeContext);
    // const hasLocalMetadata = 
    const { tracks } = useTracks();
    return (
        <View style={[styles.container, { backgroundColor: theme.bgColorPrimay }]}>
            <View style={{ height: 50, width: "100%", borderBottomWidth: 1, borderColor: theme.colorLight }}></View>
            <Text>Songs...</Text>
            <FlatList keyExtractor={(item) => item.id} data={tracks} renderItem={useCallback(({item} : {item:Asset})=>{
                    return (
                        <Track uri={item.uri} duration={item.duration} date={item.modificationTime} id={item.id} />
                    );
                },[])}>
            </FlatList>
        </View>
    )
}

export default SongsScreen