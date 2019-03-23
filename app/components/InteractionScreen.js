import React from 'react';
import Emoji from 'react-native-emoji';
import { ThemeProvider, colors, Avatar, Button, Header, Icon, ListItem, Overlay, Text } from 'react-native-elements';
import { Platform, StyleSheet, ScrollView, View } from 'react-native';
import { LoginManager } from 'react-native-fbsdk';
import { timeOfDayEmojis, socialContextsEmojis, interactionMediumEmojis } from '../config/constants'

export default class InteractionScreen extends React.Component {
  // static navigationOptions = { header: null };
  constructor() {
    super()

    this.state = {
      interactions: [],
      overlayInteractionIndex: -1
    }

    this.navToNewInteractionScreen = this.navToNewInteractionScreen.bind(this)
    this.getDetailedInteraction = this.getDetailedInteraction.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
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
        {
          name: 'John Smith',
          emoji: 'grinning',
          timeOfDay: 'Morning',
          context: 'Academic',
          medium: 'In Person',
          timestamp: 1426967129
        },
        {
          name: 'John Smith',
          emoji: 'grinning',
          timeOfDay: 'Morning',
          context: 'Academic',
          medium: 'In Person',
          timestamp: 1426967129
        },
        {
          name: 'John Smith',
          emoji: 'grinning',
          timeOfDay: 'Morning',
          context: 'Academic',
          medium: 'In Person',
          timestamp: 1426967129
        },
        {
          name: 'John Smith',
          emoji: 'grinning',
          timeOfDay: 'Morning',
          context: 'Academic',
          medium: 'In Person',
          timestamp: 1426967129
        },
        {
          name: 'John Smith',
          emoji: 'grinning',
          timeOfDay: 'Morning',
          context: 'Academic',
          medium: 'In Person',
          timestamp: 1426967129
        },
        {
          name: 'John Smith',
          emoji: 'grinning',
          timeOfDay: 'Morning',
          context: 'Academic',
          medium: 'In Person',
          timestamp: 1426967129
        },
        {
          name: 'John Smith',
          emoji: 'grinning',
          timeOfDay: 'Morning',
          context: 'Academic',
          medium: 'In Person',
          timestamp: 1426967129
        },
        {
          name: 'John Smith',
          emoji: 'grinning',
          timeOfDay: 'Morning',
          context: 'Academic',
          medium: 'In Person',
          timestamp: 1426967129
        },
        {
          name: 'John Smith',
          emoji: 'grinning',
          timeOfDay: 'Morning',
          context: 'Academic',
          medium: 'In Person',
          timestamp: 1426967129
        },
        {
          name: 'Yasha Mostofi',
          emoji: 'sweat',
          timeOfDay: 'Morning',
          context: null,
          medium: null,
          timestamp: 1552846376
        }
      ]
    })
  }

  getDate(epoch) {
    // TODO: format to MM/DD instead
    return new Date(epoch).toLocaleDateString("en-US")
  }

  getTime(epoch) {
    // TODO format to hh:mm instead
    return new Date(epoch).toLocaleTimeString("en-US")
  }

  /**
  * Get the first character of the name
  */
  getInitials(name) {
    return name.split(" ").map(s => s.charAt(0)).join('').toUpperCase()
  }

  viewDetail(index) {
    this.setState({ overlayInteractionIndex: index })
  }

  handleLogout() {
    LoginManager.logOut()
    const { navigate } = this.props.navigation
    navigate('HomeScreen')
  }

  getDetailedInteraction(index) {
    if (index == -1) {
      console.error("can't display this");
      return <View>An error occurred. Please close this.</View>;
    }

    const { timeOfDay, context, medium, timestamp, emoji, name } = this.state.interactions[index];
    return (
      <View style={styles.detailInteraction}>
        <Text h3>Your interaction with {name}</Text>
        <Text style={styles.text}>Time: {this.getDate(timestamp) + " at " + this.getTime(timestamp)}</Text>

        { timeOfDay && timeOfDay != '' &&
          <Text style={styles.text}>Time Of Day: {timeOfDay}</Text>
        }

        { medium && medium != '' &&
          <Text style={styles.text} >Social Interaction Medium: {medium}</Text>
        }

        { context && context != '' &&
          <Text style={styles.text}>Social Context: {context}</Text>
        }
      </View>
    );

  }

  render() {
    const emojiFS = 21;

    return (
      <View style={styles.container}>
        <Header
          containerStyle={{marginTop: Platform.OS === 'ios' ? 0 : - 30}}
          leftComponent={{text: 'HappyTrack', style: {fontSize: 24, width: 300, color: '#FFFFFF'}}}
          centerComponent={null}
          rightComponent={
            <Icon name="sign-out" type="font-awesome" color="#fff" onPress={this.handleLogout} />
          } />

        { this.state.overlayInteractionIndex != -1 &&
          <Overlay
            isVisible={true}
            onBackdropPress={() => this.setState({ overlayInteractionIndex: -1 })}
          >
            {this.getDetailedInteraction(this.state.overlayInteractionIndex)}
          </Overlay>
        }

        <View style={{flex: 1}}>
          <ScrollView>
            {
              this.state.interactions.map((l, i) => (
                <ListItem
                  key={i}
                  leftAvatar={<Avatar rounded title={this.getInitials(l.name)} />}
                  onPress={() => this.viewDetail(i)}
                  title={l.name}
                  subtitle={
                    <View style={styles.subtitleView}>
                      <Emoji name={l.emoji} style={{fontSize: emojiFS, position: 'absolute', right: 0}} />
                      { l.timeOfDay && l.timeOfDay != '' &&
                        <Emoji name={timeOfDayEmojis[l.timeOfDay]} style={{fontSize: emojiFS, position: 'absolute', right: 40}} />
                      }
                      { l.context && l.context != '' &&
                        <Emoji name={socialContextsEmojis[l.context]} style={{fontSize: emojiFS, position: 'absolute', right: 80}} />
                      }
                      { l.medium && l.medium != '' &&
                        <Emoji name={interactionMediumEmojis[l.medium]} style={{fontSize: emojiFS, position: 'absolute', right: 120}} />
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
          onPress={this.navToNewInteractionScreen}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  detailInteraction: {
    flex: 1
  },
  text: {
    fontSize: 24
  },
});
