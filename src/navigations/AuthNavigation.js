import React from "react";
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from "react-navigation-stack";
import LoginScreen from "./../screens/login/LoginScreen";
import SignupScreen from "./../screens/signup/SignupScreen";
import { View, Text } from 'react-native';
import InitResetScreen from '../screens/init_password_reset/InitResetScreen';
import ValidateResetScreen from '../screens/validate_reset/ValidateResetScreen';
import ResetPasswordScreen from '../screens/reset_password/ResetPasswordScreen';

const AuthNavigator = createStackNavigator(
    {
        Login: {
            screen: LoginScreen,
            navigationOptions: { headerShown: false }
        },
    
    
        Signup: {
            screen: SignupScreen,
            navigationOptions: { headerShown: false }
        },
        InitReset: {
            screen: InitResetScreen,
            navigationOptions: {headerShown: false},
          },
        Validate: {
        screen: ValidateResetScreen,
        navigationOptions: {headerShown: false},
        },
        ResetPassword: {
        screen: ResetPasswordScreen,
        navigationOptions: {headerShown: false},
    },
        
    },
    {
        initialRouteName: 'Login'
    }
);

export default createAppContainer(AuthNavigator);

  
//   const AuthNavigator = createStackNavigator({
//     Home: {
//       screen: LoginScreen,
//     },
//   });
  
//   export default createAppContainer(AuthNavigator);