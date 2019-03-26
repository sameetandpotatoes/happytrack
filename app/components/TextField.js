import React from 'react'
import { View, StyleSheet, TextInput, Text } from 'react-native'

const TextField = props => (
  <View>
    <TextInput
      style={{height: 40, borderColor: 'gray', borderWidth: 1}}
      {...props}
    />
    {props.error && <Text style={styles.error}>{props.error}</Text>}
  </View>
)

const styles = StyleSheet.create({
  error: {
    color: 'red'
  }
});

export default TextField
