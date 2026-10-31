import { frequencyFromMidi, readNote, STANDARD_TUNING } from '../notes';

describe('readNote', () => {
  it('reads concert A as A4, dead in tune', () => {
    expect(readNote(440)).toEqual({ letter: 'A', accidental: null, octave: 4, cents: 0 });
  });

  it('names the open strings in standard tuning', () => {
    const names = STANDARD_TUNING.map((midi) => {
      const { letter, octave } = readNote(frequencyFromMidi(midi));
      return `${letter}${octave}`;
    });
    expect(names).toEqual(['E2', 'A2', 'D3', 'G3', 'B3', 'E4']);
  });

  it('spells black keys the way guitarists read them', () => {
    expect(readNote(277.18)).toMatchObject({ letter: 'C', accidental: 'sharp', octave: 4 });
    expect(readNote(311.13)).toMatchObject({ letter: 'E', accidental: 'flat', octave: 4 });
    expect(readNote(466.16)).toMatchObject({ letter: 'B', accidental: 'flat', octave: 4 });
  });

  it('reports sharp and flat in cents', () => {
    expect(readNote(445).cents).toBeCloseTo(19.56, 1);
    expect(readNote(435).cents).toBeCloseTo(-19.79, 1);
  });
});
