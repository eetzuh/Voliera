import React, { useContext, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { styles } from '../../styles/AppStyles'
import { ThemeContext } from '../../context/Context'
import * as MediaLibrary from "expo-media-library"
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av'
import Track from '../Track'

const SongsScreen = () => {
    const theme = useContext(ThemeContext);

    async function getSongs() {
    const { assets } = await MediaLibrary.getAssetsAsync({ mediaType: 'audio', first: 20 });
    const excludeDir = ['/Ringtones', '/Notifications', '/Alarms', '/System']
    const filteredAssets= assets.filter(file=>{
        return !excludeDir.some(excludeDir => file.uri.includes(excludeDir));
    })
    // console.log(filteredAssets)
    return filteredAssets;
    }

    useEffect(()=>{
        getSongs()
    },[])

    const sound = new Audio.Sound();
    async function playSong() {
        try {
            // await sound.loadAsync({uri:'file:///storage/emulated/0/Download/Muzika/Branimir Johnny Štulić _Otac mog oca_ 1991..mp3'});
            // await sound.playAsync()
            // await sound.pauseAsync()
            // await sound.unloadAsync()
            const fileInfo= await FileSystem.getInfoAsync('file:///storage/emulated/0/Download/Muzika/Lady (Remaster 2023).mp3')
            const readFileInfo =await FileSystem.readAsStringAsync('file:///storage/emulated/0/Download/Muzika/Lady (Remaster 2023).mp3', { encoding: FileSystem.EncodingType.UTF8});
            console.log(fileInfo)
        } catch (error) {
            console.log("nema");
        }
    }

    return (
        <View style={[styles.container,{backgroundColor:theme.bgColorPrimay}]}>
            <View style={{height:50, width:"100%", borderBottomWidth:1, borderColor:theme.colorLight}}></View>
            <Text>Songs...</Text>
            <TouchableOpacity style={{backgroundColor:'red', width:50, alignSelf:"center"}} onPress={playSong}>
                <Text>
                    PLAY
                </Text>
            </TouchableOpacity>
            <Track />
        </View>
    )
}

export default SongsScreen