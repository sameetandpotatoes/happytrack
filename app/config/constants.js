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
  'Morning': "city_sunrise",
  'Afternoon': "city_sunset",
  'Evening': "bridge_at_night",
}

const socialContexts = [ 'Academic', 'Social', 'Work' ]
const socialContextsEmojis = {
  'Academic': "blue_book",
  'Social': "left_speech_bubble",
  'Work': "briefcase",
}


const interactionMedium = [ 'In Person', 'Phone', 'Online' ]
const interactionMediumEmojis = {
  'In Person': "handshake",
  'Phone': "phone",
  'Online': "computer",
}

export {
  emojiButtons,
  timeOfDays,
  timeOfDayEmojis,
  socialContexts,
  socialContextsEmojis,
  interactionMedium,
  interactionMediumEmojis
}
