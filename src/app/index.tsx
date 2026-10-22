import { useKeepAwake } from 'expo-keep-awake';
import * as Linking from 'expo-linking';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TunerFace } from '../components/TunerFace';
import { BACKGROUND, FRAME } from '../tuner/artwork';
import { readNote } from '../tuner/notes';
import { useMicrophonePitch } from '../tuner/useMicrophonePitch';
import { useSimulatedPitch } from '../tuner/useSimulatedPitch';
import { useTunerDisplay } from '../tuner/useTunerDisplay';

const usePitch = process.env.EXPO_PUBLIC_SIMULATE_PITCH === '1' ? useSimulatedPitch : useMicrophonePitch;

export default function TunerScreen() {
  // Tuning takes both hands; don't let the screen sleep while the app is open.
  useKeepAwake();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scale = Math.min(width / FRAME.width, height / FRAME.height);
  const { frequency, status } = usePitch();
  const reading = frequency === null ? null : readNote(frequency);
  const { note, awake } = useTunerDisplay(reading);

  return (
    <View style={styles.screen}>
      <StatusBar hidden />
      {/* Anchored to the bottom so the control panel meets the screen edge. */}
      <View style={{ width: FRAME.width * scale, height: FRAME.height * scale }}>
        <TunerFace reading={reading} note={note} awake={awake} scale={scale} />
      </View>
      {status === 'denied' && (
        <Pressable onPress={() => Linking.openSettings()} style={[styles.notice, { top: insets.top + 8 }]}>
          <Text style={styles.noticeText}>The turtle can&apos;t hear you. Tap to allow microphone access.</Text>
        </Pressable>
      )}
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
  notice: {
    position: 'absolute',
    left: 16,
    right: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  noticeText: { color: '#000', fontSize: 15, fontWeight: '600', textAlign: 'center' },
});
