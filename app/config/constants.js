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
  'Morning': ["city_sunrise", 'Morning'],
  'Afternoon': ["city_sunset", 'Afternoon'],
  'Evening': ["bridge_at_night", 'Evening'],
  'Not Applicable': ["briefcase", 'Not Applicable']
}

const recTypes = {
  'PO': 'Positive',
  'NE': 'Negative',
  'AV': 'Avoidance',
  'GE': 'Generic',
}

const socialContexts = [ 'Academic', 'Social', 'Work' ]
const socialContextsEmojis = {
  'Academic': ["blue_book", 'Academic'],
  'Social': ["left_speech_bubble", 'Social'],
  'Work': ["briefcase", 'Work'],
  'Not Applicable': ["briefcase", 'Not Applicable'],
  'Other': ["briefcase", 'Other']
}

const socialContents = [ 'Small Talk', 'One Personal', 'Both Personal' ];

const interactionMedium = [ 'In Person', 'Over The Phone', 'Online' ]
const interactionMediumEmojis = {
  'In Person': ["handshake", 'In Person'],
  'Over The Phone': ["phone", 'Over The Phone'],
  'Online': ["computer", 'Online'],
  'Not Applicable': ['briefcase', 'Not Applicable']
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
  socialContents,
  feedbacks,
  recTypes
}
