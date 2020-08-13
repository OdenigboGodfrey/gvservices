import React, { Component } from "react";
import { Container, Content, Item, Picker, Header, View, Text, Icon, Input, Button, Spinner, Left, Body } from "native-base";
import { getServiceCategories, getServiceCategoriesFields } from "../../api/GetApiFactorsAPI";
import { AppContext } from "./../../../AppProvider";
import { SpinnerButton } from "../../components/SpinnerButton";
import { changePassword } from "../../api/AuthAPI";
import { getId, Colours } from "../../utils";
import { Styles } from "./ChangePasswordStyle";
import { strings as AppStrings } from "../../strings";
import { Platform } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const {changePasswordStrings, genericStrings} = AppStrings;
const strings = changePasswordStrings;

export default class ChangePasswordScreen extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            oldPassword: '',
            newPassword: '',
            cofirmPassword: '',
            btnClicked: false
        }
    }

    async componentDidMount() {
    }

    set = (v) => {
        this.setState(v);
    }

    onSavePress = async() => {
        this.set({btnClicked: true});
        
        await changePassword({
            old_password: this.state.oldPassword,
            new_password: this.state.newPassword,
            confirm_password: this.state.confirmPassword,
        }, this.props.navigation, this.context);
        
        this.set({btnClicked: false});
    }

    render() {
        return (
            <Container>
                <Content contentContainerStyle={{flex: 1}}>
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
                            <Text style={{color: 'white', fontWeight: 'bold'}}>{strings.changePassword}</Text>
                        </Body>
                    </Header>
                    <LinearGradient
                        colors={[Colours.secondaryBlack, Colours.black]}
                        style={{
                        flex: 1,
                        height: '100%',
                        paddingRight: 10,
                        paddingLeft: 10,
                    }}>
                        <View style={{ flex: 1, alignItems: 'center', paddingTop: '30%', padding: 10}}>
                            <Item style={[Styles.item]}>
                                <Input 
                                    placeholder={strings.oldPassword} 
                                    secureTextEntry={true} 
                                    onChangeText={text => this.setState({oldPassword: text})}
                                    style={{color: Colours.white}}
                                    placeholderTextColor={Colours.white}
                                />
                            </Item>
                            <Item style={[Styles.item]}>
                                <Input 
                                    placeholder={strings.newPassword} 
                                    secureTextEntry={true} 
                                    onChangeText={text => this.setState({newPassword: text})}
                                    style={{color: Colours.white}}
                                    placeholderTextColor={Colours.white}
                                />
                            </Item>
                            <Item style={[Styles.item]}>
                                <Input 
                                    placeholder={strings.confirmPassword} 
                                    secureTextEntry={true} 
                                    onChangeText={text => this.setState({confirmPassword: text})}
                                    style={{color: Colours.white}}
                                    placeholderTextColor={Colours.white}
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
                    </LinearGradient>
                </Content>
            </Container>
        );
    }
}