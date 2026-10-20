import type { ImageSourcePropType } from 'react-native';

import manifest from '../../assets/tuner/manifest.json';
import type { Letter } from './notes';

// Layers come from the "Test Block 4/5" frames in Figma, cropped to their
// visible bounds. Rects are in the 414x896 design frame.
export const FRAME = { width: 414, height: 896 };
export const BACKGROUND = '#F2F368';

export type Rect = { x: number; y: number; width: number; height: number };
export type LayerKey = keyof typeof manifest;

export const RECTS: Record<LayerKey, Rect> = manifest;

export const IMAGES: Record<LayerKey, ImageSourcePropType> = {
  topFill: require('../../assets/tuner/topFill.png'),
  dial: require('../../assets/tuner/dial.png'),
  needle: require('../../assets/tuner/needle.png'),
  bottom: require('../../assets/tuner/bottom.png'),
  top: require('../../assets/tuner/top.png'),
  name: require('../../assets/tuner/name.png'),
  headWake: require('../../assets/tuner/headWake.png'),
  headLeft: require('../../assets/tuner/headLeft.png'),
  headRight: require('../../assets/tuner/headRight.png'),
  headUp: require('../../assets/tuner/headUp.png'),
  headHappy: require('../../assets/tuner/headHappy.png'),
  lightLeft: require('../../assets/tuner/lightLeft.png'),
  lightCenter: require('../../assets/tuner/lightCenter.png'),
  lightRight: require('../../assets/tuner/lightRight.png'),
  flat: require('../../assets/tuner/flat.png'),
  sharp: require('../../assets/tuner/sharp.png'),
  letterA: require('../../assets/tuner/letterA.png'),
  letterB: require('../../assets/tuner/letterB.png'),
  letterC: require('../../assets/tuner/letterC.png'),
  letterD: require('../../assets/tuner/letterD.png'),
  letterE: require('../../assets/tuner/letterE.png'),
  letterF: require('../../assets/tuner/letterF.png'),
  letterG: require('../../assets/tuner/letterG.png'),
  number6: require('../../assets/tuner/number6.png'),
};

export const LETTER_ART: Record<Letter, LayerKey> = {
  A: 'letterA',
  B: 'letterB',
  C: 'letterC',
  D: 'letterD',
  E: 'letterE',
  F: 'letterF',
  G: 'letterG',
};
// Only 6 has been exported from Figma so far; other digits fall back to text
// until their art is added.
export const NUMBER_ART: Partial<Record<number, LayerKey>> = { 6: 'number6' };

// Where the note letter and octave sit inside the display window.
export const LETTER_BOX: Rect = { x: 134, y: 705, width: 120, height: 132 };
export const NUMBER_BOX: Rect = { x: 254, y: 795, width: 34, height: 40 };

// The dial arc is centred at (206, 391) with -50 and +50 cents about 61° either
// side of vertical. The pivot sits just below the meter window, hidden by the
// bezel like a real meter movement.
export const NEEDLE_PIVOT = { x: 206.8, y: 391 };
export const NEEDLE_MAX_ANGLE = 61;
