import React from 'react';
import Emoji from 'react-native-emoji';
import { ThemeProvider, colors, Avatar, Header, ListItem, Text } from 'react-native-elements';
import { Platform, StyleSheet, View } from 'react-native';
import { timeOfDayEmojis, socialContextsEmojis, interactionMediumEmojis } from '../config/constants'

export default class InteractionList extends React.Component {
  static navigationOptions = { header: null };
  constructor() {
    super()

    this.state = {
      interactions: []
    }
  }

  componentDidMount() {
    // TODO what fake data looks like, should be sorted by timestamp in descending order probably, and then labeled by week?
    this.setState({
      interactions: [
        {
          name: 'John Smith',
          emoji: 'grinning',
          timeOfDay: 'Morning',
          context: 'academic',
          medium: 'in person',
          timestamp: 1426967129
        },
        {
          name: 'Yasha Mostofi',
          emoji: 'sweat',
          timeOfDay: 'Morning',
          context: '',
          medium: '',
          timestamp: 1552846376
        }
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
    const emojiFS = 23;

    return (
      <View style={styles.container}>
        <Header
          leftComponent={{ text: 'Logged in User' }}
          centerComponent={{ text: 'All interactions', style: { color: '#fff' } }}
          rightComponent={null} />

        <View>
          {
            this.state.interactions.map((l, i) => (
              <ListItem
                key={i}
                leftAvatar={<Avatar rounded title={this.getInitials(l.name)} />}
                title={l.name}
                subtitle={
                  <View style={styles.subtitleView}>
                    <Emoji name={l.emoji} style={{fontSize: emojiFS, position: 'absolute', right: 0, justifyContent: 'center', alignItems: 'center'}} />
                    { l.timeOfDay != '' &&
                      <Emoji name={timeOfDayEmojis[l.timeOfDay]} style={{fontSize: emojiFS, position: 'absolute', right: 50, justifyContent: 'center', alignItems: 'center'}} />
                    }
                    { l.context != '' &&
                      <Emoji name={socialContextsEmojis[l.context]} style={{fontSize: emojiFS, position: 'absolute', right: 100, justifyContent: 'center', alignItems: 'center'}} />
                    }
                    { l.medium != '' &&
                      <Emoji name={interactionMediumEmojis[l.medium]} style={{fontSize: emojiFS, position: 'absolute', right: 150, justifyContent: 'center', alignItems: 'center'}} />
                    }
                    <Text>{this.getDate(l.timestamp) + " at " + this.getTime(l.timestamp)}</Text>
                  </View>
                }
              />
            ))
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
