import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Text,
  View,
  StyleSheet,
  Button,
  SafeAreaView,
  TouchableOpacity,
  Easing,
} from 'react-native';

function Meter(props: {frequency: number}): JSX.Element {
  const cents = React.useRef(new Animated.Value(0)).current;
  const {frequency} = props;
  const [centChange, setCentsChange] = React.useState(0);

  const goLeft = () => {
    setCentsChange(-10);
  };

  const goRight = () => {
    setCentsChange(10);
  };

  useEffect(() => {
    console.log('centChange????', centChange);
    Animated.timing(cents, {
      toValue: centChange,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start();
  }, [centChange]);

  console.log('cents', cents);
  console.log('centChange', centChange);

  const rotate = cents.interpolate({
    inputRange: [-10, 10],
    outputRange: ['-45deg', '45deg'],
  });

  return (
    <View>
      <Animated.View
        style={[styles.meter, {transform: [{rotate}, {translateY: -50}]}]}
      />
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
    backgroundColor: '#111111',
    borderRadius: 5,
    transformOrigin: '10px 2px', // opacity: 0.5,
  },
});
