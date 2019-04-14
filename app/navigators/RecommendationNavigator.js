import { createStackNavigator } from 'react-navigation';
import RecommendationScreen from '../screens/RecommendationScreen';
import defaultNavOptions from './CommonOptions';
  
const RecommendationNavigator = createStackNavigator(
    {
        RecommendationScreen: RecommendationScreen
    },
    defaultNavOptions
);

export default RecommendationNavigator;