import React, { Component } from "react";
import { Container, Content, View, Text, Button, Icon, Header, Left, Body, Toast } from "native-base";
import { Styles } from "./BodyVideoStyle";
import { Image } from "react-native";
import ImagePicker from 'react-native-image-picker';
import { getImagePickerOptions, setImagePickerOptions, urls, Colours, PrepareResult } from "../../utils";
import { strings as AppStrings, strings } from '../../strings';
import { SpinnerButton } from "../../components/SpinnerButton";
import { uploadVerificationVideo } from "../../api/GlamAPI";
import { AppContext } from "./../../../AppProvider";
import RNFetchBlob from 'rn-fetch-blob'
import LinearGradient from "react-native-linear-gradient";
import RNFS from "react-native-fs";

const { genericStrings, errorMessages } = AppStrings;
const folderPath = '/videos/';

export default class BodyVideoScreen extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            videoCaptured: false,
            btnClicked: false,
            type: props.navigation.getParam('type', undefined),
            duration: props.navigation.getParam('duration', 30),
            video: undefined,
            fileName: '',
        }
    }

    componentDidMount() {
        this.setState({fileName: this.context.state.user_data.id});
    }

    prep = (file) => {
        return {
            name: file,
            uri: file.uri,
            type: 'video/mp4'
        }
    }

    launchCamera = () => {
        setImagePickerOptions('mixed');
        ImagePicker.launchCamera({
            durationLimit: this.state.duration,
            title: 'Capture Image',
            storageOptions: {
              skipBackup: true,
              path: 'images',
              privateDirectory: true
            },
            permissionDenied: {
              text: genericStrings.placeholderAppTitle + ' needs access to your camera',
              title: 'Camera Access'
            },
            mediaType: 'video',
          }, (response) => {
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
              
              console.log(" Video Path " + response.path);
              
              let ext = response.path.split('.')[1];
              let fileName = this.state.fileName + '.' + ext;
              let destinationPath = RNFS.TemporaryDirectoryPath + folderPath + fileName;
              
              if (!RNFS.exists(RNFS.TemporaryDirectoryPath + folderPath)) {
                RNFS.mkdir(RNFS.TemporaryDirectoryPath + folderPath)
              }

              

              RNFS.moveFile(response.path, destinationPath);
              
              this.setState({video: { path: destinationPath, ext: ext, fileName: fileName, type: 'video/' + ext, }, videoCaptured: true});
            }
          });
    }

    onUploadPress = async() => {
        this.setState({btnClicked: true});

        await RNFetchBlob.fetch('POST', urls.base + urls.glam + urls.verificationVideo + urls.save, {
            'Content-Type' : 'multipart/form-data',
            Authorization: 'Bearer ' + this.context.state.token,
          }, [
            // element with property `filename` will be transformed into `file` in form data
            { 
                name : this.state.type, filename : this.state.video.fileName, type:this.state.video.type, data: RNFetchBlob.wrap(this.state.video.path)
            },
            {name: 'glam_id', data: this.context.state.user_data.id.toString()}
            
          ]).then((resp) => {
            let res = PrepareResult(resp, '');
            res.data = JSON.parse(res.data);
            if (res.data.status != undefined && res.data.status) {
                Toast.show({
                    text: (res.data.message),
                    type: 'success',
                    buttonText: strings.genericStrings.dismiss
                });
                this.props.navigation.goBack();
            }
            else {
                Toast.show({
                    text: (res.data.message),
                    type: 'warning',
                    buttonText: strings.genericStrings.dismiss
                });
            }
          }).catch((err) => {
              
            Toast.show({
                text: (err),
                type: 'danger',
                buttonText: strings.genericStrings.dismiss
            });
          })

        this.setState({btnClicked: false});
    }

    render() {
        return (
            <Container>
                <Header style={{alignItems: 'center', backgroundColor: Colours.secondaryBlack}} androidStatusBarColor={Colours.secondaryBlack}>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name={(Platform.OS == 'android') ? 'arrow-back' : 'ios-arrow-back'} />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={{color: 'white', fontWeight: 'bold'}}>
                            {
                                (this.state.type == "body_video") 
                                ?
                                    'Body Video'
                                :
                                    'Speech Video'
                            }
                            
                        </Text>
                    </Body>
                </Header>
                <Content contentContainerStyle={{flex: 1}}>
                    
                    <LinearGradient
                        colors={[Colours.secondaryBlack, Colours.black]}
                        style={{
                        flex: 1,
                        height: '100%',
                        paddingRight: 10,
                        paddingLeft: 10,
                    }}>
                        <View style={{ flex: 1, alignItems: 'center', paddingTop: '30%', padding: 10}}>
                            <Image style={{width: 300, height: 200, resizeMode: 'cover'}} source={require('./../../../assets/images/undraw_video_influencer.png')} />
                            <Text style={[Styles.textStyle]}>Capture a speech video, detailing information about yourself</Text>
                            <Button 
                                icon 
                                rounded 
                                style={{width: 200, marginTop: 20, backgroundColor: Colours.darkmagenta}}
                                onPress={this.launchCamera}
                            >
                                <Icon name='ios-camera' />
                                <Text>Start Capture</Text>
                            </Button>
                            {
                                this.state.videoCaptured &&
                                <SpinnerButton 
                                rounded={true}
                                style={{width: '80%', alignSelf: 'center', marginTop: 20, backgroundColor: Colours.darkmagenta}}
                                label={'Save'}
                                btnClicked={this.state.btnClicked}
                                onPress={this.onUploadPress}
                                />
                            }
                        </View>
                    </LinearGradient>
                </Content>
            </Container>
        );
    }
}