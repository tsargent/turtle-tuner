// YIN pitch detection (de Cheveigné & Kawahara, 2002), tuned for guitar.

const MIN_FREQUENCY = 60; // below low E (82 Hz), with room for drop tunings
const MAX_FREQUENCY = 1400; // above the 24th fret of the high E string
const THRESHOLD = 0.15;

export type Pitch = {
  frequency: number;
  /** 0–1: how periodic the signal is. Noise scores low. */
  clarity: number;
};

/**
 * Finds the fundamental frequency of `samples`, or null if nothing periodic is
 * found. Needs at least two periods of the lowest note: about 1600 samples at
 * 24 kHz.
 */
export function detectPitch(samples: Float32Array, sampleRate: number): Pitch | null {
  const tauMin = Math.floor(sampleRate / MAX_FREQUENCY);
  const tauMax = Math.ceil(sampleRate / MIN_FREQUENCY);
  const window = samples.length - tauMax;
  if (window < tauMax) return null;

  // Cumulative mean normalized difference function.
  const cmnd = new Float32Array(tauMax + 1);
  cmnd[0] = 1;
  let runningSum = 0;
  for (let tau = 1; tau <= tauMax; tau++) {
    let sum = 0;
    for (let i = 0; i < window; i++) {
      const delta = samples[i] - samples[i + tau];
      sum += delta * delta;
    }
    runningSum += sum;
    cmnd[tau] = runningSum === 0 ? 1 : (sum * tau) / runningSum;
  }

  // First dip under the threshold, followed down to its local minimum.
  let tau = tauMin;
  while (tau <= tauMax && cmnd[tau] >= THRESHOLD) tau++;
  if (tau > tauMax) return null;
  while (tau < tauMax && cmnd[tau + 1] < cmnd[tau]) tau++;

  // Parabolic interpolation for sub-sample accuracy.
  let period = tau;
  if (tau > 1 && tau < tauMax) {
    const [a, b, c] = [cmnd[tau - 1], cmnd[tau], cmnd[tau + 1]];
    const denominator = a - 2 * b + c;
    if (denominator !== 0) period += (a - c) / (2 * denominator);
  }

  return { frequency: sampleRate / period, clarity: 1 - cmnd[tau] };
}
