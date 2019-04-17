import React from 'react';
import { Avatar, Button, Icon, ListItem, Text } from 'react-native-elements';
import { Platform, StyleSheet, FlatList, InteractionManager, RefreshControl, ScrollView, View } from 'react-native';
import { getRecommendations, postFeedback } from '../utils/api';

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

  renderRow = ({ item }) => (
    <ListItem
      leftAvatar={<Avatar rounded size="small" title={item.rec_typ} />}
      title={item.recommendation}
      subtitle={item.rec_description}
      rightIcon={
        <View style={{width: 60, flexDirection: 'row'}}>
          <Icon
            name={'thumb-up'}
            color={item.feedback && item.feedback.feedback_typ == "WO" ? "green" : "gray"}
            onPress={() => this.handleFeedback.bind(this, item, 'WO')}
          />
          <Icon
            name={'thumb-down'}
            color={item.feedback && item.feedback.feedback_typ == "DW" ? "red" : "gray"}
            onPress={() => this.handleFeedback.bind(this, item, 'DW')}
          />  
        </View>
      }
    />
  );

  render() {
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
                
                  <FlatList
                    data={this.state.recommendations}
                    renderItem={this.renderRow}
                    keyExtractor={keyExtractor}
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
    }
  });