import frequencyToDegrees from './frequencyToDegrees';

describe('frequencyToDegrees', () => {
  it('should return a difference of 360 from one octace to the next', () => {
    const res1 = frequencyToDegrees(55);
    const res2 = frequencyToDegrees(110);
    const res3 = frequencyToDegrees(220);
    const res4 = frequencyToDegrees(440);
    // using toBeCloseTo because of floating point errors
    expect(res2 - res1).toBeCloseTo(360, 10);
    expect(res3 - res2).toBeCloseTo(360, 10);
    expect(res4 - res3).toBeCloseTo(360, 10);
  });
});
