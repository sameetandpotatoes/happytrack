import React from 'react';
import { Button, ButtonGroup, Text } from 'react-native-elements';
import { ActivityIndicator, InteractionManager, StyleSheet, ScrollView, TextInput, View } from 'react-native';
import TextField from '../components/TextField'
import { emojiButtons, timeOfDays, socialContexts, interactionMedium, socialContents } from '../config/constants'
import { postFriend, postInteraction } from '../utils/api';

const RobText = props => <Text style={styles.text} {...props} />

export default class NewInteractionScreen extends React.Component {
  static navigationOptions = {
    title: 'New Interaction'
  };

  constructor() {
    super()
    this.state = {
      name: '',
      selEmoji: -1,
      selTimeOfDay: -1, // TODO set time of day based on current time?
      selContext: -1,
      selMedium: -1,
      selContent: -1,
      nameError: null,
      emojiError: null,
      description: null
    }
    this.updateName = this.updateName.bind(this)
    this.updateEmojiIndex = this.updateEmojiIndex.bind(this)
    this.handlePostInteraction = this.handlePostInteraction.bind(this)
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        isReady: true
      })
    });
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

  // handleInputChange(event = {}) {
  //   const value = event.target && event.target.value;
  
  //   this.setState({description: value});
  // }

  handlePostInteraction(e) {
    const { name, selEmoji, selTimeOfDay, selContext, selMedium, selContent, description } = this.state

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

    // Get shorthand version of emoji name
    let emoji = emojiButtons[selEmoji].short;
    let timeOfDay = (selTimeOfDay == -1) ? "Not Applicable" : timeOfDays[selTimeOfDay];
    let context = (selContext == -1) ? "Not Applicable" : socialContexts[selContext];
    let medium = (selMedium == -1) ? "Not Applicable" : interactionMedium[selMedium];
    let content = (selContent == -1) ? "Not Applicable" : socialContents[selContent];

    // Get or create friend
    postFriend(name, function(friend) {
      postInteraction({
        loggee_id: friend["data"]["friend"][1], // Get the loggee id
        time: timeOfDay,
        social: context,
        medium: medium,
        content: content,
        reaction: emoji,
        description: description || ""
      }, function(response) {
        this.props.navigation.navigate('InteractionScreen');
      }.bind(this));
    }.bind(this));
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
    if (!this.state.isReady){
      return <ActivityIndicator />
    }

    const { selEmoji, selTimeOfDay, selContext, selMedium, selContent } = this.state

    return (
      <View style={styles.container}>
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
            onPress={(selTimeOfDay) => this.setState({selTimeOfDay})}
            selectedIndex={selTimeOfDay}
            buttons={timeOfDays} />

          <RobText>Social Context</RobText>
          <ButtonGroup
            onPress={(selContext) => this.setState({selContext})}
            selectedIndex={selContext}
            buttons={socialContexts} />

          <RobText>Interaction Medium</RobText>
          <ButtonGroup
            onPress={(selMedium) => this.setState({selMedium})}
            selectedIndex={selMedium}
            buttons={interactionMedium} />

          <RobText>Social Content</RobText>
          <ButtonGroup
            onPress={(selContent) => this.setState({selContent})}
            selectedIndex={selContent}
            buttons={socialContents} />

          <RobText>Any Last Thoughts?</RobText>
          <TextInput
            style={{height: 100, borderColor: 'gray', borderWidth: 1}}
            name="description"
            onChangeText={(description) => this.setState({description})}
            value={this.state.descripton}
          />

          <Button
            buttonStyle={styles.button}
            title="Save Interaction"
            type="solid"
            onPress={this.handlePostInteraction}
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
