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
import {useIsEmulator} from 'react-native-device-info';
import ScreenContainer from './ScreenContainer';
import Wheel from './Wheel';
import Rotater from './Rotater';
import Turtle from './Turtle';
import frequencyToDegrees from '../lib/frequencyToDegrees';
import {useTuner} from '../lib';

function Tuner(): React.JSX.Element {
  const tunerData = useTuner();
  console.log(tunerData);

  return (
    <ScreenContainer>
      <View style={styles.turtleContainer}>
        <Turtle />
      </View>

      <View style={styles.wheelContainer}>
        <Rotater degrees={tunerData.degrees || 0}>
          <Wheel />
        </Rotater>
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
  turtleContainer: {
    height: '100%',
    width: '100%',
    zIndex: 2,
  },
  wheelContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
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
