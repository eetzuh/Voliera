import { createContext, useContext } from 'react';
import { light, dark } from '../styles/Colors';
import { TracksContextValue, ThemeContextValue, AndroidArtworkColors } from '../interfaces/Interfaces';
import { PlayingStructure } from '../interfaces/Interfaces';
import { Dispatch, SetStateAction } from 'react';

const defaultSetArtworkColors: Dispatch<SetStateAction<AndroidArtworkColors | null>> = () => { }
export const ThemeContext = createContext<ThemeContextValue>({
  theme: dark || light,
  artworkColors: null,
  setArtworkColors: defaultSetArtworkColors
});

export const useTheme = () => useContext(ThemeContext);

const defaultSetPlaying: Dispatch<SetStateAction<false | PlayingStructure>> = () => { };
const defaultSetArtwork64: Dispatch<SetStateAction<string | undefined>> = () => { };
const defaultSetPaused: Dispatch<SetStateAction<boolean>> = () => { };
const defaultSetPosition: Dispatch<SetStateAction<number>> = () => { };

export const TrackContext = createContext<TracksContextValue>({
  tracks: undefined,
  loading: true,
  playing: false,
  paused:false,
  setPaused:defaultSetPaused,
  setPlaying: defaultSetPlaying,
  artwork64:undefined,
  setArtwork64:defaultSetArtwork64,
  position:0,
  setPosition:defaultSetPosition
})

export const useTracks = () => useContext(TrackContext);

