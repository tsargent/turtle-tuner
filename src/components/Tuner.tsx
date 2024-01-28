/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {PitchDetector} from 'react-native-pitch-detector';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import ScreenContainer from './ScreenContainer';
import Wheel from './Wheel';
import Rotater from './Rotater';
import Turtle from './Turtle';
import frequencyToDegrees from '../lib/frequencyToDegrees';

function Tuner(): React.JSX.Element {
  const [data, setData] = React.useState({tone: '--', frequency: 0});
  const insets = useSafeAreaInsets();

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

  const degrees = React.useMemo(
    () => frequencyToDegrees(data?.frequency) * -1,
    [data.frequency],
  );

  return (
    <ScreenContainer>
      <View
        style={{
          width: 400,
          height: 400,
          borderColor: 'red',
          borderWidth: 1,
          flex: 0,
        }}>
        <View style={{marginVertical: '80%'}}>
          <Rotater degrees={degrees || 0}>
            <Wheel />
          </Rotater>
        </View>
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
          }}>
          <Turtle />
        </View>
      </View>
    </ScreenContainer>
  );
}

export default Tuner;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
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
