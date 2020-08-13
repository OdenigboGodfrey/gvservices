import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import TabNavigator from './TabNavigation';
import HomeScreen from '../screens/home/HomeScreen';
import GlamProfileScreen from '../screens/glam_profile/GlamProfileScreen';
import FeaturedScreen from '../screens/featured/FeaturedScreen';
import FilterScreen from '../screens/filter/FilterScreen';
import GlamsScreen from '../screens/glams/GlamsScreen';
import InterestScreen from '../screens/gig_interest/InterestScreen';
import PostSignupGeneral from '../screens/post_signup/PostSignupGeneral';
import PostSignupLocation from '../screens/post_signup/PostSignupLocation';
import PostSignupUsername from '../screens/post_signup/PostSignupUsername';
import PostSignupAvatar from '../screens/post_signup/PostSignupAvatar';
import ForgotPasswordScreen from '../screens/forgot_password/ForgotPasswordScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import EditProfileScreen from '../screens/edit_profile/EditProfileScreen';
import TrueImageScreen from '../screens/true_images/TrueImageScreen';
import BodyVideoScreen from '../screens/body_video/BodyVideoScreen';
import AddServiceScreen from '../screens/add_service/AddServiceScreen';
import OffersScreen from '../screens/offer/OffersScreen';
import OfferDetailScreen from '../screens/offer_detail/OfferDetailScreen';
import GigsScreen from '../screens/gigs/GigsScreen';
import GigDetailScreen from '../screens/gig_detail/GigDetailScreen';
import ListUsersScreen from '../screens/list_users/ListUsersScreen';
import NewGig from '../screens/new_gig/NewGigScreen';
import BookingsScreen from '../screens/bookings/BookingScreen';
import BookingDetailScreen from '../screens/booking_detail/BookingDetailScreen';
import PaystackRequestScreen from '../screens/paystack_request/PaystackRequestScreen';
import DepositScreen from '../screens/deposit/DepositScreen';
import ChangePasswordScreen from '../screens/change_password/ChangePasswordScreen';
import DisputeScreen from '../screens/dispute/DisputeScreen';
import GlamBioScreen from '../screens/glam_bio/GlamBioScreen';

//all screens are registered here
const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {headerShown: false},
    },
    GlamProfile: {
      screen: GlamProfileScreen,
      navigationOptions: {headerShown: false},
    },
    Filter: {
      screen: FilterScreen,
      navigationOptions: {headerShown: false},
    },
    Glams: {
      screen: GlamsScreen,
      navigationOptions: {headerShown: false},
    },
    Featured: {
      screen: FeaturedScreen,
      navigationOptions: {headerShown: false},
    },
    Interest: {
      screen: InterestScreen,
      navigationOptions: {headerShown: false},
    },
    PostSignupGeneral: {
      screen: PostSignupGeneral,
      navigationOptions: {headerShown: false},
    },
    PostSignupLocation: {
      screen: PostSignupLocation,
      navigationOptions: {headerShown: false},
    },
    PostSignupUsername: {
      screen: PostSignupUsername,
      navigationOptions: {headerShown: false},
    },
    PostSignupAvatar: {
      screen: PostSignupAvatar,
      navigationOptions: {headerShown: false},
    },
    ForgotPassword: {
      screen: ForgotPasswordScreen,
      navigationOptions: {headerShown: false},
    },
    Settings: {
      screen: SettingsScreen,
      navigationOptions: {headerShown: false},
    },
    EditProfile: {
      screen: EditProfileScreen,
      navigationOptions: {headerShown: false},
    },
    TrueImage: {
      screen: TrueImageScreen,
      navigationOptions: {headerShown: false},
    },
    BodyVideo: {
      screen: BodyVideoScreen,
      navigationOptions: {headerShown: false},
    },
    //
    AddService: {
      screen: AddServiceScreen,
      navigationOptions: {headerShown: false},
    },
    Offers: {
      screen: OffersScreen,
      navigationOptions: {headerShown: false},
    },
    OfferDetail: {
      screen: OfferDetailScreen,
      navigationOptions: {headerShown: false},
    },
    Gigs: {
      screen: GigsScreen,
      navigationOptions: {headerShown: false},
    },
    GigDetail: {
      screen: GigDetailScreen,
      navigationOptions: {headerShown: false},
    },
    ListUsers: {
      screen: ListUsersScreen,
      navigationOptions: {headerShown: false},
    },
    NewGig: {
      screen: NewGig,
      navigationOptions: {headerShown: false},
    },
    Bookings: {
      screen: BookingsScreen,
      navigationOptions: {headerShown: false},
    },
    BookingDetail: {
      screen: BookingDetailScreen,
      navigationOptions: {headerShown: false},
    },
    Deposit: {
      screen: DepositScreen,
      navigationOptions: {headerShown: false},
    },
    PaystackRequest: {
      screen: PaystackRequestScreen,
      navigationOptions: {headerShown: false},
    },
    ChangePassword: {
      screen: ChangePasswordScreen,
      navigationOptions: {headerShown: false},
    },
    Dispute: {
      screen: DisputeScreen,
      navigationOptions: {headerShown: false},
    },
    Bio: {
      screen: GlamBioScreen,
      navigationOptions: {headerShown: false},
    },
  },
);

export default createAppContainer(AppNavigator);
