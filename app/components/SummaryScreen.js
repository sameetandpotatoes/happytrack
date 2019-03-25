import React from 'react';
import Emoji from 'react-native-emoji';
import { ThemeProvider, colors, Avatar, Button, Header, Icon, ListItem, Text } from 'react-native-elements';
import { Platform, StyleSheet, ScrollView, View } from 'react-native';
import { LoginManager } from 'react-native-fbsdk';
import { timeOfDayEmojis, socialContextsEmojis, interactionMediumEmojis } from '../config/constants';
import BarChartVerticalWithLabels from './BarChartVerticalWithLabels';
import PieChartWithCenteredLabels from './PieChartWithCenteredLabels';

export default class SummaryScreen extends React.Component {
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
          <View key={index}>
            <Text h3>{week}</Text>
            <BarChartVerticalWithLabels />
            <PieChartWithCenteredLabels />
          </View>
        )
      })
    );

    return (
      <View style={styles.container}>
        <Header
          containerStyle={{marginTop: Platform.OS === 'ios' ? 0 : - 30}}
          leftComponent={{text: 'HappyTrack', style: {fontSize: 24, width: 300, color: '#FFFFFF'}}}
          centerComponent={null}
          rightComponent={
          <View>
            <Icon name="sign-out" type="font-awesome" color="#fff" onPress={this.handleLogout} />
          </View>
          }
        />
        <ScrollView>
          {WeeklySummaries}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
