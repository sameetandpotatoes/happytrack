import React from 'react';
import { Easing, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './components/HomeScreen';
import InteractionScreen from './components/InteractionScreen';
import NewInteractionScreen from './components/NewInteractionScreen';
import SummaryScreen from './components/SummaryScreen';
import {createSwitchNavigator, createBottomTabNavigator, createStackNavigator, createAppContainer} from 'react-navigation';

const InteractionStack = createStackNavigator(
  {
    InteractionScreen: InteractionScreen,
    NewInteractionScreen: NewInteractionScreen
  },
  {
    headerMode: 'none',
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
      },
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps;
        const { index } = scene;

        const height = layout.initHeight;
        const translateY = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [height, 0, 0],
        });

        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1],
        });

        return { opacity, transform: [{ translateY }] };
      },
    }),
  }
);

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
        let IconComponent = Ionicons;
        let iconName;
        if (routeName === 'Interactions') {
          iconName = `ios-information-circle${focused ? '' : '-outline'}`;
          // Sometimes we want to add badges to some icons.
          // You can check the implementation below.
        } else if (routeName === 'Summary') {
          iconName = `ios-options`;
        }

        // You can return any component that you like here!
        return <IconComponent name={iconName} size={30} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
      labelStyle: {
        fontSize: 10
      },
    },
  }
);


// const AuthStack = createStackNavigator({ SignIn: SignInScreen });

export default createAppContainer(createSwitchNavigator(
  {
    HomeScreen: HomeScreen,
    AppScreen: AppStack,
  },
  {
    initialRouteName: 'HomeScreen',
    headerMode: 'screen'
  }
));
