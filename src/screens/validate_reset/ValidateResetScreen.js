import React, { Component } from "react";
import { Container, Content, Item, Picker, Header, View, Text, Icon, Input, Button, Spinner, Left, Body, Toast } from "native-base";
import { getServiceCategories, getServiceCategoriesFields } from "../../api/GetApiFactorsAPI";
import { AppContext } from "./../../../AppProvider";
import { SpinnerButton } from "../../components/SpinnerButton";
import { validate, initReset } from "../../api/AuthAPI";
import { getId, Colours } from "../../utils";
import { Styles } from "./ValidateResetStyle";
import { strings as AppStrings } from "../../strings";
import { Platform } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const {validateResetStrings, genericStrings} = AppStrings;
const strings = validateResetStrings;

export default class ValidateResetScreen extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            email: props.navigation.getParam('email', ''),
            token: '',
            btnClicked: false
        }
    }

    async componentDidMount() {
        console.log(this.props.navigation);
        let message = this.props.navigation.getParam('message', '');
        if (message != '') {    
            Toast.show({
                text: message,
                type: 'success',
                buttonText: genericStrings.dismiss,
            });
        }
    }

    set = (v) => {
        this.setState(v);
    }

    onResendToken = async() => {
        await initReset({
            email: this.state.email,
            resend: true,
        }, this.props.navigation, this.context, this.context.state.userType);
    }

    onSavePress = async() => {
        this.set({btnClicked: true});
        
        await validate({
            email: this.state.email,
            token: this.state.token,
        }, this.props.navigation, this.context);

        this.set({btnClicked: false});
    }

    render() {
        return (
            <Container>
                <Content contentContainerStyle={{flex: 1}}>
                <Header style={{backgroundColor: Colours.darkmagenta}} androidStatusBarColor={Colours.darkmagenta}>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name={(Platform.OS == 'android') ? 'arrow-back' : 'ios-arrow-back'} />
                            </Button>
                        </Left>
                        <Body>
                            <Text style={{color: 'white', fontWeight: 'bold'}}>{strings.headerText}</Text>
                        </Body>
                    </Header>
                    <View style={{ flex: 1, alignItems: 'center', paddingTop: '30%', padding: 10}}>
                        <Item rounded style={[Styles.item]}>
                            <Input 
                                placeholder={strings.enterToken}
                                keyboardType={'numeric'}
                                onChangeText={text => this.setState({token: text})} 
                            />
                        </Item>
                        <SpinnerButton 
                            label={'Submit'}
                            rounded
                            style={{width: '80%', alignSelf: 'center', marginTop: 10, backgroundColor: Colours.darkmagenta}}
                            onPress={this.onSavePress}
                            btnClicked={this.state.btnClicked}
                        />
                        <TouchableOpacity onPress={this.onResendToken} style={{alignItems: 'center'}}>
                            <Text>Resend Code</Text>
                        </TouchableOpacity>
                    </View>
                </Content>
            </Container>
        );
    }
}