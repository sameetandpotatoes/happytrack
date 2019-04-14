import React from 'react';
import { Platform, StyleSheet, ScrollView, View } from 'react-native';
import { getRecommendations } from '../utils/api';

export default class RecommendationsScreen extends React.Component {
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
    getRecommendations(function(recs) {
       this.setState({recommendations: recs}); 
    });
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    getRecommendations(function(recs) {
        this.setState({
            recommendations: recs,
            refreshing: false
          });
    });
  }

  render() {
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
                        leftAvatar={<Avatar rounded title={"JS"} />}
                        title={"name"}
                        subtitle={
                            <View style={styles.subtitleView}>
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