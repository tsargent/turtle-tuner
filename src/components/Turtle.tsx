/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Image, StyleSheet, useWindowDimensions} from 'react-native';

function Turtle(): React.JSX.Element {
  return (
    <Image
      source={require('../assets/Turtle_Tuner_3-2_a-Full-centered-cropped.png')}
      resizeMode="cover"
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
}

export default Turtle;

const styles = StyleSheet.create({});
