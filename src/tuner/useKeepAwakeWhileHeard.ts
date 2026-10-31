import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

const TAG = 'tuner';
const STAY_AWAKE_MS = 2 * 60_000;

/**
 * Keeps the screen on while the tuner is in use: from launch (or returning to
 * the app) and after every note heard, for two minutes of silence. Then the
 * phone's own Auto-Lock takes over, so a tuner left on a music stand doesn't
 * hold the screen on forever.
 */
export function useKeepAwakeWhileHeard(heard: boolean) {
  const [inUse, setInUse] = useState(true);
  // Bumped on returning to the app, to restart the silence timer.
  const [visit, setVisit] = useState(0);

  if (heard && !inUse) setInUse(true);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') return;
      setInUse(true);
      setVisit((n) => n + 1);
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (heard) return;
    const timer = setTimeout(() => setInUse(false), STAY_AWAKE_MS);
    return () => clearTimeout(timer);
  }, [heard, visit]);

  useEffect(() => {
    if (!inUse) return;
    activateKeepAwakeAsync(TAG).catch(() => {});
    return () => {
      deactivateKeepAwake(TAG).catch(() => {});
    };
  }, [inUse]);
}
