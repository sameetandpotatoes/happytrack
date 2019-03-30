import React from 'react';
import Emoji from 'react-native-emoji';
import { ThemeProvider, colors, Avatar, Button, Header, Icon, ListItem, Overlay, Text } from 'react-native-elements';
import { Platform, StyleSheet, RefreshControl, ScrollView, TouchableOpacity, View, UIManager } from 'react-native';
import { timeOfDayEmojis, socialContextsEmojis, interactionMediumEmojis } from '../config/constants';
import * as moment from 'moment'

export default class InteractionScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({    
    headerLeft: (
      <Button
        icon={
          <Icon
            name="menu"
            size={24}
            color="white"
          />
        }
        onPress={() => navigation.openDrawer()} 
        style={{position: 'absolute', left: 20}}>
      </Button>
    ),
    headerTitle: 'HappyTrack'
  });

  constructor() {
    super()

    this.state = {
      interactions: [],
      overlayInteractionIndex: -1,
      refreshing: false
    }

    this.navToNewInteractionScreen = this.navToNewInteractionScreen.bind(this)
    this.getDetailedInteraction = this.getDetailedInteraction.bind(this)
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    // TODO actually get data again
    new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
      this.setState({refreshing: false});
    });
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
          timestamp: 1426967129,
          other_loggable_text: 'This interaction was not great.',
        },
        {
          name: 'Yasha Mostofi',
          emoji: 'sweat',
          timeOfDay: 'Morning',
          context: null,
          medium: null,
          timestamp: 1552846376,
          other_loggable_text: 'This interaction was great.'
        }
      ]
    })
  }

  getDate(epoch) {
    return moment.unix(epoch).format('dddd, MM/DD')
  }

  getTime(epoch) {
    return moment.unix(epoch).format('h:mm a')
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

  getDetailedInteraction(index) {
    if (index == -1) {
      console.error("can't display this");
      return <View>An error occurred. Please close this.</View>;
    }

    const {
      timeOfDay, context, medium, timestamp,
      emoji, name, other_loggable_text
    } = this.state.interactions[index];
    return (
      <View style={styles.detailInteraction}>
        <Text h4>Your interaction with {name}</Text>
        <Text style={styles.text}>Recorded at: {this.getDate(timestamp) + " at " + this.getTime(timestamp)}</Text>

        { timeOfDay && timeOfDay != '' &&
          <Text style={styles.text}>
            Time Of Day:
            <Text style={{fontWeight: "bold"}}> {timeOfDay}</Text>
          </Text>
        }

        { medium && medium != '' &&
          <Text style={styles.text}>
            Social Interaction Medium:
            <Text style={{fontWeight: "bold"}}> {medium}</Text>
          </Text>
        }

        { context && context != '' &&
          <Text style={styles.text}>
            Social Context:
            <Text style={{fontWeight: "bold"}}> {context}</Text>
          </Text>
        }

        { other_loggable_text && other_loggable_text != '' &&
          <Text style={styles.text}>
            Interaction Notes: {"\n\n" + other_loggable_text}
          </Text>
        }
      </View>
    );

  }

  render() {
    const emojiFS = 21;

    return (
      <View style={styles.container}>
        {/*<Header
          containerStyle={styles.headerContainer}
          leftComponent={{text: 'HappyTrack', style: { flex: 1, textAlignVertical: 'center', justifyContent: 'center', alignItems: 'center', fontSize: 24, width: 300, color: '#FFFFFF'}}}
          centerComponent={null}
          rightComponent={
            <View style={{ alignSelf: 'center', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Icon name="sign-out" type="font-awesome" color="#fff" onPress={this.handleLogout} />
            </View>
          } />
        */}

        { this.state.overlayInteractionIndex != -1 &&
          <Overlay
            isVisible={true}
            onBackdropPress={() => this.setState({ overlayInteractionIndex: -1 })}
          >
            {this.getDetailedInteraction(this.state.overlayInteractionIndex)}
          </Overlay>
        }

        <View style={{flex: 1}}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }>
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
            width: 70,
            position: 'absolute',
            bottom: 25,
            right: 25,
            height: 70,
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
    flex: 1,
    padding: 20
  },
  text: {
    fontSize: 20,
    margin: 5,
  },
  headerContainer: {
    height: Platform.select({
      android: 56,
      default: 44,
    })
  }
});
