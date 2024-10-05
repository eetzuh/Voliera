import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import * as MediaLibrary from "expo-media-library"

export type RootStackParamList = {
  Songs: { tracks: MediaLibrary.Asset[] | undefined };
  AnotherScreen: { tracks: MediaLibrary.Asset[] | undefined };
};

// SongsScreen props
export type SongsScreenProps = BottomTabScreenProps<RootStackParamList, 'Songs'>;
