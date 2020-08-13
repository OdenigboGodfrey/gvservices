import React, { Component } from "react";
import { View, Text, Textarea, Icon, Container, Content, CardItem, Item, Input, Form, Button, Body, Header, Picker, DatePicker, Toast } from "native-base";
import { Image, TouchableOpacity, StyleSheet } from "react-native";
import { Colours, modelMale01, getImagePickerOptions, setImagePickerOptions, prepareMedia, getEmptorMode, logout, getId } from "../../utils";
import { strings as AppStrings } from "../../strings";
import { Styles } from "./PostSignupStyle";
import ImagePicker from 'react-native-image-picker';
import { edit } from "../../api/EditAPI";
import { SpinnerButton } from "../../components/SpinnerButton";
import { AppContext } from "../../../AppProvider";

const { bookPopUpTimeStrings, genericStrings, errorMessages } = AppStrings;
const strings = bookPopUpTimeStrings;
const nextPage = 'Home';

export default class PostSignupAvatar extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        
    }

    state = {
        avatarSource: undefined,
        btnClicked: false
    }

    /** navigation param */
    navigationParam = {
        'next': nextPage, 
        enforce: this.props.navigation.getParam('enforce', undefined)
      };

    async componentDidMount() {
        // console.log("postSignAvatar",(this.context.state.user_data != undefined), (this.context.state.user_data.avatar != null), (this.props.navigation.getParam('enforce', undefined) != undefined), getEmptorMode(), this.context.state.user_data);
        if (
            this.context.state.user_data != undefined && 
            this.context.state.user_data.avatar != null && 
            this.props.navigation.getParam('enforce', undefined) != undefined
            ) {
          this.props.navigation.navigate(nextPage, this.navigationParam)
          
        }
        
      }

    genderSelected = (gender) => {
        this.setState({genderSelected: gender});
    }
    
    launchCamera = () => {
        setImagePickerOptions('photo');
        ImagePicker.launchCamera(getImagePickerOptions(), (response) => {
            // console.log('Response = ', response);
   
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
              Toast.show({
                  text: errorMessages.errorOccured,
                  buttonText: genericStrings.dismiss,
              })
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            } else {
              // You can also display the image using data:
              // const source = { uri: 'data:image/jpeg;base64,' + response.data };
              this.setState({avatarSource: prepareMedia(response)});
              
            }
          });
    }

    onNextPress = async () => {
        this.setState({btnClicked: true});
        await edit({'avatar': this.state.avatarSource}, this.props.navigation, this.context, this.navigationParam);
        this.setState({btnClicked: false});
    }

    render() {
        let userImage = (this.state.avatarSource == undefined) ? modelMale01 : {uri: this.state.avatarSource.uri };
        return(
            <Container style={{flex: 1, width: '100%'}}>
                <Header style={{backgroundColor: 'white', shadowColor: 'white', shadowOffset: {height: 0, width: 0}, shadowOpacity: 0, elevation: 0}} />
                <Content contentContainerStyle={{flex: 1,}}>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <Image source={userImage} style={{width: 120, height: 120, resizeMode: 'cover', borderRadius: 50}} />
                        <Icon name={'ios-camera'} onPress={this.launchCamera} />
                    </View>
                    <View style={{flex: 2,}}>
                        <View style={{flex: 3, padding: 10, alignItems: 'center'}}>
                            <SpinnerButton 
                                label={'Finish'}
                                rounded={true}
                                style={{width: '80%', backgroundColor: Colours.darkmagenta}}
                                btnClicked={this.state.btnClicked}
                                onPress={this.onNextPress}
                            />
                        </View>
                        <View style={{flex: 1, paddingLeft: 10, alignItems: 'center' }}>
                            
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}

