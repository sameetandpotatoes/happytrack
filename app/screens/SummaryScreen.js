import React from 'react';
import Emoji from 'react-native-emoji';
import { ThemeProvider, colors, Avatar, Button, Divider, Header, Icon, ListItem, Text } from 'react-native-elements';
import { Platform, StyleSheet, ScrollView, View } from 'react-native';
import { LoginManager } from 'react-native-fbsdk';
import BarChartVerticalWithLabels from '../components/BarChartVerticalWithLabels';
import PieChartWithCenteredLabels from '../components/PieChartWithCenteredLabels';

export default class SummaryScreen extends React.Component {
  static navigationOptions = {
    headerTitle: 'HappyTrack',
  };
  constructor() {
    super()

    this.state = {
      summaries: []
    }

    this.handleLogout = this.handleLogout.bind(this)
  }

  componentDidMount() {
    // TODO what fake data looks like, should be sorted by timestamp in descending order probably, and then labeled by week in the app?
    this.setState({
      summaries: [
        {
          week: 'Week of 03/18 - 03/24',

        },
        {
          week: 'Week of 03/11 - 03/16',

        },
      ]
    })
  }

  handleLogout() {
    LoginManager.logOut()
    const { navigate } = this.props.navigation
    navigate('HomeScreen')
  }

  render() {
    const WeeklySummaries = (
      this.state.summaries.map((value, index) => {
        const { week } = value;
        return (
          <View key={index} style={styles.summaryView}>
            <Text h3>{week}</Text>
            <BarChartVerticalWithLabels />
            <PieChartWithCenteredLabels />
            <Divider />
          </View>
        )
      })
    );

    return (
      <View style={styles.container}>
        {/* <Header
          containerStyle={{marginTop: Platform.OS === 'ios' ? 0 : - 30}}
          leftComponent={{text: 'HappyTrack', style: {fontSize: 24, width: 300, color: '#FFFFFF'}}}
          centerComponent={null}
          rightComponent={
          <View>
            <Icon name="sign-out" type="font-awesome" color="#fff" onPress={this.handleLogout} />
          </View>
          }
        /> */}
        <ScrollView style={styles.scrollView}>
          {WeeklySummaries}
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
