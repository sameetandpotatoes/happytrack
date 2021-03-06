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

    this.loginWithFacebook = this.loginWithFacebook.bind(this)
    this.checkForAccessToken = this.checkForAccessToken.bind(this)
  }

  loginWithFacebook() {
    LoginManager.logInWithReadPermissions(['email'])
      .then((result) => this.checkForAccessToken())  
      .catch(error => {
        console.log(error);
      });
  }

  checkForAccessToken() {
    AccessToken.getCurrentAccessToken()
      .then((data) => {
        console.log(data);
        if (data && data.accessToken) {
          // const { navigate } = 
          loginBackend(data.accessToken, function(response) {
            this.setState({isLoading: false})
            this.props.navigation.navigate('AppScreen')
          }.bind(this));
        } else {
          this.setState({isLoading: false})
        }
    })
      .catch(error => {
        console.error(error)
        this.setState({isLoading: false})
      });
  }

  componentDidMount() {
    this.checkForAccessToken();
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
                    onPress={this.loginWithFacebook}
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
