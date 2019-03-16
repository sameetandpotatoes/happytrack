import React from 'react';
import { ThemeProvider, colors, Text } from 'react-native-elements';
import { Platform, StyleSheet, View } from 'react-native';

const theme = {
  colors: {
    ...Platform.select({
      default: colors.platform.android,
      ios: colors.platform.ios,
    }),
  },
};

export default class InteractionList extends React.Component {
  constructor() {
    super()
  }

  render() {
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
