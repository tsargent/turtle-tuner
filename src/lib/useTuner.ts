import * as React from 'react';
import {PitchDetector} from 'react-native-pitch-detector';
import frequencyToDegrees from './frequencyToDegrees';
import {useIsEmulator} from 'react-native-device-info';

export default function useTuner() {
  const [data, setData] = React.useState({tone: '--', frequency: 0});
  const {loading, result} = useIsEmulator();

  const isEmulator = result;

  React.useEffect(() => {
    if (loading || isEmulator) {
      return;
    }
    PitchDetector.start();
    PitchDetector.addListener(data => {
      setData(data);
    });
    return () => {
      if (isEmulator) {
        return;
      }
      PitchDetector.stop();
      PitchDetector.removeListener();
    };
  }, [loading, isEmulator]);

  const degrees = React.useMemo(
    () => frequencyToDegrees(data?.frequency) * -1,
    [data.frequency],
  );

  return {
    ...data,
    degrees,
  };
}
