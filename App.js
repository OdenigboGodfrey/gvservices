/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';

import SwitchNavigator from "./src/navigations/SwitchNavigator";
import {Root} from 'native-base';
import {AppProvider} from './AppProvider';
import LoginScreen from './src/screens/login/LoginScreen';
import GlamProfileScreen from './src/screens/glam_profile/GlamProfileScreen';
import InterestScreen from './src/screens/gig_interest/InterestScreen';
import TestPage, {Renderer} from './testPage';
import TabNavigation from './src/navigations/TabNavigation';
import NewGig from './src/screens/new_gig/NewGigScreen';
import EditProfile from './src/screens/edit_profile/EditProfileScreen';
import ForgotPasswordScreen from './src/screens/forgot_password/ForgotPasswordScreen';
import OffersScreen from './src/screens/offer/OffersScreen';
import DisputeScreen from './src/screens/dispute/DisputeScreen';
import PostSignupLocation from './src/screens/post_signup/PostSignupLocation';


// const App: () => React$Node = (props) => {
//   console.log(JSON.stringify(props))
//   return (
//     <Root>
//       <SwitchNavigator navigation={props.navigation} />
//     </Root>
//   );
// };

export default class App extends React.Component {
  constructor() {
    super();
  }

  render() {
    console.log('props', JSON.stringify(this.props));
    return (
      <AppProvider>
        <Root>
          <SwitchNavigator navigation={this.props.navigation} />
          {/* <NewGig /> */}
          {/* <Renderer/> */}
          {/* <EditProfile /> */}
          {/* <PostSignupLocation navigation={this.props.navigation} /> */}
          {/* <Renderer /> */}
        </Root>
      </AppProvider>
    );
  }
};
