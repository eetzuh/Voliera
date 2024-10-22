import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, FlatList } from 'react-native'
import { styles } from '../../styles/AppStyles'
import { useTracks, useTheme } from '../../context/Context'
import Track from '../Track';
import { Asset } from 'expo-media-library';
import { FlashList } from '@shopify/flash-list';
import Header from '../Header';
import Animated, { runOnJS, withTiming } from 'react-native-reanimated';
import { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

const SongsScreen = () => {
    const { theme } = useTheme();
    const { tracks, playing } = useTracks();
    const headerOffset = useSharedValue(0);
    const [headerShown, setHeaderShown] = useState<boolean>(true);

    const lastContentOffset = useSharedValue(0);
    const isScrolling = useSharedValue(false);
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (e) => {
            if (lastContentOffset.value > e.contentOffset.y) {
                if (isScrolling.value) {
                    runOnJS(setHeaderShown)(true)
                }
            } else if (lastContentOffset.value < e.contentOffset.y) {
                if (isScrolling.value) {
                    runOnJS(setHeaderShown)(false)
                }
            }
            lastContentOffset.value = e.contentOffset.y;
        },
        onBeginDrag: (e) => {
            isScrolling.value = true;
        },
        onEndDrag: (e) => {
            isScrolling.value = false;
        },
    })

    useEffect(() => {
        if (!headerShown) {
            headerOffset.value = withTiming(-70, { duration: 200 });
        } else {
            headerOffset.value = withTiming(0, { duration: 200 })
        }
    }, [headerShown])

    const HeaderBackground = () => {
        return (
            <View style={{ height: 85, width: "100%", flexDirection: 'column', paddingHorizontal: 24, alignItems: 'center',paddingTop:55, gap:5 }}>
                {/* <View style={{ borderBottomWidth: 1, borderBottomColor: theme.textColorPrimary, opacity: 0.1, width:'100%'}}></View> */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between',  width:'100%' }}>
                    <Text style={{ color: theme.textColorSecondary }}>Date added</Text>
                    <Text style={{ color: theme.textColorSecondary }}>{tracks?.length} tracks</Text>
                </View>
            </View>
        )
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.bgColorPrimay }]}>
            <Header offset={headerOffset} />
            <Animated.FlatList ListHeaderComponent={HeaderBackground} onScroll={scrollHandler} contentContainerStyle={[{paddingTop: 8 },playing ? {paddingBottom:200} : {paddingBottom:80}]} keyExtractor={(item) => item.id} initialNumToRender={10} maxToRenderPerBatch={16} windowSize={13} data={tracks} renderItem={useCallback(({ item }: { item: Asset }) => {
                return (
                    <Track uri={item.uri} duration={item.duration} date={item.modificationTime} id={Number(item.id)} />
                );
            }, [tracks])} getItemLayout={(data, index) => ({
                length: 75,  // Height of a single item (you need to provide the exact height)
                offset: 75 * index,
                index,
            })}>
            </Animated.FlatList>
            {/* <FlashList contentContainerStyle={playing ? {paddingBottom:200} : {paddingBottom:80}} keyExtractor={(item) => item.id.toString()} data={tracks} estimatedItemSize={75} renderItem={useCallback(({ item }: { item: Asset }) => {
                return (
                    <Track key={item.id} uri={item.uri} duration={item.duration} date={item.modificationTime} id={Number(item.id)} />
                );
            }, [tracks])}>
            </FlashList> */}
        </View>
    )
}

export default SongsScreen