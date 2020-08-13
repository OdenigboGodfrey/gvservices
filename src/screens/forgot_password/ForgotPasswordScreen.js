import React, { Component } from "react";
import { Header, Container, Content, Card, CardItem, Text, Body, Left, Thumbnail, Icon, Button, View, Grid, Col, Input, Item, Form, Right } from "native-base";
import { Styles } from "./ForgotPasswordStyle";
import { strings as AppStrings, } from "./../../strings";
import { backgroundImage01, glamIcon01 } from "../../utils.js";
import { ImageBackground, Image } from "react-native";


const { forgotPasswordStrings, genericStrings, signupScreenStrings } = AppStrings;
const strings = forgotPasswordStrings;

export default class ForgotPasswordScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: ''
        }
    }

    onResetPress = () => {
        alert('Reset press');
    }

    onLoginPress() {
        alert('Login press');
    }

    render() {
        return(
            <ImageBackground source={backgroundImage01} style={[Styles.backgroundImage]}>
                <View style={[Styles.backgroundView]}>
                    <Container  style={{flex: 1, width: '100%',backgroundColor: 'transparent'}}>
                        <Content contentContainerStyle={{ flex: 1}}>
                            {/* <Card> */}
                                <CardItem style={[Styles.transparent]}>
                                    <Body style={[Styles.topImage,]}>
                                        <Image source={glamIcon01}
                                            style={[Styles.topImage]}
                                        />
                                    </Body>
                                </CardItem>
                                <View style={[Styles.transparent, { flex: 1, marginTop: 200, }]}>
                                    <Body style={{}}>
                                        <Item rounded style={[Styles.inputItem, {marginBottom: 10 }]}>
                                            <Icon name="mail" style={{color: 'white'}} />
                                            <Input style={{color: 'white'}} placeholderTextColor='white' placeholder={genericStrings.email} onChangeText={(text) => this.setState({ email: text})} />
                                        </Item>
                                        <Button block onPress={() => this.onResetPress()}>
                                            <Text>{strings.reset}</Text>
                                        </Button>
                                        <Text
                                        onPress={() => this.onLoginPress()}
                                        style={[Styles.textEnd]}
                                        >{signupScreenStrings.login}</Text>
                                    </Body>
                                </View>
                            {/* </Card> */}
                        </Content>
                    </Container>
                </View>
            </ImageBackground>
        );
    }
}

// const { forgotPasswordStrings, genericStrings } = AppStrings;
// const strings = forgotPasswordStrings;

// class ForgotPasswordScreen extends Component {

// }