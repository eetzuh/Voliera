import * as MediaLibrary from "expo-media-library"
import { Dispatch, SetStateAction } from 'react';

export interface TagStructure {
  id: number;
  artist: string | undefined;
  album: string | undefined;
  albumTrack: number | undefined;
  title: string | undefined;
  year: number | undefined;
}

export interface PlayingStructure extends TagStructure{
  uri: string | null;
  duration: number;
  date:number
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
  paused: boolean;
  setPaused: Dispatch<SetStateAction<boolean>>;
  playing: false | PlayingStructure;
  setPlaying: Dispatch<SetStateAction<false | PlayingStructure>>;
  artwork64: string | undefined;
  setArtwork64: Dispatch<SetStateAction<string | undefined>>;
  position: number;
  setPosition:Dispatch<SetStateAction<number>>
}

export interface ThemeColors {
  theme: string,
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