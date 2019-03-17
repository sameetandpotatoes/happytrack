import React from 'react';
import { ThemeProvider, colors, Image, Overlay, SocialIcon, Text } from 'react-native-elements';
import { ActivityIndicator, ImageBackground, Platform, StyleSheet, ScrollView, View } from 'react-native';
import {NavigationEvents} from 'react-navigation';

const theme = {
  colors: {
    ...Platform.select({
      default: colors.platform.android,
      ios: colors.platform.ios,
    }),
  },
};

export default class HomeScreen extends React.Component {
  constructor() {
    super()

    this.loginWithTwitter = this.loginWithTwitter.bind(this)
    this.loginWithFacebook = this.loginWithFacebook.bind(this)
  }

  loginWithFacebook() {
    const {navigate} = this.props.navigation;
    navigate('App')
  }

  loginWithTwitter() {
    const {navigate} = this.props.navigation;
    navigate('App')
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <View style={styles.container}>
          <ImageBackground source={require('../assets/home.jpg')} style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>
            <View style={styles.overlayedContent}>
                <View>
                  <Text h4>Welcome to HappyTrack!</Text>
                  <Text>Track daily social interactions with friends, co-workers, etc. by name as well as an interaction "rating"</Text>
                  <Text>Get weekly interaction summaries with recommended actionable items on how to improve quality of interactions</Text>

                  <SocialIcon
                    title='Sign In With Facebook'
                    button
                    onPress={this.loginWithFacebook}
                    type='facebook'
                  />
                  <SocialIcon
                    title='Sign In With Twitter'
                    button
                    onPress={this.loginWithTwitter}
                    type='twitter'
                  />
                </View>
            </View>
          </ImageBackground>
        </View>
      </ThemeProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlayedContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    height: '40%',
    padding: '5%',
    backgroundColor: 'rgba(255, 255, 255, .8)',
  }
});
