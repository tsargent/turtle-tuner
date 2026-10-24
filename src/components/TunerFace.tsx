import { useEffect, useState } from 'react';
import { Animated, Easing, Image, StyleSheet } from 'react-native';

import {
  IMAGES,
  NIGHT_IMAGES,
  LETTER_ART,
  NEEDLE_MAX_ANGLE,
  NEEDLE_PIVOT,
  NUMBER_ART,
  RECTS,
  type LayerKey,
  type Rect,
} from '../tuner/artwork';
import type { NoteReading } from '../tuner/notes';
import type { DisplayNote } from '../tuner/useTunerDisplay';

const IN_TUNE_CENTS = 5;
const CLOSE_CENTS = 15;
const DIM_OPACITY = 0.3;

// Every variant stays mounted and only the active one is shown: changing an
// <Image>'s source blanks it for a frame on iOS, which flashed the white dial
// through the turtle's head on every mood change.
const HEADS: LayerKey[] = ['headSleep', 'headWake', 'headLeft', 'headRight', 'headUp', 'headHappy'];
const LIGHTS: LayerKey[] = ['lightLeft', 'lightCenter', 'lightRight'];
const ACCIDENTALS: LayerKey[] = ['flat', 'sharp'];
const LETTERS = Object.values(LETTER_ART);

type Props = {
  /** Current reading, or null when nothing is being heard. */
  reading: NoteReading | null;
  /** Note shown in the display: the last one heard, or A4 at start. */
  note: DisplayNote;
  /** Heard something in the last few seconds: eyes open, display lit. */
  awake: boolean;
  /** Use the dark-mode artwork. */
  night: boolean;
  /** Points per design unit. */
  scale: number;
};

export function TunerFace({ reading, note, awake, night, scale }: Props) {
  const needle = useNeedleAngle(reading, awake, scale);
  const displayOpacity = useDisplayOpacity(awake);
  const at = (rect: Rect) => ({
    position: 'absolute' as const,
    left: rect.x * scale,
    top: rect.y * scale,
    width: rect.width * scale,
    height: rect.height * scale,
  });
  const source = (key: LayerKey) => (night && NIGHT_IMAGES[key]) || IMAGES[key];
  const layer = (key: LayerKey) => <Image key={key} source={source(key)} style={at(RECTS[key])} />;
  const oneOf = (keys: LayerKey[], active: LayerKey | null | undefined) =>
    keys.map((key) => (
      <Image key={key} source={source(key)} style={[at(RECTS[key]), key !== active && styles.hidden]} />
    ));

  return (
    <>
      {layer('topFill')}
      {layer('dial')}
      <Animated.Image source={IMAGES.needle} style={[at(RECTS.needle), needle, { opacity: displayOpacity }]} />
      {layer('bottom')}
      {layer('top')}
      {layer('name')}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: displayOpacity }]}>
        {oneOf(LETTERS, LETTER_ART[note.letter])}
        {oneOf(ACCIDENTALS, note.accidental)}
        {oneOf(NUMBER_ART, NUMBER_ART[note.octave])}
      </Animated.View>
      {oneOf(LIGHTS, reading && lightFor(reading.cents))}
      {oneOf(HEADS, headFor(reading, awake))}
    </>
  );
}

function lightFor(cents: number): LayerKey {
  if (cents < -IN_TUNE_CENTS) return 'lightLeft';
  if (cents > IN_TUNE_CENTS) return 'lightRight';
  return 'lightCenter';
}

// The turtle watches the needle and cheers when it's centered; between notes
// it waits with eyes open, then dozes off.
function headFor(reading: NoteReading | null, awake: boolean): LayerKey {
  if (!reading) return awake ? 'headWake' : 'headSleep';
  const { cents } = reading;
  if (Math.abs(cents) <= IN_TUNE_CENTS) return 'headHappy';
  if (Math.abs(cents) <= CLOSE_CENTS) return 'headUp';
  return cents < 0 ? 'headLeft' : 'headRight';
}

function useDisplayOpacity(awake: boolean) {
  const [opacity] = useState(() => new Animated.Value(awake ? 1 : DIM_OPACITY));
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: awake ? 1 : DIM_OPACITY,
      duration: awake ? 250 : 1200,
      useNativeDriver: true,
    }).start();
  }, [opacity, awake]);
  return opacity;
}

// Follows the live reading; holds its last position between notes (like the
// display), and drifts back to center as the turtle falls asleep. It dims with
// the display, so a held needle never reads as live.
function useNeedleAngle(reading: NoteReading | null, awake: boolean, scale: number) {
  const live = reading ? Math.max(-50, Math.min(50, reading.cents)) : null;
  const [cents] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (live !== null) {
      Animated.spring(cents, {
        toValue: live,
        stiffness: 120,
        damping: 14,
        mass: 1,
        useNativeDriver: true,
      }).start();
    } else if (!awake) {
      Animated.timing(cents, {
        toValue: 0,
        duration: 1500,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start();
    }
  }, [cents, live, awake]);

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

const styles = StyleSheet.create({
  hidden: { opacity: 0 },
});
