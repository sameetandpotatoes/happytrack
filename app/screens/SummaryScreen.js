import React from 'react';
import { Button, Divider, Icon, Text } from 'react-native-elements';
import { ActivityIndicator, InteractionManager, Platform, StyleSheet, RefreshControl, ScrollView, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { getEmailUrl } from '../utils/api';

export default class SummaryScreen extends React.Component {
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
      summaries: [],
      isReady: false,
      refreshing: false,
    }
  }

  _onRefresh() {
    // Should trigger a re-render
    this.setState({refreshing: false});
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({isReady: true, refreshing: true});
      this._onRefresh()
    });
  }

  render() {
    if (!this.state.isReady) {
      return <ActivityIndicator />
    }

    return (
      <View style={styles.container}>
        <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }>
        <WebView
          source={{uri: getEmailUrl()}}
        />
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    padding: 20
  },
  summaryView: {
    padding: 20
  }
});
