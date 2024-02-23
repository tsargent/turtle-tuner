import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type ScreenContainerProps = {
  children: React.ReactNode;
};

const ScreenContainer = ({
  children,
}: ScreenContainerProps): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        {
          // paddingTop: insets.top,
          // paddingBottom: insets.bottom,
          // paddingLeft: insets.left,
          // paddingRight: insets.right,
        },
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ScreenContainer;
