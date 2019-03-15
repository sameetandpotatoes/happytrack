import React from 'react';
import Emoji from 'react-native-emoji';

const emojiFont = 35;
const grinning = () => <Emoji name="grinning" style={{fontSize: emojiFont}} />
const blush = () => <Emoji name="blush" style={{fontSize: emojiFont}} />
const neutral_face = () => <Emoji name="neutral_face" style={{fontSize: emojiFont}} />
const sweat = () => <Emoji name="sweat" style={{fontSize: emojiFont}} />
const confounded = () => <Emoji name="confounded" style={{fontSize: emojiFont}} />
const worried = () => <Emoji name="worried" style={{fontSize: emojiFont}} />
const weary = () => <Emoji name="weary" style={{fontSize: emojiFont}} />
const rage = () => <Emoji name="rage" style={{fontSize: emojiFont}} />
const sleeping = () => <Emoji name="sleeping" style={{fontSize: emojiFont}} />

const emojiButtons = [
  { element: grinning },
  { element: blush },
  { element: neutral_face },
  { element: sweat },
  { element: confounded },
  { element: worried },
  { element: weary },
  { element: rage },
  { element: sleeping },
]

const timeOfDay = [ 'Morning', 'Afternoon', 'Evening' ]
const socialContexts = [ 'academic', 'social', 'volunteer', 'work' ]
const interactionMediums = [ 'in person', 'phone', 'online' ]

export {
  emojiButtons,
  timeOfDay,
  socialContexts,
  interactionMediums
}
