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
export const TrackContext = createContext<TracksContextValue>({
  tracks: undefined,
  loading: true,
  playing: false,
  setPlaying: defaultSetPlaying
})

export const useTracks = () => useContext(TrackContext);

