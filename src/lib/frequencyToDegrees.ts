export default function frequencyToDegrees(frequency: number): number {
  const constant = 0; // Constant to add to the output
  const referenceFrequency = 20; // Reference frequency for the initial octave
  const doublingFactor = Math.log2(frequency / referenceFrequency);
  const outputFrequency = constant + 360 * doublingFactor;
  return outputFrequency % 360;
}
