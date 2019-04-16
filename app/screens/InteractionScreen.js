import React from 'react';
import Emoji from 'react-native-emoji';
import { Avatar, Button, Icon, ListItem, Overlay, Text } from 'react-native-elements';
import { Platform, SectionList, StyleSheet, RefreshControl, ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import moment from 'moment';
import Faker from 'faker';
import { timeOfDay, timeOfDayEmojis, socialContexts, socialContextsEmojis, interactionMedium, interactionMediumEmojis } from '../config/constants';
const _ = require('lodash');

Date.prototype.getUnixTime = function() { return this.getTime()/1000|0 };

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
        transparent='true'
        onPress={() => navigation.openDrawer()} 
        buttonStyle={{backgroundColor: 'rgba(0,0,0,0)'}}
        style={{position: 'absolute', left: 25, top: (Platform.OS === 'ios' ) ? -25 : 0}}>
      </Button>
    ),
    headerTitle: 'HappyTrack'
  });

  constructor() {
    super()

    this.state = {
      interactions: [],
      overlayInfo: null,
      refreshing: false
    }

    this.navToNewInteractionScreen = this.navToNewInteractionScreen.bind(this)
    this.getDetailedInteraction = this.getDetailedInteraction.bind(this)
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    // TODO actually get data again
    this.fetchData().then((data) => {
      this.setState({
        interactions: data,
        refreshing: false
      });
    });

    // TODO FAKE DATA LOOKS LIKE:
    /*
      {
        "model": "api.logentry",
        "pk": 2,
        "fields": {
            "reaction": "Happy",
            "loggee": 7,
            "logger": 1,
            "time_of_day": "Morning",
            "social_context": "Academic",
            "interaction_medium": "In Person",
            "content_class": "",
            "other_loggable_text": "Ok",
            "created_at": "2019-04-16T01:42:10.057Z",
            "updated_at": "2019-04-16T01:42:10.057Z"
        }
      }
    */
  }

  navToNewInteractionScreen() {
    this.props.navigation.navigate('NewInteractionScreen')
  }

  fetchData() {
    return new Promise(
      function (resolve, reject) {
        // TODO fetch from API
        let fakeData = [];

        for (let i = 0; i < 50; i++) {
          fakeData.push({
            name: Faker.name.findName(),
            emoji: _.sample(['grinning', 'blush', 'neutral_face', 'sweat', 'confounded']),
            timeOfDay: _.sample(timeOfDay),
            context: _.sample(socialContexts),
            medium: _.sample(interactionMedium),
            timestamp: new Date(Faker.date.between('2019-03-03', '2019-03-15')).getUnixTime(),
            other_loggable_text: Faker.lorem.sentences(3, 3)
          });
        }
  
        resolve(fakeData);
      }
    );
  }

  componentDidMount() {
    this._onRefresh();
  }

  getDate(epoch) {
    return moment.unix(epoch).format('dddd, MM/DD')
  }

  getTime(epoch) {
    return moment.unix(epoch).format('h:mm a')
  }

  /**
  * Gets the initials of the name, max of 2 characters (for first and last name)
  */
  getInitials(name) {
    const initials = name.split(" ").map(s => s.charAt(0)).join('').toUpperCase();
    return initials.charAt(0) + initials.charAt(initials.length - 1);
  }

  viewDetail(item) {
    this.setState({ overlayInfo: item });
  }

  getDetailedInteraction(overlayInfo) {
    const {
      timeOfDay, context, medium, timestamp,
      emoji, name, other_loggable_text
    } = overlayInfo;
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

  FlatListItemSeparator = () => {
    return (
      //Item Separator
      <View style={{height: 0.5, width: '100%', backgroundColor: '#C8C8C8'}}/>
    );
  };

  render() {
    const emojiFS = 22;

    const sortedInteractions = 
        _(this.state.interactions)
        .sortBy(event => event.timestamp)
        .reverse()
        .groupBy(event => moment.unix(event.timestamp).format('MM/DD/YYYY'))
        .toPairs()
        .map((value, key) => ({title: moment(value[0], 'MM/DD/YYYY').format('ddd MMMM DD'), data: value[1]}))
        .value();

    return (
      <View style={styles.container}>
        { this.state.overlayInfo &&
          <Overlay
            isVisible={true}
            onBackdropPress={() => this.setState({ overlayInfo: null })}
          >
            {this.getDetailedInteraction(this.state.overlayInfo)}
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
            <SectionList
              ItemSeparatorComponent={this.FlatListItemSeparator}
              sections={sortedInteractions}
              renderSectionHeader={({ section }) => (
                <Text style={styles.SectionHeaderStyle}> {section.title} </Text>
              )}
              renderItem={({item, index, section}) => (
                <TouchableWithoutFeedback onPress={ () => this.viewDetail(item)}>
                  <View style={styles.SectionListItems} onPress={this.viewDetail}>
                    <Avatar rounded size="medium" title={this.getInitials(item.name)} />
                    <View style={{flexDirection: 'column', marginLeft: 5}}>
                      <Text style={{fontSize: 20}}>{item.name}</Text>
                      <Text style={{fontSize: 16}}>{"at " + this.getTime(item.timestamp)}</Text>
                    </View>
                    <View style={styles.subtitleView}>
                      <Emoji name={item.emoji} style={{fontSize: emojiFS, position: 'absolute', right: 0, bottom: 10}} />
                      { item.timeOfDay && item.timeOfDay != '' &&
                        <Emoji name={timeOfDayEmojis[item.timeOfDay]} style={{fontSize: emojiFS, position: 'absolute', right: 40, bottom: 10}} />
                      }
                      { item.context && item.context != '' &&
                        <Emoji name={socialContextsEmojis[item.context]} style={{fontSize: emojiFS, position: 'absolute', right: 80, bottom: 10}} />
                      }
                      { item.medium && item.medium != '' &&
                        <Emoji name={interactionMediumEmojis[item.medium]} style={{fontSize: emojiFS, position: 'absolute', right: 120, bottom: 10}} />
                      }
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              )}
              keyExtractor={(item, index) => index}
              />
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
    fontSize: 18,
    margin: 5,
  },
  headerContainer: {
    height: Platform.select({
      android: 56,
      default: 44,
    })
  },
  SectionHeaderStyle: {
    backgroundColor : '#64B5F6',
    fontSize : 20,
    padding: 5,
    color: '#fff',
    fontWeight: 'bold'
  },
  SectionListItems: {
    fontSize : 16,
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
    padding: 10,
    color: '#000',
    backgroundColor : '#F5F5F5',
  },
  subtitleView: {
    marginLeft: 'auto'
  }
});
