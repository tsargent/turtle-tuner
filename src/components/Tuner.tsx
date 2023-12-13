/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {PitchDetector} from 'react-native-pitch-detector';

function Tuner(): JSX.Element {
  const [data, setData] = React.useState({tone: '--', frequency: 0});
  const [isRecording, setIsRecording] = React.useState(false);

  const start = async () => {
    await PitchDetector.start();
    const status = await PitchDetector.isRecording();
    setIsRecording(status);
  };

  const stop = async () => {
    await PitchDetector.stop();
    const status = await PitchDetector.isRecording();
    setIsRecording(status);
  };

  React.useEffect(() => {
    PitchDetector.start();
    PitchDetector.addListener(data => {
      setData(data);
    });
    return () => {
      PitchDetector.stop();
      PitchDetector.removeListener();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.tone}>{data?.tone}</Text>
      <Text style={styles.frequency}>{data?.frequency.toFixed(2)}</Text>
    </View>
  );
}

export default Tuner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tone: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  frequency: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
