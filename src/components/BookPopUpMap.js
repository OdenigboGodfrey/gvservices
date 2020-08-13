import React, { Component } from "react";
import { View, Text, Textarea, Icon, Left, Body, Right, CardItem, Button, Item, Input, Spinner } from "native-base";
import { Image, TouchableOpacity, PermissionsAndroid, StyleSheet, Dimensions, } from "react-native";
import { Colours } from "../utils";
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { strings as AppStrings } from "../strings";
import { getLocationInfo } from "../api/MapAPI";

const { bookPopUpMapStrings } = AppStrings;
const strings = bookPopUpMapStrings;

export default class BookPopUpMap extends Component {
    constructor(props) {
        super(props);
    }

    state={
        permitted: false,
        width: 0,
        height: 0,
        latitude: 0.0,
        longitude: 0.0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
        spinnerOn: false,
        location: ''
    }

    async componentDidMount() {
        this.setState({
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
      
          });
        await this.requestLocationPermission();
    }

    async requestLocationPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: strings.locationPermission,
              message:
                strings.locationPermissionMessage,
              buttonNeutral: strings.buttonNeutral,
              buttonNegative: strings.buttonNeutral,
              buttonPositive: strings.buttonPositive,
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the location');
            this.setState({permitted: true});
            this.getCurrentLocation();
          } else {
            console.log('Location permission denied');
            this.setState({permitted: false});
          }
        } catch (err) {
          console.warn(err);
        }
      }

      getCurrentLocation() {
        if (this.state.permitted) {
          Geolocation.getCurrentPosition(
            position => {
              console.log(position);
              this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
              console.log('Location ', this.state.latitude, this.state.longitude);
            },
            error => {
              // See error code charts below.
              console.log(error.code, error.message);
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

      async onUseMyLocationPress() {
          if (!this.state.spinnerOn) {
              this.setState({spinnerOn: true});
              let res = await getLocationInfo(this.state.latitude, this.state.longitude);
              this.setState({spinnerOn: false});
          }
      }

    render() {
        return(
            <View style={this.props.style}>
                {/* <View style={[{flexDirection: 'row'}]}>
                    <Text style={[Styles.usernameText]}>{this.props.username} </Text>
                    <Text style={[Styles.serviceInfoText]}>
                          - {this.props.selectedService.glamServiceTitle} - 
                        {this.props.selectedService.title} -
                        {this.props.selectedService.price}
                    </Text>
                </View> */}
                
                {
                    this.state.permitted 
                    ?
                
                        <MapView
                            style={[Styles.map]}
                            provider={PROVIDER_GOOGLE}
                            showsUserLocation={true}
                            initialRegion={{
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                            latitudeDelta: this.state.latitudeDelta,
                            longitudeDelta: this.state.longitudeDelta,
                            }}
                            region={{
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                            latitudeDelta: this.state.latitudeDelta,
                            longitudeDelta: this.state.longitudeDelta,
                            }}
                        >
                        </MapView>
                    :
                    <Text>
                        {strings.locationPermissionMessage}
                    </Text>
                }
                {
                    this.state.permitted && 
                    <View style={[{width: '95%', flexDirection: 'row', padding: 5}]}>
                        <TouchableOpacity 
                        style={[Styles.useMyLocationButton]}
                        onPress={async() => await this.onUseMyLocationPress()}
                        >
                            {
                                (this.state.spinnerOn) 
                                ?
                                    <Spinner style={[{height: 30}]} color={Colours.white} />
                                :
                                    <Text style={[{color: Colours.white, height: 30}]}>{strings.myLocation}</Text>
                            }
                            
                        </TouchableOpacity>
                        
                        
                    </View>
                }
                <View style={[Styles.locationInputView]}>
                    <Item bordered style={[{flex: 1, height: 30}]}>
                        <Input placeholder={'Enter Location'} onChangeText={(text) => this.setState({location: text})} />
                    </Item>
                </View>
                {/* <View style={[Styles.nextButton]}>
                    <Button 
                        block 
                        style={[{width: 150, alignSelf: 'flex-end'},]}
                        onPress={() => this.props.bookPopUpMapCallback(this.state.location)}
                        >
                        <Text>{strings.next}</Text>
                    </Button>
                </View> */}
            </View>
            
        );
    }
}

const Styles = StyleSheet.create({
    map: {
        width: '90%', 
        height: 150
    },
    usernameText: {
        textTransform: 'capitalize', 
        fontSize: 13, 
        fontWeight: 'bold'
    },
    serviceInfoText: {
        textTransform: 'capitalize', 
        fontSize: 13
    },
    useMyLocationButton: { 
        backgroundColor: 
        Colours.black, 
        borderRadius: 5, 
        padding: 3,
        alignSelf: 'stretch', 
        alignItems: 'center', 
        flex: 1
    },
    locationInputView:{
        width: '95%', 
        flexDirection: 'row-reverse', 
        alignItems:'flex-end', 
        borderRadius: 5, 
        padding: 5
    },
    nextButton: {
        width: '95%', 
        flexDirection: 'row-reverse', 
        alignItems:'flex-end', 
        marginTop: 10
    }
  });