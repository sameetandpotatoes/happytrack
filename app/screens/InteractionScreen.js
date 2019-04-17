import React from 'react';
import Emoji from 'react-native-emoji';
import { Avatar, Button, Icon, ListItem, Overlay, Text } from 'react-native-elements';
import { InteractionManager, Platform, SectionList, StyleSheet, RefreshControl, ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import moment from 'moment';
import Faker from 'faker';
import { timeOfDay, timeOfDayEmojis, socialContexts, socialContextsEmojis, interactionMedium, interactionMediumEmojis } from '../config/constants';
import { getInteractions } from '../utils/api';
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
    this.fetchData()
  }

  navToNewInteractionScreen() {
    this.props.navigation.navigate('NewInteractionScreen')
  }

  fetchData() {
    getInteractions(function(data) {
      this.setState({
        interactions: data.data.interactions,
        refreshing: false
      });
    }.bind(this));
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this._onRefresh();
    });
  }

  getDate(epoch) {
    return moment(epoch).format('dddd, MM/DD')
  }

  getTime(epoch) {
    return moment(epoch).format('h:mm a')
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
      time_of_day, social_context, content_class, interaction_medium, created_at,
      reaction, name, other_loggable_text
    } = overlayInfo;
    return (
      <View style={styles.detailInteraction}>
        <Text h4>Your interaction with {loggee}</Text>
        <Text style={styles.text}>Recorded at: {this.getDate(created_at) + " at " + this.getTime(created_at)}</Text>

        { time_of_day && time_of_day != '' &&
          <Text style={styles.text}>
            Time Of Day:
            <Text style={{fontWeight: "bold"}}> {timeOfDayEmojis[time_of_day][1]}</Text>
          </Text>
        }

        { interaction_medium && interaction_medium != '' &&
          <Text style={styles.text}>
            Social Interaction Medium:
            <Text style={{fontWeight: "bold"}}> {interactionMediumEmojis[interaction_medium][1]}</Text>
          </Text>
        }

        { content_class && content_class != '' &&
          <Text style={styles.text}>
            Content Class:
            <Text style={{fontWeight: "bold"}}> {content_class}</Text>
          </Text>
        }

        { social_context && social_context != '' &&
          <Text style={styles.text}>
            Social Context:
            <Text style={{fontWeight: "bold"}}> {socialContextsEmojis[social_context][1]}</Text>
          </Text>
        }

        {/* { other_loggable_text && other_loggable_text != '' &&
          <Text style={styles.text}>
            Interaction Notes: {"\n\n" + other_loggable_text}
          </Text>
        } */}
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
        .sortBy(event => event.created_at)
        .reverse()
        .groupBy(event => moment(event.created_at).format('MM/DD/YYYY'))
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
                    <Avatar rounded size="medium" title={this.getInitials(item.loggee).substring(0, 1)} />
                    <View style={{flexDirection: 'column', marginLeft: 5}}>
                      <Text style={{fontSize: 20}}>{item.loggee}</Text>
                      <Text style={{fontSize: 16}}>{"at " + this.getTime(item.created_at)}</Text>
                    </View>
                    <View style={styles.subtitleView}>
                      {/* <Emoji name={item.fields.reaction} style={{fontSize: emojiFS, position: 'absolute', right: 0, bottom: 10}} /> */}
                      { item.time_of_day && item.time_of_day != '' &&
                        <Emoji name={timeOfDayEmojis[item.time_of_day][0]} style={{fontSize: emojiFS, position: 'absolute', right: 40, bottom: 10}} />
                      }
                      { item.social_context && item.social_context != '' &&
                        <Emoji name={socialContextsEmojis[item.social_context][0]} style={{fontSize: emojiFS, position: 'absolute', right: 80, bottom: 10}} />
                      }
                      { item.interaction_medium && item.interaction_medium != '' &&
                        <Emoji name={interactionMediumEmojis[item.interaction_medium][0]} style={{fontSize: emojiFS, position: 'absolute', right: 120, bottom: 10}} />
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
