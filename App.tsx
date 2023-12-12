/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {PitchDetector} from 'react-native-pitch-detector';

function App(): JSX.Element {
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
    PitchDetector.addListener(setData);
    return () => {
      PitchDetector.removeListener();
    };
  }, []);

  return (
    <SafeAreaView>
      <View style={{height: 100, width: 100, backgroundColor: 'white'}}>
        <Text>Test</Text>
        <Text>{data?.tone}</Text>
        <Text>{isRecording ? 'ON' : 'OFF'}</Text>
        <TouchableOpacity onPress={isRecording ? stop : start}>
          <Text>{isRecording ? 'STOP' : 'START'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default App;
