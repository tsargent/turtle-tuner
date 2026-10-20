import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { TunerFace } from '../components/TunerFace';
import { BACKGROUND, FRAME } from '../tuner/artwork';
import { readNote } from '../tuner/notes';
import { useSimulatedPitch } from '../tuner/useSimulatedPitch';

export default function TunerScreen() {
  const { width, height } = useWindowDimensions();
  const scale = Math.min(width / FRAME.width, height / FRAME.height);
  const frequency = useSimulatedPitch();
  const reading = frequency === null ? null : readNote(frequency);

  return (
    <View style={styles.screen}>
      <StatusBar hidden />
      {/* Anchored to the bottom so the control panel meets the screen edge. */}
      <View style={{ width: FRAME.width * scale, height: FRAME.height * scale }}>
        <TunerFace reading={reading} scale={scale} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BACKGROUND,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
