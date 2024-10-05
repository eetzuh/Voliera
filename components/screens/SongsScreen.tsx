import React, { useContext, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { styles } from '../../styles/AppStyles'
import { ThemeContext, useTracks } from '../../context/Context'
import * as FileSystem from 'expo-file-system';
import Track from '../Track'
import parse from 'id3-parser'

const SongsScreen = () => {
    const [albumImages, setAlbumImages] = useState<string[]>([])
    const theme = useContext(ThemeContext);
    const { tracks } = useTracks();

    function arrayBufferToBase64(buffer: ArrayLike<number>) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    async function getSongInfo() {
        const ID3Tracks: string[] = [];
        try {
            if (tracks) {
                for (const track of tracks) {
                    console.log("pocelo")
                    const readFileInfo = await FileSystem.readAsStringAsync(track.uri, { encoding: FileSystem.EncodingType.Base64 });
                    const binaryString = atob(readFileInfo);
                    const uint8Array = new Uint8Array(
                        binaryString.split('').map(char => char.charCodeAt(0))
                    );
                    const ID3Tags = parse(uint8Array)
                    if (ID3Tags && ID3Tags.image && ID3Tags.image.data) {
                        console.log(ID3Tags.title)
                        const imageBinary = ID3Tags.image.data;
                        const base64Image = arrayBufferToBase64(imageBinary);
                        ID3Tracks.push(base64Image)
                    }
                }
                console.log("tusam")
            setAlbumImages(ID3Tracks);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {        
    getSongInfo();
    }, [])

    return (
        <View style={[styles.container, { backgroundColor: theme.bgColorPrimay }]}>
            <View style={{ height: 50, width: "100%", borderBottomWidth: 1, borderColor: theme.colorLight }}></View>
            <Text>Songs...</Text>
            {tracks &&
                albumImages.map((image, index) => {
                    return (
                        <Track key={"track"+index} albumImage={image}></Track>
                    )
                })
            }
            {/* <TouchableOpacity style={{ backgroundColor: 'red', width: 50, alignSelf: "center" }} onPress={getSongInfo}>
                <Text>
                    PLAY
                </Text>
            </TouchableOpacity> */}
        </View>
    )
}

export default SongsScreen