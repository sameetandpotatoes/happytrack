import { createStackNavigator } from 'react-navigation';  
import InteractionScreen from '../screens/InteractionScreen';
import NewInteractionScreen from '../screens/NewInteractionScreen';
import defaultNavOptions from './CommonOptions';

const InteractionNavigator = createStackNavigator(
    {
        InteractionScreen: InteractionScreen,
        NewInteractionScreen: NewInteractionScreen
    },
    defaultNavOptions
);
export default InteractionNavigator;