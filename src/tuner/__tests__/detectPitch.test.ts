import { detectPitch } from '../detectPitch';
import { frequencyFromMidi, STANDARD_TUNING } from '../notes';

// Matches what the microphone hook feeds it: ~85 ms of audio at 24 kHz.
const RATE = 24000;
const SIZE = 2048;
// The microphone hook ignores anything less periodic than this.
const MIN_CLARITY = 0.85;

/** A tone made of harmonics of `frequency`; `harmonics[i]` is the level of harmonic i + 1. */
function tone(frequency: number, harmonics = [1], size = SIZE) {
  const samples = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    const t = i / RATE;
    samples[i] = harmonics.reduce((sum, level, h) => sum + level * Math.sin(2 * Math.PI * frequency * (h + 1) * t), 0);
  }
  return samples;
}

function centsBetween(a: number, b: number) {
  return 1200 * Math.log2(a / b);
}

describe('detectPitch', () => {
  it.each(STANDARD_TUNING.map((midi) => frequencyFromMidi(midi)))('finds the open string at %f Hz within a cent', (frequency) => {
    const pitch = detectPitch(tone(frequency), RATE);
    expect(pitch).not.toBeNull();
    expect(Math.abs(centsBetween(pitch!.frequency, frequency))).toBeLessThan(1);
    expect(pitch!.clarity).toBeGreaterThan(MIN_CLARITY);
  });

  it('tells a string 5 cents sharp from one in tune', () => {
    const sharp = frequencyFromMidi(45) * 2 ** (5 / 1200);
    const pitch = detectPitch(tone(sharp), RATE);
    expect(centsBetween(pitch!.frequency, frequencyFromMidi(45))).toBeCloseTo(5, 0);
  });

  it('reads the fundamental of a plucked string, not a louder overtone', () => {
    // A low A whose second and third harmonics are louder than the fundamental,
    // like a real string near the bridge pickup.
    const pitch = detectPitch(tone(110, [0.4, 1, 0.7, 0.3]), RATE);
    expect(Math.abs(centsBetween(pitch!.frequency, 110))).toBeLessThan(1);
  });

  it('finds nothing in silence', () => {
    expect(detectPitch(new Float32Array(SIZE), RATE)).toBeNull();
  });

  it('does not hear a note in noise', () => {
    let seed = 1;
    const random = () => ((seed = (seed * 1664525 + 1013904223) % 2 ** 32) / 2 ** 32) * 2 - 1;
    const noise = Float32Array.from({ length: SIZE }, random);
    const pitch = detectPitch(noise, RATE);
    expect(pitch === null || pitch.clarity < MIN_CLARITY).toBe(true);
  });

  it('needs enough audio to cover two periods of the lowest note', () => {
    expect(detectPitch(tone(110, [1], 600), RATE)).toBeNull();
  });
});
