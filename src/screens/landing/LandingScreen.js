import React, { Component } from "react";
import { Image, ImageBackground } from "react-native";
import { Container, Content, Text, Button, View } from "native-base";
import { Styles } from "./LandingStyle";
import { strings as AppStrings, } from "../../strings";
import { getData } from "./../../storage/MainStorage";
import { backgroundImage01, glamIcon01, igIcon01, fbIcon01, googleIcon01, POSITIVE } from "../../utils";
import { handleNavigation } from "./../../api/AuthAPI";
import { AppContext } from "./../../../AppProvider";

const {splashScreenStrings, signupScreenStrings, loginScreenStrings} = AppStrings;
const strings = splashScreenStrings;

class LandingScreen extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
    }
    state = {
    }

    async componentDidMount() {
        let res = await getData('user_data');
        if (res.status == POSITIVE) {
            //user previously logged in
            let user_data = JSON.parse(res  .data);
            console.log("landing", user_data, this.context, "isEmptor",  await getData('isEmptorMode'));
            handleNavigation((user_data), this.props.navigation, this.context, true);
        }
    }

    onGoogleLoginPress() {

    }

    onFbLoginPress() {

    }

    onIgLoginPress() {

    }

    onLoginPress() {
        this.props.navigation.navigate('Login');
    }

    onSignupPress() {
        console.log("clicked")
        this.props.navigation.navigate('Signup');
    }

    onTermsOfServicePress() {

    }

    onPrivacyPolicyPress() {

    }

    render() {
        return(
            <ImageBackground source={backgroundImage01} style={[Styles.backgroundImage]}>
                <View style={[Styles.backgroundView]}>
                    <Container style={[{flex: 1, width: '100%'}, Styles.transparent]}>
                        <Content style={[Styles.transparent, { flexDirection: 'column', flex: 1}]} contentContainerStyle={{ flex: 1 }}>
                            
                            <Image source={glamIcon01}

                                style={[Styles.topImage, ]}
                            />
                            <View style={{flex: 2, flexDirection: 'column-reverse', width: 270, alignSelf: 'center', marginTop: 20}}>
                                <View>
                                    <Button rounded style={[Styles.btn, Styles.btnGoogle]}
                                    onPress={() => this.onGoogleLoginPress()}
                                    >
                                        <Image 
                                            source={googleIcon01} 
                                            style={[Styles.btnIcon]}
                                        />
                                        <Text>{strings.google}</Text>
                                    </Button>
                                    <Button rounded style={[Styles.btn, Styles.btnFacebook]}
                                    onPress={() => this.onFbLoginPress()}>
                                        <Image 
                                            source={fbIcon01} 
                                            style={[Styles.btnIcon]}
                                        />
                                        <Text>{strings.fb}</Text>
                                    </Button>
                                    {/* <Button rounded style={[Styles.btn, , Styles.btnInstagram]}
                                    onPress={() => this.onIgLoginPress}>
                                        <Image 
                                            source={igIcon01} 
                                            style={[Styles.btnIcon]}
                                        />
                                        <Text style={{color: 'black'}}>{strings.ig}</Text>
                                    </Button> */}
                                    <View style={[{flexDirection: 'row', marginBottom: 15}]}>
                                        <Text style={[Styles.text03, { alignSelf: 'flex-start'}]}
                                        onPress={() => this.onLoginPress()}>{loginScreenStrings.loginText}</Text>
                                        <Text style={[Styles.text03, { alignSelf: 'center'}]}>|</Text>
                                        <Text style={[Styles.text03, { alignSelf: 'flex-end'}]}
                                        onPress={() => this.onSignupPress()}>{signupScreenStrings.signup}</Text>
                                    </View>
                                    <View style={[Styles.TermsOfServiceView]}>
                                        <Text style={[Styles.text01]}>By Using </Text>
                                        <Text style={[Styles.text02]}>GV Services</Text>
                                        <Text style={[Styles.text01]}> you agree to our </Text>
                                    </View>
                                    <View style={[Styles.TermsOfServiceView]}>
                                        <Text style={[Styles.text02]}
                                        onPress={() => this.onTermsOfServicePress()}>Terms of Service</Text>
                                        <Text style={[Styles.text01]}> and </Text>
                                        <Text style={[Styles.text02]}
                                        onPress={() => this.onPrivacyPolicyPress()}>Privacy Policy</Text>
                                    </View>
                                </View>
                                
                            </View>
                        </Content>
                    </Container>
                    
                </View>
            </ImageBackground>
        );
    }
}

export default LandingScreen;