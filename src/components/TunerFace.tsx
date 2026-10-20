import { useEffect, useState } from 'react';
import { Animated, Image } from 'react-native';

import {
  IMAGES,
  LETTER_ART,
  NEEDLE_MAX_ANGLE,
  NEEDLE_PIVOT,
  NUMBER_ART,
  RECTS,
  type LayerKey,
  type Rect,
} from '../tuner/artwork';
import type { NoteReading } from '../tuner/notes';

const IN_TUNE_CENTS = 5;
const CLOSE_CENTS = 15;

type Props = {
  /** Current reading, or null when nothing is being heard. */
  reading: NoteReading | null;
  /** Points per design unit. */
  scale: number;
};

export function TunerFace({ reading, scale }: Props) {
  const needle = useNeedleAngle(reading, scale);
  const at = (rect: Rect) => ({
    position: 'absolute' as const,
    left: rect.x * scale,
    top: rect.y * scale,
    width: rect.width * scale,
    height: rect.height * scale,
  });
  const layer = (key: LayerKey) => <Image key={key} source={IMAGES[key]} style={at(RECTS[key])} />;

  return (
    <>
      {layer('topFill')}
      {layer('dial')}
      <Animated.Image source={IMAGES.needle} style={[at(RECTS.needle), needle]} />
      {layer('bottom')}
      {layer('top')}
      {layer('name')}
      {reading && layer(LETTER_ART[reading.letter])}
      {reading?.accidental && layer(reading.accidental)}
      {reading && NUMBER_ART[reading.octave] && layer(NUMBER_ART[reading.octave])}
      {reading && layer(lightFor(reading.cents))}
      {layer(headFor(reading))}
    </>
  );
}

function lightFor(cents: number): LayerKey {
  if (cents < -IN_TUNE_CENTS) return 'lightLeft';
  if (cents > IN_TUNE_CENTS) return 'lightRight';
  return 'lightCenter';
}

// The turtle watches the needle and cheers when it's centered.
// TODO: use the Sleep head while silent once it's exported from Figma.
function headFor(reading: NoteReading | null): LayerKey {
  if (!reading) return 'headWake';
  const { cents } = reading;
  if (Math.abs(cents) <= IN_TUNE_CENTS) return 'headHappy';
  if (Math.abs(cents) <= CLOSE_CENTS) return 'headUp';
  return cents < 0 ? 'headLeft' : 'headRight';
}

function useNeedleAngle(reading: NoteReading | null, scale: number) {
  // Rests at the far left when silent, like an analog meter.
  const target = reading ? Math.max(-50, Math.min(50, reading.cents)) : -50;
  const [cents] = useState(() => new Animated.Value(target));

  useEffect(() => {
    Animated.spring(cents, {
      toValue: target,
      stiffness: 120,
      damping: 14,
      mass: 1,
      useNativeDriver: true,
    }).start();
  }, [cents, target]);

  const rotate = cents.interpolate({
    inputRange: [-50, 50],
    outputRange: [`${-NEEDLE_MAX_ANGLE}deg`, `${NEEDLE_MAX_ANGLE}deg`],
  });
  return {
    transformOrigin: [
      (NEEDLE_PIVOT.x - RECTS.needle.x) * scale,
      (NEEDLE_PIVOT.y - RECTS.needle.y) * scale,
      0,
    ],
    transform: [{ rotate }],
  };
}
