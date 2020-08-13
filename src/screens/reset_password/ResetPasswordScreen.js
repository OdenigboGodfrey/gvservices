import React, { Component } from "react";
import { Container, Content, Item, Picker, Header, View, Text, Icon, Input, Button, Spinner, Left, Body, Toast } from "native-base";
import { getServiceCategories, getServiceCategoriesFields } from "../../api/GetApiFactorsAPI";
import { AppContext } from "./../../../AppProvider";
import { SpinnerButton } from "../../components/SpinnerButton";
import { reset } from "../../api/AuthAPI";
import { getId, Colours } from "../../utils";
import { Styles } from "./ResetPasswordStyle";
import { strings as AppStrings } from "../../strings";
import { Platform } from "react-native";

const {changePasswordStrings, genericStrings} = AppStrings;
const strings = changePasswordStrings;

export default class ResetPasswordScreen extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            email: props.navigation.getParam('email', ''),
            newPassword: '',
            cofirmPassword: '',
            btnClicked: false
        }
    }

    async componentDidMount() {
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

    onSavePress = async() => {
        this.set({btnClicked: true});
        await reset({
            email: this.state.email,
            new_password: this.state.newPassword,
            confirm_password: this.state.confirmPassword,
        }, this.props.navigation, this.context);
        this.set({btnClicked: false});
    }

    render() {
        return (
            <Container>
                <Content contentContainerStyle={{flex: 1}}>
                    <Header style={{backgroundColor: Colours.darkmagenta}} androidStatusBarColor={Colours.darkmagenta}>
                        <Text style={{color: 'white', fontWeight: 'bold', textAlign: 'center', textAlignVertical: 'center'}}>{strings.changePassword}</Text>
                    </Header>
                    <View style={{ flex: 1, alignItems: 'center', paddingTop: '30%', padding: 10}}>
                        <Item rounded style={[Styles.item]}>
                            <Input 
                                placeholder={strings.newPassword}
                                onChangeText={text => this.setState({newPassword: text})} 
                                secureTextEntry={true}
                            />
                        </Item>
                        <Item rounded style={[Styles.item]}>
                            <Input 
                                placeholder={strings.confirmPassword} 
                                onChangeText={text => this.setState({confirmPassword: text})} 
                                secureTextEntry={true}
                            />
                        </Item>
                        <SpinnerButton 
                            label={'Submit'}
                            rounded
                            style={{width: '80%', alignSelf: 'center', marginTop: 10, backgroundColor: Colours.darkmagenta}}
                            onPress={this.onSavePress}
                            btnClicked={this.state.btnClicked}
                        />
                    </View>
                </Content>
            </Container>
        );
    }
}