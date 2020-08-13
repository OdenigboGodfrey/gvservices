import React, { Component } from 'react';
import { Container, Content, Button, ListItem, Text, Icon, Left, Body, Right, Separator, Input, Picker, View, DatePicker, Toast, Header } from 'native-base';
import { Image, Dimensions, ScrollView } from 'react-native';
import { Styles } from './EditProfileStyle';
import { strings as AppStrings, strings } from '../../strings';
import { getEmptorMode, getDate, getImage, setImagePickerOptions, prepareMedia, getImagePickerOptions, toFeet, getId, Colours, PrepareResult, getSubBase, urls } from '../../utils';
import { AppContext } from "./../../../AppProvider";
import { SpinnerButton } from '../../components/SpinnerButton';
import { edit } from '../../api/EditAPI';
import ImagePicker from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import ItemComponent from '../../components/Item';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from "react-native-fs";
import { getStates } from '../../api/GetApiFactorsAPI';


const { genericStrings, errorMessages } = AppStrings;
const folderPath = '/images/profile-picture/';

export default class EditProfile extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
    }

    state={
        genderSelected: 'male',
        citySelected: 1,
        btnClicked: false,
        imageFromLocal: false,
        states: [],
    }

    async componentDidMount() {
        
        if (this.context.state.states == undefined || 
            (this.context.state.states != undefined && this.context.state.states.length == 0)) 
             getStates(this.context, this.set);
        this.set({
            firstName: this.context.state.user_data.first_name,
            lastName: this.context.state.user_data.last_name,
            username: this.context.state.user_data.username,
            genderSelected: this.context.state.user_data.gender,
            email: this.context.state.user_data.email,
            mobile: this.context.state.user_data.phone,
            dob: this.context.state.user_data.birthday,
            height: this.context.state.user_data.height,
            citySelected: this.context.state.user_data.city_id,
            avatar: this.context.state.user_data.avatar,
            code: this.context.state.user_data.code,
            bio: this.context.state.user_data.bio,
            states: this.context.state.states,
        });
        
    }


    genderSelected = (gender) => { 
        this.setState({genderSelected: gender});
    }

    citySelected = (cityId) => {
        this.setState({citySelected: cityId});
    }

    set = (v) => {
        this.setState(v);
    }
    onSavePress = async() => {
        this.setState({btnClicked: true});
        let data = {
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            gender: this.state.genderSelected,
            city_id: this.state.citySelected,
            phone: this.state.mobile,
        }
        if (this.state.imageFromLocal) data.avatar = this.state.avatar;
        await edit(data, this.props.navigation, this.context, { next: undefined })
        this.setState({btnClicked: false});
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
              /**prepareMedia(response) */
              this.setState({avatar: prepareMedia(response), imageFromLocal: true});
              
            }
          });
    }

    render() {
        let userType = 'glams';
        if (getEmptorMode() == true){
            userType = 'emptors';
        }
        return (
        <Container>
            <Header 
                style={{backgroundColor: Colours.secondaryBlack}} 
                androidStatusBarColor={Colours.secondaryBlack}>
                <Left>
                    <Button transparent onPress={() => this.props.navigation.goBack()}>
                    <Icon name='arrow-back' />
                    </Button>
                </Left>
                <Body></Body>
            </Header>
            <Content>
                {/* Dimensions.get('screen').height */}
                <LinearGradient
                    colors={[Colours.secondaryBlack, Colours.black]}
                    style={{
                    flex: 1,
                    height: '100%',
                    paddingRight: 10,
                    paddingLeft: 10,
                }}>
                    <View style={{flex: 1,padding: 10}}>
                        <ScrollView style={{ height: '100%'}} >
                            <View style={[{width: '100%', height: 150, alignItems: 'center'}]}>
                                <Image 
                                source={(this.state.imageFromLocal)? this.state.avatar : getImage(userType, this.state.code, this.state.avatar)} 
                                style={{width: 120, height: 120, borderRadius: 100,}} 
                                resizeMode={'cover'} 
                                
                                />
                                <Icon name={'ios-create'} style={{color: Colours.white}} onPress={this.launchCamera}/>
                            </View>
                                
                            {/* </CardItem> */}
                            {/* </Card> */}
                            <Separator style={{maxHeight: 20, backgroundColor: Colours.secondaryBlack, height: 20}}>
                                <Text>General</Text>
                            </Separator>
                            <ListItem icon style={[Styles.listItem, { marginTop: 10}]}>
                                <Left>
                                    <Button transparent>
                                        <Icon 
                                            active 
                                            name="person" 
                                            style={{color: Colours.white}}
                                        />
                                    </Button>
                                    
                                </Left>
                                <Body style={{borderBottomWidth: 0}}>
                                    <Input 
                                        placeholder={genericStrings.firstName}
                                        onChangeText={(text) => this.setState({firstName: text})}
                                        value={this.state.firstName}
                                        placeholderTextColor={Colours.white}
                                        style={[Styles.colorWhite]}
                                    />
                                </Body>
                            </ListItem>
                            <ListItem icon style={[Styles.listItem]}>
                                <Left>
                                    <Button transparent>
                                        <Icon active name="person" style={{color: Colours.white}} />
                                    </Button>
                                    
                                </Left>
                                <Body style={{borderBottomWidth: 0}}>
                                    <Input 
                                    placeholder={genericStrings.lastName}
                                    onChangeText={(text) => this.setState({lastName: text})}
                                    value={this.state.lastName}
                                    placeholderTextColor={Colours.white}
                                    style={[Styles.colorWhite]}
                                    />
                                </Body>
                            </ListItem>
                            {
                                !getEmptorMode() && 
                                <ListItem icon style={[Styles.listItem]}>
                                    <Left>
                                        <Button transparent>
                                            <Icon active name="person" style={{color: Colours.white}} />
                                        </Button>
                                        
                                    </Left>
                                    <Body style={{borderBottomWidth: 0}}>
                                        <Input 
                                            placeholder={genericStrings.username}
                                            onChangeText={(text) => this.setState({username: text})}
                                            value={this.state.username}
                                            disabled
                                            placeholderTextColor={Colours.white}
                                            style={[Styles.colorWhite]}
                                        />
                                    </Body>
                            </ListItem>
                            }

                            <ListItem icon style={[Styles.listItem]}>
                                <Left>
                                    <Button transparent>
                                        {
                                            this.state.genderSelected == 'male' ?
                                                <Icon active name="ios-male" style={[Styles.colorWhite]} />
                                            :
                                                <Icon active name="ios-female" style={[Styles.colorWhite]} />
                                        }
                                    </Button>
                                </Left>
                                <Body style={{borderBottomWidth: 0}}>
                                    <Picker
                                        mode="dropdown"
                                        placeholderIconColor={Colours.white}
                                        iosIcon={<Icon name="arrow-down" style={[Styles.colorWhite]} />}
                                        headerStyle={{ backgroundColor: "#fff" }}
                                        headerBackButtonTextStyle={{ color: "#fff" }}
                                        headerTitleStyle={{ color: "#fff" }}
                                        style={{color: Colours.white}}
                                        selectedValue={this.state.genderSelected}
                                        onValueChange={this.genderSelected.bind(this)}
                                        >
                                        <Picker.Item label="Male" value="male" />
                                        <Picker.Item label="Female" value="female" />
                                    </Picker>
                                </Body>
                            </ListItem>
                            
                            <ItemComponent 
                                iconLeft={"pin"}
                                body={<Text style={[Styles.colorWhite]}>{genericStrings.location}</Text>}
                            />
                            {
                                false &&
                                    <ListItem icon style={[Styles.listItem]}>
                                    <Left>
                                        <Button transparent>
                                            <Icon active name="flag" style={[Styles.colorWhite]} />
                                        </Button>
                                        
                                    </Left>
                                    <Body style={{borderBottomWidth: 0}}>
                                        <Picker
                                            mode="dropdown"
                                            iosIcon={<Icon name="arrow-down" style={[Styles.colorWhite]} />}
                                            style={{color: Colours.white}}
                                            headerStyle={{ backgroundColor: "#fff" }}
                                            headerBackButtonTextStyle={{ color: "#fff" }}
                                            headerTitleStyle={{ color: "#fff" }}
                                            selectedValue={this.state.genderSelected}
                                            onValueChange={this.genderSelected.bind(this)}
                                            >
                                            <Picker.Item label={genericStrings.country} value={genericStrings.country} />
                                        </Picker>
                                    </Body>
                                </ListItem>
                            }
                            <ListItem icon style={[Styles.listItem]}>
                                <Left>
                                    <Button transparent>
                                        <Icon active name="home" style={[Styles.colorWhite]} />
                                    </Button>
                                    
                                </Left>
                                <Body style={{borderBottomWidth: 0}}>
                                    <Picker
                                        mode="dropdown"
                                        iosIcon={<Icon name="arrow-down" style={[Styles.colorWhite]} />}
                                        style={{color: Colours.white}}
                                        headerStyle={{ backgroundColor: "#b95dd3" }}
                                        headerBackButtonTextStyle={{ color: "#fff" }}
                                        headerTitleStyle={{ color: "#fff" }}
                                        selectedValue={this.state.citySelected}
                                        onValueChange={this.citySelected.bind(this)}
                                        >
                                            {
                                                this.state.states.map(state => <Picker.Item key={state.id} value={state.id} label={state.name} />)
                                            }
                                        {/* <Picker.Item label={'City'} value={'City'} /> */}
                                    </Picker>
                                </Body>
                            </ListItem>
                            <Separator 
                                style={{maxHeight: 20, backgroundColor: Colours.secondaryBlack, height: 20, marginTop: 10, marginBottom: 10}}
                            >
                                <Text>Privacy</Text>
                            </Separator>
                            <ListItem icon style={[Styles.listItem]}>
                                <Left>
                                    <Button transparent>
                                        <Icon active name="ios-at" style={[Styles.colorWhite]} />
                                    </Button>
                                    
                                </Left>
                                <Body style={{borderBottomWidth: 0}}>
                                    <Input 
                                        disabled 
                                        placeholder={this.state.email} 
                                        placeholderTextColor={Colours.white}
                                        style={[Styles.colorWhite]}
                                    />
                                </Body>
                            </ListItem>
                            <ListItem icon style={[Styles.listItem]}>
                                <Left>
                                    <Button transparent>
                                        <Icon active name="ios-call" style={[Styles.colorWhite]}  />
                                    </Button>
                                    
                                </Left>
                                <Body style={{borderBottomWidth: 0}}>
                                    <Input 
                                        placeholder={genericStrings.mobile}
                                        keyboardType={'numeric'}
                                        onChangeText={(text) => this.setState({mobile: text})}
                                        value={this.state.mobile}
                                        placeholderTextColor={Colours.white}
                                        style={[Styles.colorWhite]}
                                    />
                                </Body>
                            </ListItem>
                            <ListItem 
                                icon 
                                style={[Styles.listItem]} 
                                onPress={() => this.props.navigation.navigate('ChangePassword')}
                            >
                                <Left>
                                    <Button transparent>
                                        <Icon active name="key" style={[Styles.colorWhite]} />
                                    </Button>
                                    
                                </Left>
                                <Body style={{borderBottomWidth: 0}}>
                                    <Text style={[Styles.colorWhite]}>
                                        {genericStrings.password}
                                    </Text>
                                </Body>
                                <Right style={{alignItems: 'center', justifyContent: 'center',borderBottomWidth: 0}}>
                                    <Icon name={'ios-arrow-forward'} style={{marginBottom: 25}} />
                                </Right>
                            </ListItem>
                            {
                                !getEmptorMode() &&
                                <ListItem icon style={[Styles.listItem]}>
                                    <Left>
                                        <Button transparent>
                                            <Icon active name="calendar" style={[Styles.colorWhite]} />
                                        </Button>
                                        
                                    </Left>
                                    <Body style={{borderBottomWidth: 0}}>
                                        <DatePicker
                                            placeHolderText={
                                                (this.state.dob != undefined && this.state.dob != '') 
                                                ? 
                                                    getDate(this.state.dob) 
                                                : 
                                                    'Date of birth'
                                            }
                                            placeHolderTextStyle={{color: Colours.white}}
                                            style={{color: Colours.white}}
                                            textStyle={{color: Colours.white}}
                                        />
                                    </Body>
                                </ListItem>
                            }
                            
                            {
                                !getEmptorMode() &&
                                <Separator style={{maxHeight: 20, backgroundColor: Colours.secondaryBlack, height: 20, marginTop: 10, marginBottom: 10}}>
                                    <Text>{!getEmptorMode() ? genericStrings.glam : genericStrings.emptor}</Text>
                                </Separator>
                            }
                            
                            {
                                !getEmptorMode() &&
                                <ListItem icon style={[Styles.listItem]} onPress={() => this.props.navigation.navigate('Bio', {bio: this.state.bio})}>
                                    <Left>
                                        <Button transparent>
                                            <Icon 
                                                active 
                                                name="ios-information-circle-outline" 
                                                style={{color: Colours.white}} 
                                            />
                                        </Button>
                                        
                                    </Left>
                                    <Body style={{borderBottomWidth: 0}}>
                                        <Text style={{color: Colours.white}}>{genericStrings.bio}</Text>
                                    </Body>
                                    <Right style={{borderBottomWidth: 0}}>
                                        <Icon 
                                            name={'ios-arrow-forward'} 
                                            style={{color: Colours.white, marginBottom: 25}} 
                                        />
                                    </Right>
                                </ListItem>
                            }
                            {
                                !getEmptorMode() &&
                                <ListItem icon style={[Styles.listItem]}>
                                <Left>
                                    <Button transparent>
                                        <Icon active name="person" style={{color: Colours.white}} />
                                    </Button>
                                    
                                </Left>
                                <Body style={{borderBottomWidth: 0}}>
                                    <Input 
                                        placeholder={this.state.height} 
                                        style={{color: Colours.white}}
                                        placeholderTextColor={Colours.white}
                                    />
                                </Body>
                                <Right style={{borderBottomWidth: 0}}>
                                    <Text style={{
                                        color: Colours.white,
                                        marginBottom: 25,
                                        color: Colours.white
                                    }}>{toFeet(this.state.height)}</Text>
                                </Right>
                            </ListItem>
                            }
                            <SpinnerButton
                                rounded={true}
                                style={{width: '80%', alignSelf: 'center', marginTop: 20, backgroundColor: Colours.darkmagenta, marginBottom: 20}}
                                label={'Save'}
                                btnClicked={this.state.btnClicked}
                                onPress={this.onSavePress}
                            />
                        </ScrollView>
                    </View>
                </LinearGradient>
            </Content>
        </Container>
        );
  }
}