/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
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
    PitchDetector.addListener(data => {
      console.log(data);
      setData(data);
    });
    return () => {
      PitchDetector.removeListener();
    };
  }, []);

  console.log(isRecording);
  return (
    <View>
      <Text>{data?.tone}</Text>
      <TouchableOpacity onPress={isRecording ? stop : start}>
        <Text>{isRecording ? 'STOP' : 'START'}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Tuner;
