import React, { useCallback, useContext } from 'react'
import { View, Text, FlatList } from 'react-native'
import { styles } from '../../styles/AppStyles'
import { ThemeContext, useTracks } from '../../context/Context'
import Track from '../Track';
import { Asset } from 'expo-media-library';

const SongsScreen = () => {
    const theme = useContext(ThemeContext);
    const { tracks } = useTracks();
    
    return (
        <View style={[styles.container, { backgroundColor: theme.bgColorPrimay }]}>
            <View style={{ height: 50, width: "100%", borderBottomWidth: 1, borderColor: theme.colorLight }}></View>
            <Text>Songs...</Text>
            <FlatList style={{gap:10}} keyExtractor={(item) => item.id} initialNumToRender={16} maxToRenderPerBatch={16} windowSize={2} data={tracks} renderItem={useCallback(({item} : {item:Asset})=>{
                    return (
                        <Track uri={item.uri} duration={item.duration} date={item.modificationTime} id={Number(item.id)} />
                    );
                },[])}>
            </FlatList>
        </View>
    )
}

export default SongsScreen