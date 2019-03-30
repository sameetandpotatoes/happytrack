import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import InteractionNavigator from './navigators/InteractionNavigator';
import SummaryNavigator from './navigators/SummaryNavigator';
import HomeScreen from './screens/HomeScreen';
import SideMenu from './components/SideMenu';

import {createSwitchNavigator, createDrawerNavigator, createBottomTabNavigator, createAppContainer} from 'react-navigation';

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
        } else if (routeName === 'Summary') {
          iconName = `ios-options`;
        }
        return <IconComponent name={iconName} size={30} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
      labelStyle: {
        fontSize: 11
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
