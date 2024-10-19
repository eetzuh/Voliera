import React, { useCallback } from 'react'
import { View, Text, FlatList } from 'react-native'
import { styles } from '../../styles/AppStyles'
import { useTracks, useTheme } from '../../context/Context'
import Track from '../Track';
import { Asset } from 'expo-media-library';
import { FlashList } from '@shopify/flash-list';
import Header from '../Header';

const SongsScreen = () => {
    const { theme } = useTheme();
    const { tracks, playing } = useTracks();

    return (
        <View style={[styles.container, { backgroundColor: theme.bgColorPrimay }]}>
            <Header/>
            <View style={{ borderBottomWidth: 1, borderBottomColor: theme.textColorPrimary, opacity: 0.1 }}></View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10, paddingHorizontal: 22 }}>
                <Text style={{ color: theme.textColorSecondary }}>Date added</Text>
                <Text style={{ color: theme.textColorSecondary }}>{tracks?.length} tracks</Text>
            </View>
            {/* <FlatList contentContainerStyle={{ paddingBottom: 80, paddingTop: 8  }} keyExtractor={(item) => item.id} initialNumToRender={10} maxToRenderPerBatch={13} windowSize={10} data={tracks} renderItem={useCallback(({ item }: { item: Asset }) => {
                return (
                    <Track uri={item.uri} duration={item.duration} date={item.modificationTime} id={Number(item.id)} />
                );
            }, [tracks])}>
            </FlatList> */}
            <FlashList keyExtractor={(item) => item.id.toString()} data={tracks} estimatedItemSize={75} renderItem={useCallback(({ item }: { item: Asset }) => {
                return (
                    <Track key={item.id} uri={item.uri} duration={item.duration} date={item.modificationTime} id={Number(item.id)} />
                );
            }, [tracks])}>
            </FlashList>
        </View>
    )
}

export default SongsScreen