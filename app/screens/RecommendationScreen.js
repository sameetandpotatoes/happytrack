import React from 'react';
import { Avatar, Button, Icon, ListItem, Text } from 'react-native-elements';
import { Platform, StyleSheet, SectionList, TouchableWithoutFeedback, InteractionManager, RefreshControl, ScrollView, View } from 'react-native';
import { getRecommendations, postFeedback } from '../utils/api';
import { recTypes } from '../config/constants';
const _ = require('lodash');
const keyExtractor = item => item.id.toString();

export default class RecommendationScreen extends React.Component {
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
          style={{position: 'absolute', left: 20, top: (Platform.OS === 'ios' ) ? -25 : 0}}>
        </Button>
      ),
      headerTitle: 'Recommendations'
    });

    constructor() {
        super()
    
        this.state = {
            refreshing: false,
            recommendations: []
        }
    }


  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this._onRefresh()
    });
  }

  _onRefresh = () => {
    this.setState({refreshing: true});

    getRecommendations(function(recs) {
      console.log(recs.data.data);
      this.setState({
        recommendations: recs.data.data,
        refreshing: false
      });
    }.bind(this));
  }

  handleFeedback(item, feedback_typ) {
    // If feedback is already defined, then ignore this. We can only provide feedback once.
    if (item.feedback !== null) {
      return;
    }


    const reloadData = this._onRefresh;
    postFeedback(item.id, feedback_typ, function(response) {
        // TODO if we check status 200 and had the index, we can just change the color without actually refreshing and losing our position
        reloadData()
    });
  }

  FlatListItemSeparator = () => {
    return (
      //Item Separator
      <View style={{height: 0.5, width: '100%', backgroundColor: '#C8C8C8'}}/>
    );
  };

  render() {
    const sortedRecs = 
      _(this.state.recommendations)
      .groupBy(event => event.rec_typ)
      .toPairs()
      .map((value, key) => ({title: recTypes[value[0]], data: value[1]}))
      .value();
    
    return (
        <View style={styles.container}>
            <View style={{flex: 1}}>
              { 
                !this.state.refreshing && 
                <ScrollView
                  refreshControl={
                      <RefreshControl
                          refreshing={this.state.refreshing}
                          onRefresh={this._onRefresh.bind(this)}
                      />
                  }>
                <SectionList
                  ItemSeparatorComponent={this.FlatListItemSeparator}
                  sections={sortedRecs}
                  renderSectionHeader={({ section }) => (
                    <Text style={styles.SectionHeaderStyle}> {section.title} </Text>
                  )}
                  renderItem={({item, index, section}) => (
                      <View style={styles.SectionListItems}>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                          <Text style={{flex: 3, fontSize: 20}}>{item.recommendation}</Text>
                          <Text style={{flex: 6, fontSize: 18}}>{item.rec_description}</Text>
                          <View style={{flex: 1, flexdirection: 'column', justifyContent: 'space-evenly'}}>
                            <Icon
                              name={'thumb-up'}
                              color={item.feedback && item.feedback.feedback_typ == "Worked" ? "green" : "gray"}
                              onPress={() => this.handleFeedback(item, 'Worked')}
                            />
                            <Icon
                              name={'thumb-down'}
                              color={item.feedback && item.feedback.feedback_typ == "Doesn\'t Work" ? "red" : "gray"}
                              onPress={() => this.handleFeedback(item, 'Doesn\'t Work')}
                            />  
                          </View>
                        </View>
                      </View>
                  )}
                  keyExtractor={(item, index) => index}
                  />

                </ScrollView>
              }
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    text: {
      fontSize: 18,
      margin: 5,
    },
    subtitleView: {
      marginLeft: 'auto'
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
  });