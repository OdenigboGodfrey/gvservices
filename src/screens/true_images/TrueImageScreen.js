import React, { Component } from "react";
import { Container, Content, Icon, View, Text, Header, Left, Button, Body, Toast } from "native-base";
import { ScrollView, Image } from "react-native";
import { modelMale01, setImagePickerOptions, getImagePickerOptions, prepareMedia, getToken, getImage, Colours, PrepareResult } from "../../utils";
import { strings as AppStrings, strings } from '../../strings';
import ImagePicker from 'react-native-image-picker';
import { SpinnerButton } from "../../components/SpinnerButton";
import { uploadTrueImages } from "../../api/GlamAPI";
import { AppContext } from "./../../../AppProvider";
import { Styles } from "./TrueImageStyle";
import LinearGradient from "react-native-linear-gradient";
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from "react-native-fs";


const { genericStrings } = AppStrings;
const folderPath = '/images/true-images/';
export default class TrueImageScreen extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props)
    }
    state = {
        images: [],
        btnClicked: false,
    }
    componentDidMount() {
        this.set({
            avatar: this.context.state.user_data.avatar,
            code: this.context.state.user_data.code,
        })
    }

    set = (v) => {
        this.setState(v);
    }

    launchCamera = () => {
        console.log('image tapped');
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
            //   console.log('User tapped custom button: ', response.customButton);
            } else {
              // You can also display the image using data:
              // const source = { uri: 'data:image/jpeg;base64,' + response.data };
              console.log("images", JSON.stringify(this.state));
              this.setState({images: [...this.state.images, prepareMedia(response)]});
              console.log("images", JSON.stringify(this.state));
              
            }
          });
    }

    onSavePress = async() => {
        this.setState({btnClicked: true});
        let data = new FormData();
        this.state.images.forEach(image => {
            data.append("true_images[]", image);
        });

        await uploadTrueImages(data, this.context, this.props.navigation, this.set);
    }

    render() {
        let userImage = (this.state.avatar == undefined) ? modelMale01 : getImage('glams', this.state.code, this.state.avatar);
        return(
            <Container>
                <Header
                    style={{backgroundColor: Colours.secondaryBlack}} 
                    androidStatusBarColor={Colours.secondaryBlack}
                >
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name={(Platform.OS == 'android') ? 'arrow-back' : 'ios-arrow-back'} />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={{color: 'white', fontWeight: 'bold'}}>True Images</Text>
                    </Body>
                </Header>
                <Content contentContainerStyle={{ flexGrow: 1}}>
                    <LinearGradient
                        colors={[Colours.secondaryBlack, Colours.black]}
                        style={{
                        flex: 1,
                        height: '100%',
                        paddingRight: 10,
                        paddingLeft: 10,
                    }}>
                    <View style={[{flex: 0.3, alignItems: 'center', justifyContent: 'center'}]}>
                        <Image source={userImage} style={{width: 120, height: 120, resizeMode: 'cover', borderRadius: 50}} />
                        <Icon name={'ios-camera'} onPress={this.launchCamera} style={{fontSize: 45, color: Colours.white}} />
                        <SpinnerButton
                        rounded={true}
                        style={{width: '80%', alignSelf: 'center', marginTop: 20, backgroundColor: Colours.darkmagenta}}
                        label={'Upload'}
                        btnClicked={this.state.btnClicked}
                        onPress={this.onSavePress}
                        />
                    </View>
                    <ScrollView style={[]}>
                        <View style={[Styles.imageBackgroundView, {backgroundColor: Colours.secondaryBlack}]}>
                            {
                                this.state.images.map(image => {
                                    return (
                                        <Image key={image.name} source={{uri: image.uri}} style={[Styles.image]} />
                                    );
                                })
                            }
                        </View>
                        
                    </ScrollView>
                    </LinearGradient>
                </Content>
            </Container>
        );
    }
}