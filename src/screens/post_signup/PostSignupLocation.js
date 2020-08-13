import React, {Component} from 'react';
import {
  View,
  Text,
  Icon,
  Container,
  Content,
  Item,
  Button,
  Header,
  Picker,
  Toast,
} from 'native-base';
import {Image, PermissionsAndroid, ScrollView} from 'react-native';
import {Colours, modelMale01, getId} from '../../utils';
import {strings as AppStrings} from '../../strings';
import Geolocation from 'react-native-geolocation-service';
import {Styles} from './PostSignupStyle';
import {SpinnerButton} from '../../components/SpinnerButton';
import {getStates} from './../../api/GetApiFactorsAPI';
import {edit} from '../../api/EditAPI';
import {AppContext} from '../../../AppProvider';
import { GooglePlacesInput } from '../../components/PlacesInput';

const {editProfileStrings, genericStrings, bookPopUpMapStrings} = AppStrings;
const strings = editProfileStrings;
const nextPage = 'PostSignupUsername';

export default class PostSignupLocation extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
  }

  state = {
    countrySelected: 'country',
    citySelected: 'city',
    permitted: false,
    latitude: 0.0,
    longitude: 0.0,
    city: '',
    country: '',
    btnClicked: false,
    states: [],
    myLocation: '',
  };
  /** navigation param */
  navigationParam = {
    next: nextPage,
    enforce: this.props.navigation.getParam('enforce', undefined),
    data: this.props.navigation.getParam('data', undefined),
  };

  async componentDidMount() {
    let userData = this.props.navigation.getParam('data', undefined);
    
    this.setState({userData: userData});
    
    if (
      userData != undefined &&
      userData.city_id != null &&
      userData.my_location != null &&
      this.props.navigation.getParam('enforce', undefined) != undefined
    ) {
      // console.log("PostLocation ", userData.city_id, userData.my_location, this.props.navigation.getParam('enforce', undefined));
      this.props.navigation.navigate(nextPage, this.navigationParam);
    } else {
      
      if (this.props.navigation.state.routeName == 'PostSignupLocation') {
        // only get latitude and longitude when navigated to
        await getStates(this.context, this.set);
        await this.requestLocationPermission();
      }
      
    }
  }

  set = v => {
    this.setState(v);
  };

  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: bookPopUpMapStrings.locationPermission,
          message: bookPopUpMapStrings.locationPermissionMessage,
          buttonNeutral: bookPopUpMapStrings.buttonNeutral,
          buttonNegative: bookPopUpMapStrings.buttonNeutral,
          buttonPositive: bookPopUpMapStrings.buttonPositive,
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
        this.setState({permitted: true});

        this.getCurrentLocation();
      } else {
        Toast.show({
          text: bookPopUpMapStrings.locationPermissionMessage,
          buttonText: genericStrings.dismiss,
          type: 'warning',
        });
        console.log('Location permission denied');
        this.setState({permitted: false});
      }
    } catch (err) {
      console.warn(err);
    }
  }

  getCurrentLocation() {
    if (this.state.permitted) {
      Toast.show({
        text: bookPopUpMapStrings.gettingLocation,
        buttonText: genericStrings.dismiss,
        duration: 5000,
      });

      Geolocation.getCurrentPosition(
        position => {
          console.log(position);
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });

          console.log('Location ', this.state.latitude, this.state.longitude);
          Toast.show({
            text: bookPopUpMapStrings.locationGotten,
            buttonText: genericStrings.dismiss,
            type: 'success',
          });
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
          Toast.show({
            text: error.message,
            buttonText: genericStrings.dismiss,
            type: 'danger',
          });
          return {
            success: false,
          };
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } else {
      return {
        success: false,
      };
    }
  }

  countryChange = text => {
    this.setState({countrySelected: text});
  };

  cityChange = text => {
    this.setState({citySelected: text});
  };

  onNextPress = async () => {
    // this.state.country == '' ||
    if (
      this.state.citySelected == ''
    ) {
      Toast.show({
        text: strings.fillAllFields,
        type: 'danger',
        buttonText: genericStrings.dismiss,
      });
      return;
    }
    if (
      this.state.latitude == 0.0 && 
      this.state.longitude == 0.0 
    ) {
      Toast.show({
        text: strings.latLongFields,
        type: 'danger',
        buttonText: genericStrings.dismiss,
      });
      return;
    }
    this.setState({btnClicked: true});
    //'country_id': this.state.countrySelected,
    await edit(
      {
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        city_id: this.state.citySelected,
        id: getId(),
        my_location: this.state.myLocation,
      },
      this.props.navigation,
      this.context,
      this.navigationParam,
    );

    this.setState({btnClicked: false});
  };

  render() {
    console.log("userdata", this.state.userData);
    return (
      <Container style={{flex: 1, width: '100%'}}>
        <Header
          style={{
            backgroundColor: 'white',
            shadowColor: 'white',
            shadowOffset: {height: 0, width: 0},
            shadowOpacity: 0,
            elevation: 0,
          }}
        />
        <Content contentContainerStyle={{flex: 1}}>
          <ScrollView nestedScrollEnabled={true}>
            <View style={{flex: 0.7, alignItems: 'center'}}>
              <Image
                source={modelMale01}
                style={{
                  width: 120,
                  height: 120,
                  resizeMode: 'contain',
                  borderRadius: 100,
                }}
              />
            </View>
            <View style={{flex: 2.3}}>
              <View style={{flex: 3, padding: 10}}>
                {/* <Item style={{borderBottomWidth: 0, marginBottom: 10}}>
                                  <View style={{ borderRadius: 1, borderWidth: 1, borderColor: Colours.gray, width: '100%', }}>
                                      <Picker
                                      style={[{ borderColor: 'black', }]}
                                      mode="dropdown"
                                      iosIcon={<Icon name="arrow-down" />}
                                      headerStyle={{ backgroundColor: "#b95dd3" }}
                                      headerBackButtonTextStyle={{ color: "#fff" }}
                                      headerTitleStyle={{ color: "#fff" }}
                                      selectedValue={this.state.countrySelected}
                                      onValueChange={this.countryChange.bind(this)}
                                      >
                                          <Picker.Item value={'country'} label={'Country'} />
                                      </Picker>
                                  </View>
                              </Item> */}
                <Item style={{borderBottomWidth: 0, marginBottom: 10}}>
                  <View
                    style={{
                      borderRadius: 1,
                      borderWidth: 1,
                      borderColor: Colours.gray,
                      width: '100%',
                    }}>
                    <Picker
                      style={[{borderColor: 'black'}]}
                      mode="dropdown"
                      iosIcon={<Icon name="ios-arrow-down" />}
                      headerStyle={{backgroundColor: '#b95dd3'}}
                      headerBackButtonTextStyle={{color: '#fff'}}
                      headerTitleStyle={{color: '#fff'}}
                      selectedValue={this.state.citySelected}
                      onValueChange={this.cityChange.bind(this)}>
                      {this.state.states.map(state => (
                        <Picker.Item
                          key={state.id}
                          value={state.id}
                          label={state.name}
                        />
                      ))}
                    </Picker>
                  </View>
                </Item>
                {/* <Item style={{borderBottomWidth: 0, marginBottom: 20, zIndex: 1, elevation: 1}}> */}
                  <View
                  style={{
                    backgroundColor: 'white',
                    position: 'absolute',
                    width: '100%',
                    borderRadius: 10,
                    zIndex: 3,
                    elevation: 5,
                    top: 70,
                    left: 10,
                    
                  }}>

                  
                    <GooglePlacesInput
                      placeholder={(this.state.userData != undefined && this.state.userData.my_location) ? this.state.userData.my_location :"Enter your location"}
                      top={3}
                      left={3}
                      width={'98%'}
                      onSelect={place => {
                        console.log("place", place);
                        if (place.status == 'OK') {
                          this.setState({myLocation: place.result.formatted_address});
                        }
                      }}
                      onChangeText={(text) => {
                        this.setState({myLocation: text});
                        console.log("text", text, this.state.myLocation);
                      }}
                    />
                  </View>
                {/* </Item> */}
                <SpinnerButton
                  rounded={true}
                  onPress={async () => {
                    this.setState({btnClicked: true});
                    await this.onNextPress();
                    this.setState({btnClicked: false});
                  }}
                  label={'Next'}
                  btnClicked={this.state.btnClicked}
                  style={{backgroundColor: Colours.darkmagenta, marginTop: '70%'}}
                />
                {/* <Button rounded style={{width: '80%', alignSelf: 'center'}}>
                                  <Text style={[{textAlignVertical: 'center', textAlign: 'center', width: '100%',}]}>Next</Text>
                              </Button> */}
              </View>
            </View>
          </ScrollView>
        </Content>
      </Container>
    );
  }
}
