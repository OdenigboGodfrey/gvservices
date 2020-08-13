import React, { Component } from "react";
import { Container, Content, Item, Picker, Header, View, Text, Icon, Input, Button, Spinner, Left, Body } from "native-base";
import { getServiceCategories, getServiceCategoriesFields } from "../../api/GetApiFactorsAPI";
import { AppContext } from "./../../../AppProvider";
import { SpinnerButton } from "../../components/SpinnerButton";
import { saveGlamRate } from "../../api/GlamRatesAPI";
import { getId, Colours } from "../../utils";
import { Styles } from "./AddServiceStyle";
import { strings as AppStrings } from "../../strings";
import { Platform } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const {addServiceString, genericStrings} = AppStrings;
const strings = addServiceString;

export default class AddServiceScreen extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            services: [],
            serviceSelected: undefined,
            serviceFields: [],
            serviceFieldSelected: undefined,
            showServiceFields: false,
            showInput: false,
            btnClicked: false,
            animating: false,
        }
    }

    async componentDidMount() {
        this.set({animating: true});
        await getServiceCategories(this.context, this.set);
        this.set({animating: false});
    }

    set = (v) => {
        this.setState(v);
    }

    serviceSelected = async(value) => {
        this.setState({serviceSelected: value});
        if (value != -1) {
            this.set({animating: true, showInput: false});
            await getServiceCategoriesFields(value, this.context, this.set);
            this.set({showServiceFields: true, animating: false});
        }
        else if(value == -1 && this.state.serviceFields.length > 0) {
            this.set({showServiceFields: false});
        }
        
    }

    serviceFieldSelected = async(value) => {
        this.setState({serviceFieldSelected: value, });
        if (value != -1) {
            this.set({showInput: true});
        }
        else {
            this.set({showInput: false});
        }
    }

    onSavePress = async() => {
        this.set({btnClicked: true});
        await saveGlamRate({
            glam_id: getId(),
            category_id: this.state.serviceSelected,
            category_rate_id: this.state.serviceFieldSelected,
            amount: this.state.charge
        },);
        this.set({btnClicked: false});
    }

    render() {
        return (
            <Container>
                <Content contentContainerStyle={{flex: 1}}>
                    <Header style={{backgroundColor: Colours.secondaryBlack,}} androidStatusBarColor={Colours.secondaryBlack}>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name={(Platform.OS == 'android') ? 'arrow-back' : 'ios-arrow-back'} />
                            </Button>
                        </Left>
                        <Body>
                            <Text style={{color: 'white', fontWeight: 'bold'}}>{strings.headerText}</Text>
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
                            <Spinner style={[Styles.spinner]} animating={this.state.animating} />
                            <Item>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="ios-arrow-down" />}
                                    headerStyle={{ backgroundColor: "#fff" }}
                                    headerBackButtonTextStyle={{ color: "#fff" }}
                                    headerTitleStyle={{ color: "#fff" }}
                                    style={{ color: "#fff" }}
                                    selectedValue={this.state.serviceSelected}
                                    onValueChange={this.serviceSelected.bind(this)}
                                    >
                                        <Picker.Item label={strings.service} value={-1} />
                                        {
                                            this.state.services.map(service => {
                                                return <Picker.Item key={service.id} label={service.name} value={service.id} />
                                            })
                                        }
                                    {/* <Picker.Item label="Male" value="male" />
                                    <Picker.Item label="Female" value="female" /> */}
                                </Picker>
                            </Item>
                            {
                                this.state.showServiceFields != 0 &&
                                <Item>
                                    <Picker
                                        mode="dropdown"
                                        iosIcon={<Icon name="ios-arrow-down" />}
                                        headerStyle={{ backgroundColor: "#b95dd3" }}
                                        headerBackButtonTextStyle={{ color: "#fff" }}
                                        headerTitleStyle={{ color: "#fff" }}
                                        style={{ color: "#fff" }}
                                        selectedValue={this.state.serviceFieldSelected}
                                        onValueChange={this.serviceFieldSelected.bind(this)}
                                        >
                                            <Picker.Item label={strings.subService} value={-1} />
                                            {
                                                this.state.serviceFields.map(service => {
                                                    return <Picker.Item key={service.id} label={service.title} value={service.id} />
                                                })
                                            }
                                        {/* <Picker.Item label="Male" value="male" />
                                        <Picker.Item label="Female" value="female" /> */}
                                    </Picker>
                            </Item>
                            
                            }
                            {
                                (this.state.showServiceFields && this.state.showInput) &&
                                <View style={{width: '100%'}}>
                                    <Item>
                                        <Input 
                                        placeholder={'Enter Amount'}
                                        keyboardType={'number-pad'}
                                        onChangeText={(text) => this.set({charge: text})}
                                        style={{ color: "#fff" }}
                                        placeholderTextColor={Colours.white}
                                        />
                                        
                                    </Item>
                                    <SpinnerButton 
                                        rounded={true}
                                        label={'Save'}
                                        style={[Styles.spinnerButton, {backgroundColor: Colours.darkmagenta}]}
                                        btnClicked={this.state.btnClicked}
                                        onPress={this.onSavePress}
                                    />
                                </View>
                                
                            }
                            
                        </View>
                    </LinearGradient>
                </Content>
            </Container>
        );
    }
}