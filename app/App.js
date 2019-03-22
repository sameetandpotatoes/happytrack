import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './components/HomeScreen';
import InteractionScreen from './components/InteractionScreen';
import NewInteractionScreen from './components/NewInteractionScreen';
import SummaryScreen from './components/SummaryScreen';
import {createSwitchNavigator, createBottomTabNavigator, createStackNavigator, createAppContainer} from 'react-navigation';

const InteractionStack = createStackNavigator({
    InteractionScreen: InteractionScreen,
    NewInteractionScreen: NewInteractionScreen
});

const SummaryStack = createStackNavigator({
  SummaryScreen: SummaryScreen
});

const AppStack = createBottomTabNavigator(
  {
    Interactions: InteractionStack,
    Summary: SummaryStack
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = Ionicons; // can change if we want
        let iconName;
        if (routeName === 'Interactions') {
          iconName = `ios-information-circle${focused ? '' : '-outline'}`;
          // Sometimes we want to add badges to some icons.
          // You can check the implementation below.
        } else if (routeName === 'Summary') {
          iconName = `ios-options`;
        }

        // You can return any component that you like here!
        return <IconComponent name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
      labelStyle: {
        fontSize: 14,
      },
    },
  }
);


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
