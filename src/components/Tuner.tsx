/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Text, StyleSheet} from 'react-native';

import ScreenContainer from './ScreenContainer';

function Tuner(): React.JSX.Element {
  return (
    <ScreenContainer>
      <Text>Hello</Text>
    </ScreenContainer>
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
