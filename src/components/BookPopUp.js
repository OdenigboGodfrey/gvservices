import React, { Component } from "react";
import { View, Text, Textarea, Icon, CheckBox, Input, Item, Spinner, DatePicker } from "native-base";
import { Image, TouchableOpacity, StyleSheet, ScrollView, BackHandler, Dimensions, PermissionsAndroid,  } from "react-native";
import { Colours, getCurrency } from "../utils";
import { strings as AppStrings } from "../strings";
import BookPopUpMap from "./BookPopUpMap";
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { getLocationInfo } from "../api/MapAPI";
import DateTimePicker from '@react-native-community/datetimepicker';
import TimePicker from "./TimePicker";
import { GooglePlacesInput } from "./../components/PlacesInput";
import moment from 'moment';
import { AppContext } from "../../AppProvider";


const { bookPopUpStrings, genericStrings, bookPopUpMapStrings } = AppStrings;
const strings = bookPopUpStrings;

export default class BookPopUp extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
    }

    backHandler = undefined;
    
    async componentDidMount() {
        this.setState({
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
      
          });
          await this.requestLocationPermission()
    }

    componentWillUnmount() {
        this.setState({datePickerVisible: false, timePickerVisible: false});
    }

    handleBackPress = () => {
        console.log('back press');
        return true;
    }

    state = {
        description: '', 
        checkBoxChecked: false,
        permitted: false,
        width: 0,
        height: 0,
        latitude: 0.0,
        longitude: 0.0,
        latitudeDelta: 0.0000,
        longitudeDelta: 0.031,
        spinnerOn: false,
        venue: '',
        emptorAmount: 0,
        description: '',
        startDate: undefined, 
        startTime: new Date(),
        endDate: new Date(), 
        endTime: new Date(),
        datePickerVisible: false,
        timePickerVisible: false,
    }

    async requestLocationPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: bookPopUpMapStrings.locationPermission,
              message:
              bookPopUpMapStrings.locationPermissionMessage,
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
            //   let res = await getLocationInfo(this.state.latitude, this.state.longitude);
              setTimeout(() => {
                this.setState({spinnerOn: false, venue: this.context.state.user_data.my_location});
              }, 1000);
          }
      }

      onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
     
      };

    render() {
        return (
            // <ScrollView>
                <View style={[Styles.backgroundView,]}>
                    <View style={{position: 'absolute', height: '100%',}}>
                    <ScrollView contentContainerStyle={{alignItems: 'center', width:'100%', flexGrow: 1}}>                                            
                        <Image source={this.props.glamImage} style={[Styles.glamImage]} />
                        <Text style={[{}]}>{this.props.username}</Text>
                        <Text style={[Styles.glamService]}>{this.props.selectedService.glamServiceTitle} - {this.props.selectedService.title}</Text>
                        <Text style={[Styles.servicePrice]}>{this.props.selectedService.price}</Text>
                        <View style={[{flexDirection: 'row', alignSelf: 'stretch', marginBottom: 10}]}>
                            <CheckBox onPress={(e) => this.setState({checkBoxChecked: !this.state.checkBoxChecked})} checked={this.state.checkBoxChecked}  />
                            <Text style={{marginLeft: 20}}>Custom Price</Text>
                        </View>
                        {
                            this.state.checkBoxChecked && 

                            <Item rounded style={[{height: 40, marginTop: 5, marginBottom: 5}]}>
                                <Input 
                                    placeholder={getCurrency() + ' 10000'} 
                                    keyboardType={'numeric'} 
                                    onChangeText={text => this.setState({emptorAmount: text})}
                                />
                            </Item>
                        }
                        <View style={[{marginBottom: 25, borderColor: Colours.gray, borderRadius: 10, borderWidth: 2, width: '100%'}]}>
                            {
                                this.state.permitted 
                                ?
                            
                                    <MapView
                                        style={[Styles.map,]}
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
                                    {bookPopUpMapStrings.locationPermissionMessage}
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
                                                <Text style={[{color: Colours.white, height: 30}]}>{bookPopUpMapStrings.myLocation}</Text>
                                        }
                                        
                                    </TouchableOpacity>
                                    
                                    
                                </View>
                            }  
                            {/* 
                            {position: 'absolute', top: 180, bottom: 20, zIndex: 2, paddingTop: 20}
                             */}
                            <View style={[Styles.locationInputView, ]}>
                                {/* <Item bordered style={[{flex: 1, height: 30}]}>
                                    <Input placeholder={'Enter Location'} onChangeText={(text) => this.setState({location: text})} />
                                </Item> */}
                                <GooglePlacesInput 
                                onChangeText={text => this.setState({venue: text})}
                                placeholder={genericStrings.location}
                                top={5} 
                                left={3} 
                                width={'98%'}
                                onSelect={(place) => {
                                    // console.log('place I', place);
                                    if (place.status == 'OK') {
                                        this.setState({venue: place.result.formatted_address});
                                    }
                                }}
                                />
                            </View>
                        </View>

                        {/* <BookPopUpMap 
                            style={{width: 300, height: 600}} 
                            username={this.props.username} 
                            selectedService={this.props.selectedService}
                            bookPopUpMapCallback={(location) => this.bookPopUpMapCallback(location)}
                        /> */}

                        <Textarea
                            rowSpan={3} 
                            bordered 
                            onChangeText={(text) => this.setState({description: text})}
                            placeholder={strings.glamDescription} 
                            style={[{margin: 5, marginTop: 50}]}
                        />
                        <View style={{flexDirection: 'column', borderColor: Colours.gray, borderRadius: 5, borderWidth: 1, maxMidth: '100%', alignSelf: 'stretch', flex: 1, padding: 10, alignItems: 'center'}}>
                            <Text>Starting On</Text>
                            <DatePicker
                                defaultDate={new Date()}
                                minimumDate={new Date()}
                                locale={"en"}
                                timeZoneOffsetInMinutes={undefined}
                                modalTransparent={false}
                                animationType={"fade"}
                                androidMode={"calendar"}
                                placeHolderText="Start date"
                                textStyle={{ color: Colours.darkmagenta }}
                                placeHolderTextStyle={{ color: "#d3d3d3" }}
                                onDateChange={(val) => {
                                    // let date = new Date(val);
                                    this.setState({startDate: val});
                                }}
                                disabled={false}   
                            />
                            <TimePicker onConfirm={(time) => {
                                let date = new Date(parseInt(time));
                                this.setState({startTime: time});
                            }} />
                            
                        </View>
                        <View style={{flexDirection: 'column', borderColor: Colours.gray, borderRadius: 5, borderWidth: 1, maxMidth: '100%', alignSelf: 'stretch', flex: 1, padding: 10, alignItems: 'center', marginTop: 10}}>
                            <Text>Ending On</Text>
                            <DatePicker
                                defaultDate={new Date()}
                                minimumDate={(this.state.startDate != undefined) ? this.state.startDate :new Date()}
                                locale={"en"}
                                timeZoneOffsetInMinutes={undefined}
                                modalTransparent={false}
                                animationType={"fade"}
                                androidMode={"calendar"}
                                placeHolderText="End date"
                                textStyle={{ color: Colours.darkmagenta }}
                                placeHolderTextStyle={{ color: "#d3d3d3" }}
                                onDateChange={(val) => {
                                    this.setState({endDate: val});
                                    let startDate = this.state.startDate;
                                    {/* console.log(startDate.getFullYear() +'-'+ eval(startDate.getMonth() + 1) +'-'+startDate.getDate() + ' ' + this.state.startTime); */}
                                }}
                                disabled={false}   
                            />
                            <TimePicker onConfirm={(time) => {
                                let date = new Date(parseInt(time));
                                this.setState({endTime: time});
                            }} />
                            
                        </View>
                        <View style={[{flexDirection: 'row', alignSelf: 'stretch', alignContent: 'center'}]}>
                            {/* <TouchableOpacity 
                            style={[Styles.makeOfferButton]}
                            onPress={() => this.props.makeOfferCallback('returned')}
                            >
                                <Icon name='ios-redo' />
                                <Text>{strings.makeOffer}</Text>
                            </TouchableOpacity> 
                            endDate.getFullYear() +'-'+ endDate.getMonth() + 1 +'-'+endDate.getDate()
                            */}
                            <TouchableOpacity 
                            onPress={() => this.props.bookNowCallback({
                                description: this.state.description,
                                startDate: moment(this.state.startDate.getFullYear() +'/'+ eval(this.state.startDate.getMonth() + 1) +'/'+ this.state.startDate.getDate() + ' ' + this.state.startTime).format('YYYY-MM-DD HH:mm:ss'),
                                endDate: moment(this.state.endDate.getFullYear() +'/'+ eval(this.state.endDate.getMonth() + 1) +'/'+ this.state.endDate.getDate() + ' ' + this.state.endTime).format('YYYY-MM-DD HH:mm:ss'),
                                venue: this.state.venue,
                                emptorAmount: this.state.emptorAmount

                            })}
                            style={[Styles.bookNowButton]}>
                                <Icon name='ios-calendar' />
                                <Text>{this.state.checkBoxChecked ? strings.makeOffer : strings.bookNow}</Text>
                            </TouchableOpacity>
                        </View>

                        </ScrollView>
                    </View>
                </View>
            // </ScrollView>
            
        );
    }
}

const Styles = StyleSheet.create({
    backgroundView: {
        width: '101%', 
        alignItems: 'center', 
        height: 450,
        padding: 5
    },
    glamImage: {
        borderRadius: 50, 
        width: 100, 
        height: 100
    },
    glamService: {
        textTransform: 'capitalize', 
        fontWeight: 'bold'
    },
    servicePrice: {
        color: Colours.green, 
        fontWeight: 'bold', 
        fontSize: 24
    },
    makeOfferButton: {
        alignSelf: 'flex-start', 
        alignItems: 'center', 
        flex: 1, 
        padding: 5
    },
    bookNowButton: {
        alignSelf: 'flex-end', 
        alignItems: 'center', 
        padding: 5, 
        flex: 1
    },
    map: {
        width: 300, 
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