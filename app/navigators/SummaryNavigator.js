import { createStackNavigator } from 'react-navigation';
import SummaryScreen from '../screens/SummaryScreen';
import defaultNavOptions from './CommonOptions';
  
const SummaryNavigator = createStackNavigator(
    {
        SummaryScreen: SummaryScreen
    },
    defaultNavOptions
);

export default SummaryNavigator;