import React from 'react';
import Emoji from 'react-native-emoji';
import { ThemeProvider, colors, Avatar, Button, Header, Icon, ListItem, Text } from 'react-native-elements';
import { Platform, StyleSheet, ScrollView, View } from 'react-native';
import { timeOfDayEmojis, socialContextsEmojis, interactionMediumEmojis } from '../config/constants';
import { Svg, G, Rect } from 'react-native-svg';

export default class SummaryScreen extends React.Component {
  constructor() {
    super()

    this.state = {
      interactions: []
    }

    this.navToNewInteractionScreen = this.navToNewInteractionScreen.bind(this)
  }

  navToNewInteractionScreen() {
    this.props.navigation.navigate('NewInteractionScreen')
  }

  componentDidMount() {
    // TODO what fake data looks like, should be sorted by timestamp in descending order probably, and then labeled by week in the app?
    this.setState({
      interactions: [
        {
          name: 'John Smith',
          emoji: 'grinning',
          timeOfDay: 'Morning',
          context: 'Academic',
          medium: 'In Person',
          timestamp: 1426967129
        },
      ]
    })
  }

  getDate(epoch) {
    return new Date(epoch).toLocaleDateString("en-US")
  }

  getTime(epoch) {
    return new Date(epoch).toLocaleTimeString("en-US")
  }

  /**
  * Get the first character of the name
  */
  getInitials(name) {
    return name.split(" ").map(s => s.charAt(0)).join('').toUpperCase();
  }

  render() {
    const SVGHeight = 60
    const SVGWidth = 60
    const graphHeight = 50

    return (
      <Svg width={SVGWidth} height={SVGHeight}>
        {/* translate for 'graphHeight' on y axis */}
        <G y={graphHeight}>
          <Rect
              x="15"
              y="-15"
              width="20"
              height="20"
              stroke="red"
              strokeWidth="4"
              fill="yellow"
            />
        </G>
      </Svg>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
