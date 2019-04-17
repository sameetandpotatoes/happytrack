import React from 'react';
import Emoji from 'react-native-emoji';

const emojiFont = 35;
const grinning = () => <Emoji name="grinning" style={{fontSize: emojiFont}} />
const neutral_face = () => <Emoji name="neutral_face" style={{fontSize: emojiFont}} />
const worried = () => <Emoji name="worried" style={{fontSize: emojiFont}} />
const rage = () => <Emoji name="rage" style={{fontSize: emojiFont}} />
const sleeping = () => <Emoji name="sleeping" style={{fontSize: emojiFont}} />

const emojiButtons = [
  { element: grinning, text: "Happy" },
  { element: neutral_face, text: "Neutral" },
  { element: worried, text: "Sad" },
  { element: rage, text: "Angry" },
  { element: sleeping, text: "Tired" },
]

const timeOfDays = [ 'Morning', 'Afternoon', 'Evening' ]
const timeOfDayEmojis = {
  'MO': ["city_sunrise", 'Morning'],
  'AF': ["city_sunset", 'Afternoon'],
  'EV': ["bridge_at_night", 'Evening'],
  'NA': ["briefcase", 'Not Applicable']
}

const socialContexts = [ 'Academic', 'Social', 'Work' ]
const socialContextsEmojis = {
  'AC': ["blue_book", 'Academic'],
  'SO': ["left_speech_bubble", 'Social'],
  'WO': ["briefcase", 'Work'],
  'NA': ["briefcase", 'Not Applicable'],
  'OC': ["briefcase", 'Other']
}

const socialContents = [ 'Small Talk', 'One Personal', 'Two Personal' ];

const interactionMedium = [ 'In Person', 'Over the Phone', 'Online' ]
const interactionMediumEmojis = {
  'IP': ["handshake", 'In Person'],
  'PH': ["phone", 'Over the Phone'],
  'ON': ["computer", 'Online'],
  'NA': ['briefcase', 'Not Applicable']
}

const feedbacks = {
  'WO': 'Worked',
  'DW': 'Doesn\'t Work',
  'NE': 'Neutral'
};

export {
  emojiButtons,
  timeOfDays,
  timeOfDayEmojis,
  socialContexts,
  socialContextsEmojis,
  interactionMedium,
  interactionMediumEmojis,
  feedbacks
}
