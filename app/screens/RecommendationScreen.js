import React from 'react';
import { Avatar, Button, Icon, ListItem, Text } from 'react-native-elements';
import { Platform, StyleSheet, RefreshControl, ScrollView, View } from 'react-native';
import { getRecommendations } from '../utils/api';

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
      headerTitle: 'HappyTrack'
    });

    constructor() {
        super()
    
        this.state = {
            refreshing: false,
            recommendations: []
        }
    }


  componentDidMount() {
    this._onRefresh()
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

  render() {
    console.log(this.state.recommendations);
    return (
        <View style={styles.container}>
            <View style={{flex: 1}}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)}
                    />
                }>
              {
	              this.state.recommendations.map((l, i) => (
	                <ListItem
	                  key={i}
	                  leftAvatar={<Avatar rounded title={l.rec_type} />}
	                  title={l.recommendation}
	                  subtitle={
	                    <View style={styles.subtitleView}>
                        <Text>{l.rec_description}</Text>
	                    </View>
	                  }
	                />
	              ))
	            }    
            </ScrollView>
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