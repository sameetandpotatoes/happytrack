import React from 'react';
import { Button, ButtonGroup, Text } from 'react-native-elements';
import { StyleSheet, ScrollView, TextInput, View } from 'react-native';
import TextField from '../components/TextField'
import { emojiButtons, timeOfDay, socialContexts, interactionMedium } from '../config/constants'

const RobText = props => <Text style={styles.text} {...props} />

export default class NewInteractionScreen extends React.Component {
  static navigationOptions = {
    title: 'HappyTrack'
  };

  constructor() {
    super()
    this.state = {
      name: '',
      selEmoji: -1,
      selTimeOfDay: -1, // TODO set time of day based on current time?
      selContext: -1,
      selMedium: -1,
      nameError: null,
      emojiError: null
    }
    this.updateName = this.updateName.bind(this)
    this.updateEmojiIndex = this.updateEmojiIndex.bind(this)
    this.updateTimeOfDayIndex = this.updateTimeOfDayIndex.bind(this)
    this.updateContextIndex = this.updateContextIndex.bind(this)
    this.updateMediumIndex = this.updateMediumIndex.bind(this)
    this.postInteraction = this.postInteraction.bind(this)
  }

  updateName(name) {
    this.setState({
      name: name,
      nameError: this.validate('name', name)
    })
  }

  updateEmojiIndex(selEmoji) {
    this.setState({
      selEmoji: selEmoji,
      emojiError: this.validate('emoji', selEmoji)
    })
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

    // null if no error
    const emojiError = this.validate('emoji', selEmoji);
    const nameError = this.validate('name', name);

    this.setState({
      nameError: nameError,
      emojiError: emojiError
    })

    // return early if error was found
    if (emojiError || nameError) {
      return
    }

    let emoji = emojiButtons[selEmoji].text;
    let timeOfDay = (selTimeOfDay == -1) ? null : timeOfDay[selTimeOfDay];
    let context = (selContext == -1) ? null : socialContexts[selContext];
    let medium = (selMedium == -1) ? null : interactionMedium[selMedium];

    // TODO submit post request to backend with all info

    // TODO go back to all interaction page
  }

  validate(formKey, formValue) {
    if (formKey === 'name') {
      return formValue === '' ? 'Name must not be empty' : null
    }
    if (formKey == 'emoji') {
      return formValue == -1 ? 'An emoji must be selected' : null
    }
  }

  render() {
    const { selEmoji, selTimeOfDay, selContext, selMedium } = this.state

    return (
      <View style={styles.container}>
        {/*<Header
          containerStyle={{marginTop: Platform.OS === 'ios' ? 0 : - 30}}
          leftComponent={
            <IC name="chevron-left" type="font-awesome" color="#fff" onPress={() => this.props.navigation.goBack()} />
          }
          centerComponent={{ text: 'New Interaction', style: { fontSize: 22, color: '#fff' } }}
        rightComponent={null} />*/}
        <ScrollView contentContainerStyle={styles.scrollView}>
          <RobText h4>Required Fields</RobText>

          <RobText>Who did you interact with?</RobText>
          <TextField
            onChangeText={this.updateName}
            error={this.state.nameError}
          />

          <RobText>How did the interaction make you feel?</RobText>
          <ButtonGroup
            onPress={this.updateEmojiIndex}
            selectedIndex={selEmoji}
            buttons={emojiButtons}
            containerStyle={{height: 65}} />
          {this.state.emojiError && <Text style={styles.error}>{this.state.emojiError}</Text>}

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
            buttons={interactionMedium} />

          <RobText>Any Last Thoughts?</RobText>
          <TextInput
            style={{height: 100, borderColor: 'gray', borderWidth: 1}}
          />

          <Button
            buttonStyle={styles.button}
            title="Save Interaction"
            type="solid"
            onPress={this.postInteraction}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
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
  },
  error: {
    color: 'red'
  }
});
