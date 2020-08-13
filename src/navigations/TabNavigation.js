import React from "react";
import { createAppContainer,  } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import LandingScreen from "../screens/landing/LandingScreen";
import FeaturedScreen from "../screens/featured/FeaturedScreen";
import GlamsScreen from "../screens/glams/GlamsScreen";

const TabNavigator = createStackNavigator({
    Featured:  {
        screen: FeaturedScreen,
        navigationOptions: { headerShown: false }
    },
    All:  {
        screen: GlamsScreen,
        navigationOptions: { headerShown: false }
    },
});


export default createAppContainer(TabNavigator);