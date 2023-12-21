import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, Animated} from 'react-native';

type RotaterProps = {
  degrees: number;
  children: React.ReactNode;
};

const Rotater = ({degrees, children}: RotaterProps): React.JSX.Element => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: degrees,
      duration: 200, // Adjust the duration as needed
      useNativeDriver: true, // Set to true if possible for better performance
    }).start();
  }, [degrees]);

  const interpolateRotation = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{transform: [{rotate: interpolateRotation}]}}>
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{rotate: '255deg'}],
  },
});

export default Rotater;
