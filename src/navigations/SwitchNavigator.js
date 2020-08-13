import { createSwitchNavigator, createAppContainer } from "react-navigation";
import AppNavigator from "./AppNavigation";
import AuthNavigator from "./AuthNavigation";
import LandingScreen from "../screens/landing/LandingScreen";

const SwitchNavigator = createSwitchNavigator({
    Home: {
        screen: AppNavigator,
    },
    Auth: {
        screen: AuthNavigator
    }, 
    Landing: {
      screen:LandingScreen
    } 
  },
  {
      initialRouteName: 'Landing',
  });

  export default createAppContainer(SwitchNavigator);