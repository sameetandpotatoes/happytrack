import React from 'react';
import Emoji from 'react-native-emoji';
import { ThemeProvider, colors, Avatar, Button, Header, Icon, ListItem, Text } from 'react-native-elements';
import { Platform, StyleSheet, ScrollView, View } from 'react-native';
import { timeOfDayEmojis, socialContextsEmojis, interactionMediumEmojis } from '../config/constants'

export default class InteractionList extends React.Component {
  static navigationOptions = { header: null };
  constructor() {
    super()

    this.state = {
      interactions: []
    }

    this.navToNewInteraction = this.navToNewInteraction.bind(this)
  }

  navToNewInteraction() {
    this.props.navigation.navigate('NewInteraction')
  }

  componentDidMount() {
    // TODO what fake data looks like, should be sorted by timestamp in descending order probably, and then labeled by week in the app?
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
          name: 'John Smith',
          emoji: 'grinning',
          timeOfDay: 'Morning',
          context: 'academic',
          medium: 'in person',
          timestamp: 1426967129
        },
        {
          name: 'John Smith',
          emoji: 'grinning',
          timeOfDay: 'Morning',
          context: 'academic',
          medium: 'in person',
          timestamp: 1426967129
        },
        {
          name: 'John Smith',
          emoji: 'grinning',
          timeOfDay: 'Morning',
          context: 'academic',
          medium: 'in person',
          timestamp: 1426967129
        },
        {
          name: 'John Smith',
          emoji: 'grinning',
          timeOfDay: 'Morning',
          context: 'academic',
          medium: 'in person',
          timestamp: 1426967129
        },
        {
          name: 'John Smith',
          emoji: 'grinning',
          timeOfDay: 'Morning',
          context: 'academic',
          medium: 'in person',
          timestamp: 1426967129
        },
        {
          name: 'John Smith',
          emoji: 'grinning',
          timeOfDay: 'Morning',
          context: 'academic',
          medium: 'in person',
          timestamp: 1426967129
        },
        {
          name: 'John Smith',
          emoji: 'grinning',
          timeOfDay: 'Morning',
          context: 'academic',
          medium: 'in person',
          timestamp: 1426967129
        },
        {
          name: 'John Smith',
          emoji: 'grinning',
          timeOfDay: 'Morning',
          context: 'academic',
          medium: 'in person',
          timestamp: 1426967129
        },
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
          leftComponent={null}
          centerComponent={{ text: 'All interactions', style: { color: '#fff' } }}
          rightComponent={null} />

        <View style={{flex: 1}}>
          <ScrollView>
            {
              this.state.interactions.map((l, i) => (
                <ListItem
                  key={i}
                  leftAvatar={<Avatar rounded title={this.getInitials(l.name)} />}
                  title={l.name}
                  subtitle={
                    <View style={styles.subtitleView}>
                      <Emoji name={l.emoji} style={{fontSize: emojiFS, position: 'absolute', right: 0}} />
                      { l.timeOfDay != '' &&
                        <Emoji name={timeOfDayEmojis[l.timeOfDay]} style={{fontSize: emojiFS, position: 'absolute', right: 50}} />
                      }
                      { l.context != '' &&
                        <Emoji name={socialContextsEmojis[l.context]} style={{fontSize: emojiFS, position: 'absolute', right: 100}} />
                      }
                      { l.medium != '' &&
                        <Emoji name={interactionMediumEmojis[l.medium]} style={{fontSize: emojiFS, position: 'absolute', right: 150}} />
                      }
                      <Text>{this.getDate(l.timestamp) + " at " + this.getTime(l.timestamp)}</Text>
                    </View>
                  }
                />
              ))
            }
          </ScrollView>
        </View>

        <Button
          icon={<Icon name="person-add" type="material" color="white" />}
          title=""
          containerViewStyle={{ width: 100 }}
          buttonStyle={{
            flexDirection: 'column',
            alignItems:'center',
            justifyContent:'center',
            width:70,
            position: 'absolute',
            bottom: 25,
            right: 25,
            height:70,
            borderRadius:100,
          }}
          onPress={this.navToNewInteraction}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
