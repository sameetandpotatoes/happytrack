import React from 'react';
import Emoji from 'react-native-emoji';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemeProvider, Avatar, Button, ButtonGroup, colors, Divider, Input, Text } from 'react-native-elements';
import { Platform, StyleSheet, ScrollView, View } from 'react-native';
import { emojiButtons, timeOfDay, socialContexts, interactionMediums } from '../config/constants'

const RobText = props => <Text style={styles.text} {...props} />

const theme = {
  colors: {
    ...Platform.select({
      default: colors.platform.android,
      ios: colors.platform.ios,
    }),
  },
};

export default class NewInteraction extends React.Component {
  constructor() {
    super()
    this.state = {
      name: '',
      selEmoji: -1,
      selTimeOfDay: -1, // TODO set time of day based on current time?
      selContext: -1,
      selMedium: -1
    }
    this.updateEmojiIndex = this.updateEmojiIndex.bind(this)
    this.updateTimeOfDayIndex = this.updateTimeOfDayIndex.bind(this)
    this.updateContextIndex = this.updateContextIndex.bind(this)
    this.updateMediumIndex = this.updateMediumIndex.bind(this)
    this.postInteraction = this.postInteraction.bind(this)
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

  postInteraction(e) {
    const { name, selEmoji, selTimeOfDay, selContext, selMedium } = this.state

    // Required fields
    if (selEmoji == -1 || name == '') {
      // TODO handle required field issue
    }

    let emoji = emojiButtons[selEmoji].text;
    let timeOfDay = (selTimeOfDay == -1) ? null : timeOfDay[selTimeOfDay];
    let context = (selContext == -1) ? null : socialContexts[selContext];
    let medium = (selMedium == -1) ? null : interactionMediums[selMedium];

    // TODO submit post request to backend with all info
  }

  render() {
    const { selEmoji, selTimeOfDay, selContext, selMedium } = this.state

    return (
      <ThemeProvider theme={theme}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <RobText h3>New Interaction</RobText>

            <RobText h4>Required Fields</RobText>

            <RobText>Who did you interact with?*</RobText>
            <Input
              placeholder='John Smith'
              errorStyle={{ color: 'red' }}
              errorMessage='* = Required field'
              leftIcon={
                <Icon
                  name='user'
                  size={24}
                  color='black'
                />
              }
              leftIconContainerStyle={{
                marginRight: 10
              }}
            />

            <RobText>How did the interaction make you feel?</RobText>
            <ButtonGroup
              onPress={this.updateEmojiIndex}
              selectedIndex={selEmoji}
              buttons={emojiButtons}
              containerStyle={{height: 65}} />

            <RobText h4>Optional Fields</RobText>

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

            <RobText>Interaction Medium</RobText>
            <ButtonGroup
              onPress={this.updateMediumIndex}
              selectedIndex={selMedium}
              buttons={interactionMediums} />

            <Button
              buttonStyle={styles.button}
              title="Save Interaction"
              type="solid"
              onPress={this.postInteraction}
            />
          </ScrollView>
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
    marginTop: 20,
  },
  scrollView: {
    padding: '5%',
  },
  text: {
    fontFamily: 'sans-serif-light',
    fontSize: 19,
    marginTop: 8,
    marginBottom: 8
  },
  button: {
    marginTop: 25,
    marginBottom: 25
  }
});
