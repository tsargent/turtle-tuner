import * as Updates from 'expo-updates';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { RECTS } from '../tuner/artwork';

type Props = {
  /** Points per design unit. */
  scale: number;
};

/**
 * Long-press the "Turtle Tuner" name to see which code is running: the code
 * built into the app, or which OTA update. Tap anywhere to hide it.
 */
export function VersionLabel({ scale }: Props) {
  const [shown, setShown] = useState(false);
  const name = RECTS.name;
  const area = {
    left: name.x * scale,
    top: name.y * scale,
    width: name.width * scale,
    height: name.height * scale,
  };

  if (!shown) {
    return <Pressable onLongPress={() => setShown(true)} style={[styles.absolute, area]} />;
  }
  return (
    <Pressable onPress={() => setShown(false)} style={StyleSheet.absoluteFill}>
      <View style={[styles.absolute, styles.label, { left: area.left, width: area.width, top: area.top - 44 }]}>
        <Text style={styles.text}>{describeRunningCode()}</Text>
      </View>
    </Pressable>
  );
}

function describeRunningCode() {
  const runtime = Updates.runtimeVersion ?? '?';
  const version = /^\d/.test(runtime) ? `v${runtime}` : runtime;
  if (Updates.isEmbeddedLaunch || !Updates.updateId) return `${version} · built-in code`;
  const id = Updates.updateId.slice(0, 8);
  const date = Updates.createdAt?.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
  return [version, `update ${id}`, date].filter(Boolean).join(' · ');
}

const styles = StyleSheet.create({
  absolute: { position: 'absolute' },
  label: {
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  text: { color: '#000', fontSize: 13, fontWeight: '600', textAlign: 'center' },
});
