

import React, { Component } from "react";
import { Header, Container, Content, Card, CardItem, Text, Body, Left, Thumbnail, Icon, Button, View, Grid, Col, Input, Item, Form, Toast, Tabs, Tab, TabHeading, DeckSwiper, Right, Textarea } from "native-base";
import { strings as AppStrings, } from "./../strings";
import { ImageBackground, Image, Dimensions, TouchableOpacity, ScrollView, TouchableHighlight, Animated,  StyleSheet, BackHandler } from "react-native";
import { backgroundImage01, glamIcon01, modelFemale01, modelMale01, modelFemale03, modelFemale02, Colours, testData } from "./../utils";
import { Dialog } from 'react-native-simple-dialogs';
import { SliderBox } from "react-native-image-slider-box";
import GlamService from "./../components/GlamService";
import BookPopUp from "./../components/BookPopUp";
import BookPopUpMap from "./../components/BookPopUpMap";
import BookPopUpTime from "./../components/BookPopUpTime";

const { glamProfileScreenStrings, genericStrings } = AppStrings;
const strings = glamProfileScreenStrings;

const popUpBoxMode = {
    slider: 0,
    service: 1,
    location: 2,
    time: 3,
    completed : 4
}


export class GradientView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            swipeablePanelActive: false,
            height: 0,
            avg_rate: 4,
            username: 'username',
            fullName: 'Full Name',
            ratingsText: '400+ ratings',
            gender: 'Female',
            address: 'Independence Layout, Enugu',
            glamDefaultImage: modelMale01,
            services: [],
            topViewHeightPercent: 0.55,
            
            dialogVisible: false,
            dialogTitle: '',
            popUpBoxMode: popUpBoxMode.service,
            glamIndex: 0,
            selectedService: {},
            description: '',
            animationTop : (0.55),
            animationHeight : (0.45),
            viewState : true
        }
        this.windowHeight = Dimensions.get('window').height;
    }

    windowHeight=0;
    topMarginPercent=0.55;
    bottomViewHeightPercent=0.45;

    

    componentDidMount() {
        this.set(
            { 
                height: Dimensions.get('window').height,
                bottomViewHeightPercent: (this.bottomViewHeightPercent * this.windowHeight),
                topMarginPercent: (this.topMarginPercent * this.windowHeight),
                username: testData[this.state.glamIndex].username,
                avg_rate: testData[this.state.glamIndex].star,
                ratingsText: testData[this.state.glamIndex].ratings + strings.ratings,
                gender: testData[this.state.glamIndex].gender,
                address: testData[this.state.glamIndex].address,
                glamDefaultImage: testData[this.state.glamIndex].image,
                fullName: testData[this.state.glamIndex].fullName,
                services: testData[this.state.glamIndex].services
            });     
    }



    set(value) {
        this.setState(value);    
    }




    shadeViewHeight = '50%';
    shadeViewTop = '50%';
    render(){
        const animatedStyle = {
            height : this.state.animationValue
          }
        return (
            <View style={[{height: this.state.height, flex: 1, width: '100%',}]}>
                <View style={[{flex: 1, position: 'absolute', height: this.state.height, width: '100%', backgroundColor: 'red'}]}>
                    <View style={[{position: 'absolute', height: (this.state.topViewHeightPercent * this.state.height), width: '100%', backgroundColor: Colours.grey}]}>
                        {/* background black shade */}
                        <View style={[{backgroundColor: 'black', opacity: 0.5, width: '100%', position: 'absolute', height: this.shadeViewHeight, top: this.shadeViewTop, borderRadius: 10}]}></View>
                        {/* overllaping view with content */}
                    </View>
                    <View style={[{position: 'absolute', height: (this.state.bottomViewHeightPercent), width: '100%', top: (this.state.topMarginPercent), backgroundColor: 'pink' }]}>
                        
                    </View>
                </View>
            </View>
            
        );
    }
}


let ScreenHeight = Dimensions.get("window").height - 22;
const Styles = StyleSheet.create({
topImage:{
    height: 150,
    width: 150,
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    resizeMode: 'contain'
    },
welcomeText: {
        flex: 1,
        fontSize: 24,
        alignSelf: 'stretch',
        textAlign: 'center',
        color: Colours.white
    },
loginText: {
        flex: 1,
        fontSize: 16,
        color: Colours.white
    },
forgotPasswordText: {
        flex: 1,
        alignSelf: 'stretch',
        textAlign: 'right',
        color: Colours.white, 
        marginTop: 5
    },
backgroundView: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0,  
    alignItems: 'center', 
    padding: 20
    },
backgroundImage: {
    alignSelf: 'stretch',
    flex: 1,
    paddingRight: 0,
    marginLeft: 0,
    height: ScreenHeight,
    flexDirection: 'row',
    width: '100%',
    resizeMode: 'contain'
    },
inputItem: {
    marginTop: 30
    },
whiteText: {
    color: Colours.white
},
speechBodyButton: {
    backgroundColor: 'white', 
    borderRadius: 10, 
    width: 150, 
    flexDirection: 'row', 
    padding: 7,
    justifyContent: 'space-evenly'
},
speechBodyText: {
    textAlignVertical: 'center'
},
starActive: {
    color: Colours.primaryTextColor, 
    fontSize:24
},
starInactive: { 
    fontSize:24, 
    color: Colours.gray
},
trueImage: {
    width: 70, 
    height: 70, 
    marginRight: 5
},
introView: {
    width: '100%', 
    height: '100%', 
    backgroundColor: Colours.gray, 
    paddingTop: 5, 
    paddingLeft: 5,
    marginBottom: 10
},
aboutMeView: {
    backgroundColor: 'white', 
    borderRadius: 10, 
    height: '80%', 
    padding: 5
},
backgroundGlamImage: {
    flex: 1, 
    height: '100%',
    width: '100%', 
},
userNameText: {
    fontSize: 26, 
    fontWeight: '500', 
    textTransform: 'capitalize'
},
fullNameText: {
    fontSize: 16,
},
bookingCompleteText: {
    fontWeight: 'bold', 
    fontSize: 24
}
})