import { createContext } from 'react';
import { light, dark } from '../styles/Colors';

export const ThemeContext = createContext(dark || light);