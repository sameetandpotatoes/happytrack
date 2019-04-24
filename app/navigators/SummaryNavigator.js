import { createStackNavigator } from 'react-navigation';
import SummaryScreen from '../screens/SummaryScreen';
import CustomVisualizationScreen from '../screens/CustomVisualizationScreen';
import defaultNavOptions from './CommonOptions';
  
const SummaryNavigator = createStackNavigator(
    {
        SummaryScreen: SummaryScreen,
        CustomVisualizationScreen: CustomVisualizationScreen
    },
    defaultNavOptions
);

export default SummaryNavigator;