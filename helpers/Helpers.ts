import { Audio } from "expo-av"
import { Dispatch, SetStateAction } from "react";

let sound: Audio.Sound | null = null;

export const Play = async (uri: string, setPosition:Dispatch<SetStateAction<number>>) => {
    if (sound) {
        const status = await sound.getStatusAsync()
        if (status.isLoaded) {
            if (uri.replace(/^file:\/\//, '') == status.uri) {
                try {
                    await sound.playFromPositionAsync(status.positionMillis);
                    return;
                } catch (error) {
                    sound = null;
                    return;
                }
            }
            await sound.stopAsync()
            await sound.unloadAsync()
            sound = null;
        }
    }
    sound = new Audio.Sound();
    sound.setOnPlaybackStatusUpdate((status)=>{
        if(status.isLoaded){
            if(status.isPlaying){
                setPosition(status.positionMillis/1000);                
            }
        }
    })
    try {
        await sound.loadAsync({ uri },{ progressUpdateIntervalMillis:1000 });
        await sound.playAsync();
    } catch {
        sound = null;
    }
}

export const Pause = async () => {
    await sound?.pauseAsync();
}

export const Stop = async () => {
    await sound?.stopAsync();
    sound = null;
}

export const changePosition = async (position: number) => {
    if (sound) {
        const status = await sound.getStatusAsync();
        if(status.isLoaded){
            await sound.setStatusAsync({positionMillis: position})
        }
    }
}
