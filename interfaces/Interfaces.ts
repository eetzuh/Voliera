import * as MediaLibrary from "expo-media-library"
import { Dispatch, SetStateAction } from 'react';

export interface TagStructure {
  id: number;
  artist: string | undefined;
  album: string | undefined;
  albumTrack: number | undefined;
  title: string | undefined;
  year: number | undefined;
  image: string | undefined;
  duration: number;
  date: number;
}

export interface AndroidArtworkColors {
  dominant: string
  average: string
  vibrant: string
  darkVibrant: string
  lightVibrant: string
  darkMuted: string
  lightMuted: string
  muted: string
  platform: "android"
}

export interface TracksContextValue {
  tracks: MediaLibrary.Asset[] | undefined;
  loading: boolean;
  playing: false | TagStructure;
  setPlaying: Dispatch<SetStateAction<false | TagStructure>>;
}

export interface ThemeColors {
  bgColorPrimay: string,
  colorSecondary: string,
  colorLight: string,
  textColorPrimary: string,
  textColorSecondary: string
}

export interface ThemeContextValue {
  theme: ThemeColors,
  artworkColors: AndroidArtworkColors | null;
  setArtworkColors: Dispatch<SetStateAction<AndroidArtworkColors | null>>
}