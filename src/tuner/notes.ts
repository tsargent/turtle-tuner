export type Letter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
export type Accidental = 'sharp' | 'flat' | null;

export type NoteReading = {
  letter: Letter;
  accidental: Accidental;
  octave: number;
  /** Distance from the nearest note, -50 (flat) to +50 (sharp). */
  cents: number;
};

// Spelled the way guitarists usually see them: C♯, E♭, F♯, G♯, B♭.
const PITCH_CLASSES: [Letter, Accidental][] = [
  ['C', null],
  ['C', 'sharp'],
  ['D', null],
  ['E', 'flat'],
  ['E', null],
  ['F', null],
  ['F', 'sharp'],
  ['G', null],
  ['G', 'sharp'],
  ['A', null],
  ['B', 'flat'],
  ['B', null],
];

export const A4 = 440;

export function midiFromFrequency(frequency: number, a4 = A4) {
  return 69 + 12 * Math.log2(frequency / a4);
}

export function frequencyFromMidi(midi: number, a4 = A4) {
  return a4 * 2 ** ((midi - 69) / 12);
}

export function readNote(frequency: number, a4 = A4): NoteReading {
  const midi = midiFromFrequency(frequency, a4);
  const nearest = Math.round(midi);
  const [letter, accidental] = PITCH_CLASSES[((nearest % 12) + 12) % 12];
  return {
    letter,
    accidental,
    octave: Math.floor(nearest / 12) - 1,
    cents: (midi - nearest) * 100,
  };
}

/** Standard tuning, low to high, as MIDI note numbers. */
export const STANDARD_TUNING = [40, 45, 50, 55, 59, 64];
