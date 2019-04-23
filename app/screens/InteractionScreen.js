import React from 'react';
import Emoji from 'react-native-emoji';
import { Avatar, Button, Icon, ListItem, SocialIcon, Overlay, Text } from 'react-native-elements';
import { InteractionManager, Platform, SectionList, StyleSheet, RefreshControl, ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import moment from 'moment';
import { NavigationEvents } from 'react-navigation';
import Faker from 'faker';
import { timeOfDay, timeOfDayEmojis, socialContexts, socialContextsEmojis, interactionMedium, interactionMediumEmojis } from '../config/constants';
import { getInteractions } from '../utils/api';
const _ = require('lodash');

Date.prototype.getUnixTime = function() { return this.getTime()/1000|0 };

export default class InteractionScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
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
      headerRight: (
        <Button
          icon={
            <Icon
              name="filter"
              type="font-awesome"
              size={24}
              color="white"
            />
          }
          title='Filter FB'
          size={25}
          buttonStyle={{backgroundColor: 'rgba(0,0,0,0)'}}
          onPress={() => params.handleFilter()}
        />
      ),
      title: 'HappyTrack'
    }
  }
  constructor() {
    super()

    this.state = {
      interactions: [],
      overlayInfo: null,
      refreshing: false,
      filterFB: false
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
    this.props.navigation.setParams({ handleFilter: this.handleFilter.bind(this) })
    InteractionManager.runAfterInteractions(() => {
      this._onRefresh();
    });
  }

  handleFilter() {
    this.setState(prevState => ({
      filterFB: !prevState.filterFB,
    }));
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
      reaction, loggee, other_loggable_text
    } = overlayInfo;
    return (
      <View style={styles.detailInteraction}>
        <Text h4>Your interaction with {loggee}</Text>
        <Text style={styles.text}>Recorded at: {this.getDate(created_at) + " at " + this.getTime(created_at)}</Text>

        { time_of_day !== '' &&
          <Text style={styles.text}>
            Time Of Day:
            <Text style={{fontWeight: "bold"}}> {time_of_day}</Text>
          </Text>
        }

        { interaction_medium !== '' &&
          <Text style={styles.text}>
            Social Interaction Medium:
            <Text style={{fontWeight: "bold"}}> {interaction_medium}</Text>
          </Text>
        }

        { content_class !== '' &&
          <Text style={styles.text}>
            Content Class:
            <Text style={{fontWeight: "bold"}}> {content_class}</Text>
          </Text>
        }

        { social_context !== '' &&
          <Text style={styles.text}>
            Social Context:
            <Text style={{fontWeight: "bold"}}> {social_context}</Text>
          </Text>
        }

        { other_loggable_text && other_loggable_text != '' &&
          <Text style={styles.text}>
            Interaction Notes: {"\n" + other_loggable_text}
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
    const emojiFS = 25;

    const filterFB = this.state.filterFB;
    const sortedInteractions = 
        _(this.state.interactions)
        .sortBy(event => event.created_at)
        .filter(event => !filterFB || (filterFB && event.from_fb)) // If filter is on, show fb interactions, else show all interactions
        .reverse()
        .groupBy(event => moment(event.created_at).format('MM/DD/YYYY'))
        .toPairs()
        .map((value, key) => ({title: moment(value[0], 'MM/DD/YYYY').format('ddd, MMMM DD, YYYY'), data: value[1]}))
        .value();
    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={payload => this.fetchData()}
        />
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
                    <Avatar rounded size="medium" title={this.getInitials(item.loggee)} />
                    <View style={{flexDirection: 'column', flex: 5, marginLeft: 15}}>
                      <Text style={{fontSize: 21}}>{item.reaction} interaction</Text>
                      <Text style={{fontSize: 16}}>{item.loggee} - <Text style={{fontWeight: 'bold'}}>{item.social_context}</Text></Text>
                    </View>
                    <View style={styles.subtitleView}>
                      <View style={styles.subInnerView}>
                        { item.from_fb &&
                          <Icon
                            name="logo-facebook"
                            type='ionicon'
                          />
                        }
                      </View>
                      <View style={styles.subInnerView}>
                      { item.interaction_medium && item.interaction_medium != '' &&
                        <Emoji 
                          name={interactionMediumEmojis[item.interaction_medium][0]} 
                          style={{fontSize: emojiFS}}
                        />
                      }
                      </View>
                      <View style={[styles.subInnerView, {flex: 2}]}>
                        <Text style={{fontSize: 18}}>{ this.getTime(item.created_at) }</Text>
                      </View>
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
        { this.state.overlayInfo &&
          <Overlay
            isVisible={true}
            onBackdropPress={() => this.setState({ overlayInfo: null })}
          >
            {this.getDetailedInteraction(this.state.overlayInfo)}
          </Overlay>
        }
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
    padding: 50,
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
    marginLeft: 'auto',
    flexDirection: 'row',
    flex: 4
  },
  subInnerView: {
    flex: 1,
    justifyContent: 'center',
    width: 20
  }
});
