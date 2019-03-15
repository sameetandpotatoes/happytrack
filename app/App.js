import React from 'react';
import Emoji from 'react-native-emoji';
import { ThemeProvider, Button, ButtonGroup, colors, Divider, Input, Text } from 'react-native-elements';
import { Platform, StyleSheet, View } from 'react-native';
import { emojiButtons, timeOfDay, socialContexts, interactionMediums } from './config/constants'

const RobText = props => <Text style={styles.text} {...props} />

const theme = {
  colors: {
    ...Platform.select({
      default: colors.platform.android,
      ios: colors.platform.ios,
    }),
  },
};

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      selEmoji: 0,
      selTimeOfDay: 0, // TODO set time of day based on current time?
      selContext: 0,
      selMedium: 0
    }
    this.updateEmojiIndex = this.updateEmojiIndex.bind(this)
    this.updateTimeOfDayIndex = this.updateTimeOfDayIndex.bind(this)
    this.updateContextIndex = this.updateContextIndex.bind(this)
    this.updateMediumIndex = this.updateMediumIndex.bind(this)
  }

  updateEmojiIndex(selEmoji) {
    this.setState({selEmoji})
  }

  updateTimeOfDayIndex(selTimeOfDay) {
    this.setState({selTimeOfDay})
  }

  updateContextIndex(selContext) {
    this.setState({selContext})
  }

  updateMediumIndex(selMedium) {
    this.setState({selMedium})
  }

  render() {
    const { selEmoji, selTimeOfDay, selContext, selMedium } = this.state

    return (
      <ThemeProvider theme={theme}>
        <View style={styles.container}>
          <RobText h4>New Interaction</RobText>

          <RobText>Who did you interact with?</RobText>
          <Input placeholder='John Smith' />

          <RobText>How did the interaction make you feel?</RobText>
          <ButtonGroup
            onPress={this.updateEmojiIndex}
            selectedIndex={selEmoji}
            buttons={emojiButtons}
            containerStyle={{height: 65}} />

          <RobText>Time Of Day</RobText>
          <ButtonGroup
            onPress={this.updateTimeOfDayIndex}
            selectedIndex={selTimeOfDay}
            buttons={timeOfDay} />

          <RobText>Social Context</RobText>
          <ButtonGroup
            onPress={this.updateContextIndex}
            selectedIndex={selContext}
            buttons={socialContexts} />

          <RobText>Time Of Day</RobText>
          <ButtonGroup
            onPress={this.updateMediumIndex}
            selectedIndex={selMedium}
            buttons={interactionMediums} />

          <Button
            title="Save Interaction"
            type="outline"
          />
        </View>
      </ThemeProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: '5%'
  },
  text: {
    fontFamily: 'sans-serif-light',
    fontSize: 18,
    marginTop: 5,
    marginBottom: 5
  }
});
