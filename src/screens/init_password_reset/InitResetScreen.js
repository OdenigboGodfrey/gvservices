import React, { Component } from "react";
import { Container, Content, Item, Picker, Header, View, Text, Icon, Input, Button, Spinner, Left, Body } from "native-base";
import { getServiceCategories, getServiceCategoriesFields } from "../../api/GetApiFactorsAPI";
import { AppContext } from "./../../../AppProvider";
import { SpinnerButton } from "../../components/SpinnerButton";
import { initReset } from "../../api/AuthAPI";
import { getId, setEmptorMode, setContext, Colours } from "../../utils";
import { Styles } from "./InitResetStyle";
import { strings as AppStrings } from "../../strings";
import { Platform } from "react-native";

const {initResetStrings, genericStrings} = AppStrings;
const strings = initResetStrings;

export default class InitResetScreen extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            userType: genericStrings.glam,
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
        this.userType(this.state.userType);
        await initReset({
            email: this.state.email,
        }, this.props.navigation, this.context, this.state.userType);
        this.set({btnClicked: false});
    }

    userType = text => {
        setContext(this.context);
        if (text == genericStrings.glam) {
          setEmptorMode(false);
        } else {
          setEmptorMode(true);
        }
        this.setState({userType: text});
      };

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
                                placeholder={genericStrings.emailAddress}
                                keyboardType={'email-address'}
                                onChangeText={text => this.setState({email: text})} 
                            />
                        </Item>
                        <Item rounded style={[Styles.item]}>
                            <Icon name="ios-contacts" style={{color: 'white'}} />
                            <Picker
                                style={[{borderColor: 'black', color: Colours.grey}]}
                                mode="dropdown"
                                iosIcon={<Icon name="ios-arrow-down" />}
                                headerStyle={{backgroundColor: '#b95dd3'}}
                                headerBackButtonTextStyle={{color: Colours.grey}}
                                headerTitleStyle={{color: Colours.grey}}
                                selectedValue={this.state.userType}
                                onValueChange={this.userType.bind(this)}>
                                <Picker.Item
                                value={genericStrings.glam}
                                label={genericStrings.glam}
                                />
                                <Picker.Item
                                value={genericStrings.emptor}
                                label={genericStrings.emptor}
                                />
                            </Picker>
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