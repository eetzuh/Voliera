import React, { useContext } from 'react'
import { View, Text, FlatList } from 'react-native'
import { styles } from '../../styles/AppStyles'
import { ThemeContext, useTracks } from '../../context/Context'
import Track from '../Track';

const SongsScreen = () => {
    const theme = useContext(ThemeContext);
    const { tracks } = useTracks();
    return (
        <View style={[styles.container, { backgroundColor: theme.bgColorPrimay }]}>
            <View style={{ height: 50, width: "100%", borderBottomWidth: 1, borderColor: theme.colorLight }}></View>
            <Text>Songs...</Text>
            {/* <View style={{ gap: 6 }}>
                {tracks &&
                    tracks.map((track, index) => {
                        return (
                            <Track key={"track" + index} uri={track.uri} duration={track.duration} date={track.modificationTime} />
                        )
                    })
                }
            </View> */}
            <FlatList data={tracks} renderItem={({ item, index }) => (
                <Track key={"track" + index} uri={item.uri} duration={item.duration} date={item.modificationTime} id={item.id}/>
            )}></FlatList>
        </View>
    )
}

export default SongsScreen