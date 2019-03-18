import React from 'react';
import HomeScreen from './components/HomeScreen';
import InteractionList from './components/InteractionList';
import NewInteraction from './components/NewInteraction';
import {createSwitchNavigator, createStackNavigator, createAppContainer} from 'react-navigation';

const AppStack = createStackNavigator({ InteractionList: InteractionList, NewInteraction: NewInteraction });
// const AuthStack = createStackNavigator({ SignIn: SignInScreen });

export default createAppContainer(createSwitchNavigator(
  {
    HomeScreen: HomeScreen,
    App: AppStack,
  },
  {
    initialRouteName: 'HomeScreen',
    headerMode: 'screen'
  }
));
