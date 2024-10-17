import React, { useCallback } from 'react'
import { View, Text, FlatList } from 'react-native'
import { styles } from '../../styles/AppStyles'
import {  useTracks, useTheme } from '../../context/Context'
import Track from '../Track';
import { Asset } from 'expo-media-library';

const SongsScreen = () => {
    const {theme} = useTheme();
    const { tracks } = useTracks();

    return (
        <View style={[styles.container, { backgroundColor: theme.bgColorPrimay }]}>
            <View style={{ height: 50, width: "100%"}}></View>
            <View style={{borderBottomWidth:1, borderBottomColor:theme.textColorPrimary, opacity:0.1}}></View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10, paddingHorizontal:22 }}>
                <Text style={{ color: theme.textColorSecondary }}>Date added</Text> 
                <Text style={{ color: theme.textColorSecondary }}>{tracks?.length} tracks</Text>
            </View>
            <FlatList style={{paddingTop:8}} keyExtractor={(item) => item.id} initialNumToRender={13} maxToRenderPerBatch={13} data={tracks} renderItem={useCallback(({ item }: { item: Asset }) => {
                return (
                    <Track uri={item.uri} duration={item.duration} date={item.modificationTime} id={Number(item.id)} />
                );
            }, [tracks])}>
            </FlatList>
        </View>
    )
}

export default SongsScreen