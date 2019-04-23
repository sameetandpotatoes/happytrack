## HappyTrack app

This is a react native app (not Expo).

## General Setup

```
cp config/env.js.template config/env.js
npm install -g npm
npm install -g react-native-cli
npm install -g yarn
yarn
react-native start --reset-cache
react-native link
# Install the FB sdk locally (different setup instructions for iOS and Android)
react-native run-android
react-native run-ios
```

Note: Android has trouble making non-https requests, so make sure you use a tool like `ngrok` to make the localhost server an SSL server.

The app also connects to a FB developer app.