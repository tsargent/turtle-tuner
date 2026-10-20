import { useEffect, useState } from 'react';

import { STANDARD_TUNING, frequencyFromMidi } from './notes';
import type { MicStatus } from './useMicrophonePitch';

const TICK_MS = 50;
const SETTLE_MS = 2600;
const HOLD_MS = 1400;
const REST_MS = 900;
const STRING_MS = SETTLE_MS + HOLD_MS + REST_MS;

/**
 * Stand-in for microphone input, for development: plucks each open string in
 * turn, starting out of tune and settling onto pitch. Same shape as
 * useMicrophonePitch. Enable with EXPO_PUBLIC_SIMULATE_PITCH=1.
 */
export function useSimulatedPitch() {
  const [frequency, setFrequency] = useState<number | null>(null);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      const pluck = Math.floor(elapsed / STRING_MS);
      const t = elapsed % STRING_MS;
      if (t >= SETTLE_MS + HOLD_MS) {
        setFrequency(null);
        return;
      }
      const midi = STANDARD_TUNING[pluck % STANDARD_TUNING.length];
      // Alternate flat and sharp starts, ease toward zero, add a little jitter.
      const startCents = (pluck % 2 === 0 ? -1 : 1) * (32 + (pluck % 3) * 6);
      const progress = Math.min(1, t / SETTLE_MS);
      const cents = startCents * (1 - progress) ** 2 + (Math.random() - 0.5) * 2;
      setFrequency(frequencyFromMidi(midi + cents / 100));
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  return { frequency, status: 'listening' as MicStatus };
}
