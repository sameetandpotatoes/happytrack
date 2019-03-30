import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './screens/HomeScreen';
import SideMenu from './components/SideMenu';

import InteractionNavigator from './navigators/InteractionNavigator';
import SummaryNavigator from './navigators/SummaryNavigator';

import {createSwitchNavigator, createDrawerNavigator, createBottomTabNavigator, createStackNavigator, createAppContainer} from 'react-navigation';

// const defaultNavOptions = {
//   defaultNavigationOptions: {
//     gesturesEnabled: false,
//     headerTintColor: '#fff',
//     headerStyle: {
//       backgroundColor: '#1E90FF',
//     },
//     headerTitleStyle: {
//       fontWeight: 'bold',
//     },
//   },
//   transitionConfig: () => ({
//     transitionSpec: {
//       duration: 300,
//       easing: Easing.out(Easing.poly(4)),
//       timing: Animated.timing,
//     },
//     screenInterpolator: sceneProps => {
//       const { layout, position, scene } = sceneProps;
//       const { index } = scene;

//       const height = layout.initHeight;
//       const translateY = position.interpolate({
//         inputRange: [index - 1, index, index + 1],
//         outputRange: [height, 0, 0],
//       });

//       const opacity = position.interpolate({
//         inputRange: [index - 1, index - 0.99, index],
//         outputRange: [0, 1, 1],
//       });

//       return { opacity, transform: [{ translateY }] };
//     },
//   }),
// };

const DrawerStackInteraction = createDrawerNavigator({
    InteractionScreen: InteractionNavigator,
    SummaryScreen: SummaryNavigator
  }, {
    initialRouteName: 'InteractionScreen',
    contentComponent: SideMenu,
  }
);

const DrawerStackSummary = createDrawerNavigator({
  InteractionScreen: InteractionNavigator,
  SummaryScreen: SummaryNavigator
}, {
  initialRouteName: 'SummaryScreen',
  contentComponent: SideMenu
}
);

const AppStack = createBottomTabNavigator(
  {
    Interactions: DrawerStackInteraction,
    Summary: DrawerStackSummary
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
