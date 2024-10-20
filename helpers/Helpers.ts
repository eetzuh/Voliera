import { Audio } from "expo-av"

let sound: Audio.Sound | null = null;

export const Play = async (uri: string) => {
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
    try {
        await sound.loadAsync({ uri });
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