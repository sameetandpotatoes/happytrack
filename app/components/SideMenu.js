/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import PropTypes from 'prop-types';
import React, {Component} from 'react';
import { Button, Text } from 'react-native-elements';
import { GraphRequest, GraphRequestManager, LoginManager } from 'react-native-fbsdk';
import {ScrollView, StyleSheet, View} from 'react-native';

class SideMenu extends Component {
  constructor() {
    super()

    this.state = {
      oauth: {
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
            <View style={styles.navSectionStyle}>
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
        paddingTop: 20,
        flex: 1
    },
    navItemStyle: {
        padding: 10
    },
    navSectionStyle: {
        backgroundColor: 'lightgrey'
    },
    sectionHeadingStyle: {
        paddingVertical: 10,
        paddingHorizontal: 5
    },
    footerContainer: {
        padding: 20,
        backgroundColor: 'lightgrey'
    }
});

export default SideMenu;