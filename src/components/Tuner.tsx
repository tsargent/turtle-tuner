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
  const {degrees, tone} = useTuner();

  return (
    <ScreenContainer>
      <View style={styles.turtleContainer}>
        <Turtle />
      </View>

      <View style={styles.wheelContainer}>
        <Rotater degrees={degrees || 0}>
          <Wheel />
        </Rotater>
      </View>
      <View style={styles.toneContainer}>
        <Text style={styles.tone}>{tone}</Text>
      </View>
    </ScreenContainer>
  );
}

export default Tuner;

const styles = StyleSheet.create({
  turtleContainer: {
    height: '100%',
    width: '100%',
    zIndex: 2,
  },
  wheelContainer: {
    top: '43%',
    position: 'absolute',
    transform: [{scale: 0.8}],
  },
  toneContainer: {
    zIndex: 2,
    position: 'absolute',
    width: 100,
    top: '72%',
    alignItems: 'center',
  },
  tone: {
    color: 'gray',
    fontSize: 50,
    fontWeight: 'bold',
  },
  frequency: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
