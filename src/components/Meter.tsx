import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Text,
  View,
  StyleSheet,
  Button,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

function Meter(props: {frequency: number}): JSX.Element {
  const meterAnimation = React.useRef(new Animated.Value(0)).current;
  const {frequency} = props;

  const goLeft = () => {
    console.log('goLeft');
    Animated.timing(meterAnimation, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const goRight = () => {
    Animated.timing(meterAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    Animated.timing(meterAnimation, {
      toValue: frequency,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [frequency]);

  return (
    <View>
      <Animated.View style={[styles.meter, {opacity: meterAnimation}]} />
      <TouchableOpacity
        onPress={goLeft}
        style={{padding: 20, backgroundColor: 'gray'}}>
        <Text>Left</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={goRight}
        style={{padding: 20, backgroundColor: 'gray'}}>
        <Text>Right</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Meter;

const styles = StyleSheet.create({
  meter: {
    width: 10,
    height: 100,
    backgroundColor: 'red',
    // opacity: 0.5,
  },
});
