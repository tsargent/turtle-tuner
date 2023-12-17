import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function Wheel(): JSX.Element {
  return (
    <View style={styles.container}>
      {notes.map((note, index) => (
        <View
          key={note}
          style={[
            styles.spokeContainer,
            {transform: [{rotate: `${(360 / notes.length) * index}deg`}]},
          ]}>
          <View style={styles.noteContainer}>
            <Text style={styles.note}>{note}</Text>
          </View>
          <View style={styles.spoke} />
        </View>
      ))}
    </View>
  );
}

export default Wheel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spokeContainer: {
    position: 'absolute',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    height: 320,
  },
  noteContainer: {
    position: 'absolute',
    bottom: '100%',
  },
  note: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'gray',
  },
  spoke: {
    position: 'absolute',
    width: 1,
    height: 320,
    backgroundColor: 'gray',
  },
});
