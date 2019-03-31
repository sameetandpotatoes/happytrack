import PropTypes from 'prop-types';
import React, {Component} from 'react';
import { Avatar, Button, Text } from 'react-native-elements';
import { GraphRequest, GraphRequestManager, LoginManager } from 'react-native-fbsdk';
import {ScrollView, StyleSheet, View} from 'react-native';

class SideMenu extends Component {
  constructor() {
    super()

    this.state = {
      oauth: {
        id: 0,
        name: '',
        email: '',
        profile_pic_url: ''
      }
    }

    this._responseInfoCallback = this._responseInfoCallback.bind(this)
  }

  _responseInfoCallback(error, result) {
    if (error) {
      alert('Error fetching data: ' + error.toString())
    } else {
      this.setState({
        oauth: {
          id: result.id,
          name: result.name,
          email: result.email
        }
      })
    }
  }

  handleLogout() {
    LoginManager.logOut()
    const { navigate } = this.props.navigation
    navigate('HomeScreen')
  }

  componentDidMount() {
    const infoRequest = new GraphRequest(
      '/me?fields=id,name,email',
      null,
      this._responseInfoCallback
    );
          
    new GraphRequestManager().addRequest(infoRequest).start()
  }

  render () {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View>
            <Text style={styles.sectionHeadingStyle}>
              {this.state.oauth.name}
            </Text>
            <Avatar
              large
              source={{uri: `https://graph.facebook.com/${this.state.oauth.id}/picture?type=large&width=720&height=720`}}
              activeOpacity={0.8}
              style={{width: 200, height: 200}}
            />
            <View>
              <Text>Logged in as:</Text>
              <Text style={styles.navItemStyle}>
                {this.state.oauth.email}
              </Text>
            </View>
          </View>
        </ScrollView>
        <Button 
          style={styles.footerContainer} 
          onPress={this.handleLogout.bind(this)}
          title="Log out">
        </Button>
      </View>
    );
  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object
};

const styles = StyleSheet.create({
    container: {
      marginTop: 120,
      padding: 10,
      flex: 1
    },
    navItemStyle: {
      fontSize: 16
    },
    sectionHeadingStyle: {
      paddingVertical: 10,
      paddingHorizontal: 5,
      fontSize: 24
    },
    footerContainer: {
        padding: 20
    }
});

export default SideMenu;