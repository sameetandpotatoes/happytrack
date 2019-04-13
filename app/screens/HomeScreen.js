import React from 'react';
import { ThemeProvider, colors, SocialIcon, Text } from 'react-native-elements';
import { ActivityIndicator, ImageBackground, Platform, StyleSheet, View } from 'react-native';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { loginBackend } from '../utils/api';

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

    this.state = {
      isLoading: true
    }

    this.loginWithTwitter = this.loginWithTwitter.bind(this)
    this.loginWithFacebook = this.loginWithFacebook.bind(this)
    this.checkForAccessToken = this.checkForAccessToken.bind(this)
  }

  loginWithFacebook() {
    const checkForAccessToken = this.checkForAccessToken;
    LoginManager.logInWithReadPermissions(['email']).then(
      function(result) {
        if (!result.isCancelled) {
          checkForAccessToken();
        }
      },
      function(error) {
        alert('Login failed with error: ' + error);
      }
    ).catch(error => {
      console.log(error);
    });
  }

  checkForAccessToken() {
    AccessToken.getCurrentAccessToken()
      .then((data) => {
        this.setState({isLoading: false})
        if (data && data.accessToken) {
          const { navigate } = this.props.navigation
          loginBackend(data.accessToken, function(response) {
            navigate('AppScreen')
          });
        }
      })
      .catch(error => {
        console.log(error)
        this.setState({isLoading: false})
      });
  }

  componentWillMount() {
    this.checkForAccessToken();
  }

  loginWithTwitter() {
    const {navigate} = this.props.navigation
    navigate('AppScreen')
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <View style={styles.container}>
          <ImageBackground source={require('../assets/home.jpg')} style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>
            { !this.state.isLoading &&
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
            }
            { this.state.isLoading &&
              <ActivityIndicator style={{ height: 80 }} size="large" color="#d3d3d3" />
            }
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
