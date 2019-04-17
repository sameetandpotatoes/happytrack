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
      this.setState({
        recommendations: recs.data.data,
        refreshing: false
      });
    }.bind(this));
  }

  handleFeedback(item, feedback_typ) {
    const reloadData = this._onRefresh;
    postFeedback(item.id, feedback_typ, function(response) {
        // TODO check status 200?
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
                          <Text style={{flex: 3}}>{item.recommendation}</Text>
                          <Text style={{flex: 7}}>{item.rec_description}</Text>
                          <Icon style={{flex: 2}}
                            name={'thumb-up'}
                            color={item.feedback && item.feedback.feedback_typ == "WO" ? "green" : "gray"}
                            onPress={() => this.handleFeedback.bind(this, item, 'WO')}
                          />
                          <Icon style={{flex: 1}}
                            name={'thumb-down'}
                            color={item.feedback && item.feedback.feedback_typ == "DW" ? "red" : "gray"}
                            onPress={() => this.handleFeedback.bind(this, item, 'DW')}
                          />  
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