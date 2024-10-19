import { createContext, useContext } from 'react';
import { light, dark } from '../styles/Colors';
import { TracksContextValue, ThemeContextValue, AndroidArtworkColors } from '../interfaces/Interfaces';
import { TagStructure } from '../interfaces/Interfaces';
import { Dispatch, SetStateAction } from 'react';

const defaultSetArtworkColors: Dispatch<SetStateAction<AndroidArtworkColors | null>> = () => { }
export const ThemeContext = createContext<ThemeContextValue>({
  theme: dark || light,
  artworkColors: null,
  setArtworkColors: defaultSetArtworkColors
});

export const useTheme = () => useContext(ThemeContext);

const defaultSetPlaying: Dispatch<SetStateAction<false | TagStructure>> = () => { };
const defaultSetArtwork64: Dispatch<SetStateAction<string | undefined>> = () => { };
export const TrackContext = createContext<TracksContextValue>({
  tracks: undefined,
  loading: true,
  playing: false,
  setPlaying: defaultSetPlaying,
  artwork64:undefined,
  setArtwork64:defaultSetArtwork64
})

export const useTracks = () => useContext(TrackContext);

