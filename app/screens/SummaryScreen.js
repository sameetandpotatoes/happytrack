import React from 'react';
import { Button, Divider, Icon, Text } from 'react-native-elements';
import { ActivityIndicator, Dimensions, InteractionManager, Platform, StyleSheet, RefreshControl, ScrollView, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { getEmailUrl } from '../utils/api';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

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
      <WebView
        style={styles.webview}
        source={{uri: getEmailUrl()}}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={false}
      />
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
  },
  webview: {
    width: deviceWidth,
    height: deviceHeight
  }
});
