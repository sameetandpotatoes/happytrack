import React from 'react';
import { ThemeProvider, colors, Image, Overlay, SocialIcon, Text } from 'react-native-elements';
import { ActivityIndicator, ImageBackground, Platform, StyleSheet, ScrollView, View } from 'react-native';

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

    this.loginWithTwitter = this.loginWithTwitter.bind(this)
    this.loginWithFacebook = this.loginWithFacebook.bind(this)
  }

  loginWithFacebook() {

  }

  loginWithTwitter() {

  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <View style={styles.container}>
          <ImageBackground source={require('./assets/home.jpg')} style={{width: '100%', height: '100%'}}>
          </ImageBackground>

          <Overlay
            isVisible={true}
            windowBackgroundColor="rgba(255, 255, 255, .4)"
            width="75%"
            height="auto">
              <View>
                <Text h4>Welcome to HappyTrack!</Text>
                <Text>Track daily social interactions with friends, co-workers, etc. by name as well as an interaction "rating"</Text>
                <Text>Get weekly interaction summaries with recommended actionable items on how to improve quality of interactions</Text>

                <SocialIcon
                  title='Sign In With Facebook'
                  button
                  onPress={}
                  type='facebook'
                />
                <SocialIcon
                  title='Sign In With Twitter'
                  button
                  onPress={}
                  type='twitter'
                />
              </View>
          </Overlay>
        </View>
      </ThemeProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
