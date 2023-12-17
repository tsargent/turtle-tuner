import frequencyToDegrees from './frequencyToDegrees';

describe('frequencyToDegrees', () => {
  it('should return a difference of 360 from one octave to the next', () => {
    const res1 = frequencyToDegrees(55);
    const res2 = frequencyToDegrees(110);
    const res3 = frequencyToDegrees(220);
    const res4 = frequencyToDegrees(440);
    // using toBeCloseTo because of floating point errors
    expect(res2 - res1).toBeCloseTo(0, 3);
    expect(res3 - res2).toBeCloseTo(0, 3);
    expect(res4 - res3).toBeCloseTo(0, 3);
  });

  it('should return a difference of 360 from one octave to the next', () => {
    // A 440
    const res1 = frequencyToDegrees(440);
    // D 587.33
    const res2 = frequencyToDegrees(587.33);
    expect(res2 - res1).toBeCloseTo(150, 3);
  });
});
