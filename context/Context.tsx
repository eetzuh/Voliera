import { createContext, useContext } from 'react';
import { light, dark } from '../styles/Colors';
import * as MediaLibrary from "expo-media-library"

export const ThemeContext = createContext(dark || light);

interface TracksContextValue {
    tracks: MediaLibrary.Asset[] | undefined;
    loading: boolean
  }
export const TrackContext = createContext<TracksContextValue>({
    tracks: undefined,
    loading:true
  })

export const useTracks = () => useContext(TrackContext);