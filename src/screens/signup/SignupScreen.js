import React, { Component } from "react";
import { Header, Container, Content, Card, CardItem, Text, Body, Left, Thumbnail, Icon, Button, View, Grid, Col, Input, Item, Form, Right, Picker } from "native-base";
import { Styles } from "./SignupStyle.js";
import { strings as AppStrings, } from "./../../strings";
import { backgroundImage01, glamIcon01, getEmptorMode, Colours, setContext, setEmptorMode } from "../../utils.js";
import { ImageBackground, Image } from "react-native";
import { AppContext } from "../../../AppProvider";

import { register } from "./../../api/AuthAPI";
import { SpinnerButton } from "../../components/SpinnerButton.js";

const { signupScreenStrings, genericStrings } = AppStrings;
const strings = signupScreenStrings;

class SignupScreen extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
    }
    state = {
        firstName: '',
        lastName: '',
        mobile: '',
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
        gender: '',
        showPassword: true,
        btnClicked: false,
        userType: genericStrings.glam
    }

    onLoginPress() {
        this.props.navigation.navigate('Login');
    }

    async onSignupPress() {
        console.log('Signing Up');
        this.userType(this.state.userType);
        if (this.state.password != '') {
            this.setState({btnClicked: true});
            // alert('Signup Press');
            await register({
                'email': this.state.email,
                'password': this.state.password,
                'first_name': this.state.firstName,
                'last_name': this.state.lastName,
            }, this.props.navigation, this.context);
            this.setState({btnClicked: false});
        }
        else {
            alert(strings.passwordEmpty);
        }
        
    }

    userType = (text) => {
        setContext(this.context);
        if (text == genericStrings.glam) {
            setEmptorMode(false);
        }
        else {
            setEmptorMode(true);
        }
        this.setState({userType: text});
    }

    render() {
        return(
            <ImageBackground source={backgroundImage01} style={[Styles.backgroundImage]}>
                <View style={[Styles.backgroundView]}>
                    <Container  style={{flex: 1, width: '100%',backgroundColor: 'transparent'}}>
                        <Content>
                            {/* <Card> */}
                                <CardItem style={[Styles.transparent]}>
                                    <Body style={[Styles.topImage,]}>
                                        <Image source={glamIcon01}
                                            style={[Styles.topImage]}
                                        />
                                    </Body>
                                </CardItem>
                                <CardItem style={[Styles.transparent, {marginTop: 100}]}>
                                    <Body>
                                        <Item rounded style={[Styles.inputItem]}>
                                            <Icon name="person" style={{color: 'white'}} />
                                            <Input style={{color: 'white'}} placeholderTextColor='white' placeholder={genericStrings.firstName} onChangeText={(text) => this.setState({ firstName: text})} />
                                            
                                            <Input style={{color: 'white'}} placeholderTextColor='white'  placeholder={genericStrings.lastName}  onChangeText={(text) => this.setState({ lastName: text})} />
                                        </Item>
                                        {/* <Item rounded style={[Styles.inputItem]}>
                                            
                                        </Item> */}
                                        <Item rounded style={[Styles.inputItem]}>
                                            <Icon name="mail" style={{color: 'white'}} />
                                            <Input style={{color: 'white'}} placeholderTextColor='white'  placeholder={genericStrings.email} onChangeText={(text) => this.setState({ email: text})} />
                                        </Item>
                                        {/* <Item rounded style={[Styles.inputItem]}>
                                            <Icon name="call" style={{color: 'white'}} />
                                            <Input style={{color: 'white'}} placeholderTextColor='white'  placeholder={genericStrings.mobile} onChangeText={(text) => this.setState({ mobile: text})} />
                                        </Item> */}
                                        <Item rounded style={[Styles.inputItem]}>
                                            <Icon name="key" style={{color: 'white'}} />
                                            <Input style={{color: 'white'}} 
                                            secureTextEntry={this.state.showPassword}
                                            placeholderTextColor='white'  placeholder={genericStrings.password} onChangeText={(text) => this.setState({ password: text})} />
                                            <Icon name="eye" onPress={() => {
                                                this.setState({'showPassword': false})
                                                setTimeout(() => this.setState({'showPassword': true}), 1000);
                                            }} style={{color: 'white'}} />
                                        </Item>
                                        <Item rounded style={[Styles.inputItem]}>
                                            <Icon name="ios-contacts" style={{color: 'white'}} />
                                            <Picker
                                                style={[{ borderColor: 'black',color: Colours.white}]}
                                                mode="dropdown"
                                                iosIcon={<Icon name="ios-arrow-down" />}
                                                headerStyle={{ backgroundColor: "#b95dd3" }}
                                                headerBackButtonTextStyle={{ color: "#fff" }}
                                                headerTitleStyle={{ color: "#fff" }}
                                                selectedValue={this.state.userType}
                                                onValueChange={this.userType.bind(this)}
                                                >
                                                    <Picker.Item value={genericStrings.glam} label={genericStrings.glam} />
                                                    <Picker.Item value={genericStrings.emptor} label={genericStrings.emptor} />
                                            </Picker>
                                        </Item>
                                        {/* <Item rounded style={[Styles.inputItem]}>
                                            <Icon name="key" style={{color: 'white'}} />
                                            <Input style={{color: 'white'}} placeholderTextColor='white'  placeholder={genericStrings.confirmPassword} onChangeText={(text) => this.setState({ confirmPassword: text})} />
                                        </Item> */}
                                    </Body>
                                </CardItem>
                                <CardItem style={[Styles.transparent]}>
                                    <Body>
                                    <SpinnerButton
                                        block={true}
                                        onPress={async () => {
                                            await this.onSignupPress();
                                            
                                        }}
                                        label={strings.signup}
                                        btnClicked={this.state.btnClicked}
                                    />
                                        {/* <Button block onPress={() => this.onSignupPress()}>
                                            <Text>{strings.signup}</Text>
                                        </Button> */}
                                        <Text
                                        onPress={() => this.onLoginPress()}
                                        style={[Styles.textEnd]}
                                        >{signupScreenStrings.login}</Text>
                                    </Body>
                                </CardItem>
                            {/* </Card> */}
                        </Content>
                    </Container>
                </View>
            </ImageBackground>
            
        );
    }
}

export default SignupScreen;