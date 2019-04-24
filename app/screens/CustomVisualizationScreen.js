import React from 'react';
import { Button, Divider, Icon, Text } from 'react-native-elements';
import { ActivityIndicator, Dimensions, InteractionManager, Platform, StyleSheet, RefreshControl, ScrollView, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { getCustomVizUrl } from '../utils/api';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default class CustomVisualizationScreen extends React.Component {
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
          style={{position: 'absolute', left: 20, top: (Platform.OS === 'ios' ) ? -25 : 0}}>
        </Button>
      ),
      headerRight: (
        <Button
          title='Summary'
          size={25}
          buttonStyle={{backgroundColor: 'rgba(0,0,0,0)'}}
          onPress={() => params.summary()}
        />
      ),
      headerTitle: 'HappyTrack'
    }
  }

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

  summary() {
    console.log("this should be working");
    this.props.navigation.navigate('SummaryScreen');
  }

  componentDidMount() {
    this.props.navigation.setParams({ summary: this.summary.bind(this) })
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
        source={{uri: getCustomVizUrl()}}
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
