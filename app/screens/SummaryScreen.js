import React from 'react';
import { Button, Divider, Icon, Text } from 'react-native-elements';
import { StyleSheet, ScrollView, View } from 'react-native';
import BarChartVerticalWithLabels from '../components/BarChartVerticalWithLabels';
import PieChartWithCenteredLabels from '../components/PieChartWithCenteredLabels';

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
        onPress={() => navigation.openDrawer()} 
        style={{position: 'absolute', left: 20}}>
      </Button>
    ),
    headerTitle: 'HappyTrack'
  });

  constructor() {
    super()

    this.state = {
      summaries: []
    }
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
