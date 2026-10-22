import { useEffect, useState } from 'react';

import type { Accidental, Letter, NoteReading } from './notes';

export type DisplayNote = { letter: Letter; accidental: Accidental; octave: number };

const IDLE_NOTE: DisplayNote = { letter: 'A', accidental: null, octave: 4 };
const SLEEP_AFTER_MS = 10_000;

/**
 * What the screen should show for a live reading:
 * - `note` is the last note heard (A4 before anything is heard), so the display
 *   is never blank.
 * - `awake` turns on with the first sound and off after 10 s of silence; it
 *   drives the turtle's eyes and the display's brightness.
 */
export function useTunerDisplay(reading: NoteReading | null) {
  const [note, setNote] = useState<DisplayNote>(IDLE_NOTE);
  const [awake, setAwake] = useState(false);

  // Adjusting state from the current reading during render, so the note and
  // eyes change in the same frame as the needle.
  if (reading && !sameNote(reading, note)) {
    setNote({ letter: reading.letter, accidental: reading.accidental, octave: reading.octave });
  }
  if (reading && !awake) setAwake(true);

  const silent = reading === null;
  useEffect(() => {
    if (!silent) return;
    const timer = setTimeout(() => setAwake(false), SLEEP_AFTER_MS);
    return () => clearTimeout(timer);
  }, [silent]);

  return { note, awake };
}

function sameNote(a: DisplayNote, b: DisplayNote) {
  return a.letter === b.letter && a.accidental === b.accidental && a.octave === b.octave;
}
