import { Audio } from "expo-av"
import { useTracks } from "../context/Context";

let sound: Audio.Sound | null = null;

export const Play = async (uri: string) => {
    if (sound) {
        await sound.stopAsync()
        await sound.unloadAsync()
        sound = null;
    }
    sound = new Audio.Sound();
    try{
        await sound.loadAsync({ uri });
        await sound.playAsync();
    }catch{
        sound = null;
    }
}

export const Pause = async() =>{
    await sound?.pauseAsync();
}