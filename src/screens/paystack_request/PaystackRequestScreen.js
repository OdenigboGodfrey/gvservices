import React, { Component } from "react";
import { AppContext } from "../../../AppProvider";
import { Container, Content, Text, Button, Item, Input, Header, Card, CardItem, DatePicker, Picker, View, Icon, Left, Body,  } from "native-base";
import {  ScrollView } from "react-native";
import { Colours, getCurrency } from "../../utils";
import { Styles } from "./PaystackRequestStyle";
import { checkPending_Paystack, submitPin_Paystack, submitPhone_Paystack, submitOTP_Paystack, submitBirthday_Paystack } from "../../api/WalletAPI";
import { strings as AppStrings } from "../../strings";
import { ProgressDialog } from "react-native-simple-dialogs";
import { SpinnerButton } from "../../components/SpinnerButton";
import { sub } from "react-native-reanimated";
import { TouchableOpacity } from "react-native-gesture-handler";

/***
 * (rejected,pending, active,ended,all) bookings
 * 
 */
const {genericStrings} = AppStrings;

export default class PaystackRequestScreen extends Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            type: props.navigation.getParam('type', undefined),
            displayText: props.navigation.getParam('displayText', undefined),
            amount: props.navigation.getParam('amount', 0),
            reference: props.navigation.getParam('reference_id', undefined),
            pin: 0,
            otp :'',
            ExpMonth: 0,
            ExpYear: 0,
            CVC: 0,
            cardNo: 0,
            progressVisible: false,
            currency: 'NGN',
            btnClicked: false,
            months: [
                {name: 'January', value: '01'}, {name: 'Febuary', value: '02'}, 
                {name: 'March', value: '03'}, {name: 'April', value: '04'}, {name: 'May', value: '05'}, {name: 'June', value: '06'}, {name: 'July', value: '07'}, 
                {name: 'August', value: '08'}, {name: 'September', value: '09'}, 
                {name: 'October', value: '10'}, {name: 'November', value: '11'}, 
                {name: 'December', value: '12'}
            ],
            monthSelected: '',
        }
    }

    async componentDidMount() {
        
        // this.setState({reference: this.context.state.reference_id,});
        console.log("paystak request page", this.state.type, this.context.state.reference_id, this.state.reference);
    }

    set = (v) => {
        this.setState(v);
    }

    monthSelected = (text) => {
        this.setState({monthSelected: text});
    }

    onSubmitPress = async() => {
        this.setState({ progressVisible: true, btnClicked: true });
        let res = undefined;
        switch(this.state.type){
            case 'send_pin':
                res = await submitPin_Paystack({
                    pin: this.state.pin,
                    reference: this.state.reference,
                }, this.props.navigation, this.set, this.context,);
                break;
            case 'send_phone':
                res = await submitPhone_Paystack({
                    phone: this.state.phone,
                    reference: this.state.reference,
                }, this.props.navigation, this.set, this.context)
                break;
            case 'send_birthday':
                let birthday = 1995 + '-' + 12 + '-' + 23;
                //birthday: (this.state.year + '-' + this.state.monthSelected + '-' + ('0' + this.state.date).slice(-2)),
                res = await submitBirthday_Paystack({
                    birthday: birthday,
                    reference: this.state.reference,
                }, this.props.navigation, this.set, this.context);
                console.log("paystackrequest res", res);
                break;
            case 'send_otp':
                res = await submitOTP_Paystack({
                    otp : this.state.otp ,
                    reference: this.state.reference,
                }, this.props.navigation, this.set, this.context);
                break;
            default:
                break;
        }
        this.setState({  progressVisible: false, btnClicked: false, ...this.state, ...res });
    }

    setDate = (date) => {
        this.setState({birthday: date});
    }

    render() {
        return (
            <Container>
                <Header androidStatusBarColor={Colours.darkmagenta} style={{backgroundColor: Colours.darkmagenta}}>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={{textAlign: 'center', textAlignVertical: 'center', color: 'white'}}>
                            {/* Deposit */}Payment
                        </Text>
                    </Body>
                    
                </Header>
                <Content contentContainerStyle={{flex: 1}}>
                    
                    <ScrollView 
                    contentContainerStyle={{flexGrow: 1, paddingBottom: 10, paddingTop: 10}}
                    >
                        <Card style={{flex: 1}}>
                            { this.state.type == 'send_pin' &&
                                <CardItem>
                                    <Item style={[Styles.item]}>
                                        <Input style={[Styles.input]}

                                            placeholder={"Enter Pin"}
                                            maxLength={4}
                                            keyboardType = 'numeric'
                                            onChangeText={text => this.setState({ pin: text })}
                                        />
                                    </Item>
                                </CardItem>
                            }
                           {  this.state.type == 'send_phone' &&
                                <CardItem>
                                    <Item style={[Styles.item]}>
                                        <Input style={[Styles.input]}
                                            placeholder={"Enter Phone Number"}
                                            keyboardType = 'numeric'
                                            onChangeText={text => this.setState({ phone: text })}
                                        />
                                    </Item>
                                </CardItem>
                            }
                            { this.state.type == 'send_birthday' &&
                                <CardItem>
                                    <Item style={[Styles.item]}>
                                        <View style={{width: '100%', borderColor: Colours.gray, borderWidth: 1, borderRadius: 10}}>
                                            <Picker
                                                mode="dropdown"
                                                iosIcon={<Icon name="ios-arrow-down" />}
                                                headerStyle={{backgroundColor: '#b95dd3'}}
                                                headerBackButtonTextStyle={{color: '#fff'}}
                                                style={{marginRight: 10, borderWidth: 1, borderColor: Colours.gray}}
                                                headerTitleStyle={{color: '#fff'}}
                                                textStyle={{color: 'white'}}
                                                selectedValue={this.state.monthSelected}
                                                onValueChange={this.monthSelected.bind(this)}>
                                                {this.state.months.map((month,index) => {
                                                    return (
                                                        <Picker.Item
                                                        key={index}
                                                        label={month.name}
                                                        value={month.value}
                                                        />
                                                    );
                                                })}
                                            </Picker>
                                        </View>
                                    </Item>
                                </CardItem>
                            }
                            { this.state.type == 'send_birthday' &&
                                <CardItem>
                                    <Item style={[Styles.item]}>
                                        <Input 
                                        style={[Styles.input]} 
                                        keyboardType={'numeric'} 
                                        placeholder={'01'} 
                                        maxLength={2}
                                        onChangeText={(text) => this.setState({date: text})}
                                        />
                                    </Item>
                                </CardItem>
                            }
                            { this.state.type == 'send_birthday' &&
                                <CardItem>
                                    <Item style={[Styles.item]}>
                                        <Input 
                                            style={[Styles.input]} 
                                            keyboardType={'numeric'} 
                                            placeholder={'1990'} 
                                            maxLength={4}
                                            onChangeText={(text) => this.setState({year: text})}
                                            />
                                    </Item>
                                </CardItem>
                            }
                            { this.state.type == 'send_otp' &&
                                <CardItem>
                                    <Item style={[Styles.item]}>
                                        <Input style={[Styles.input]}
                                            placeholder={"Enter OTP"}
                                            keyboardType = 'numeric'
                                            onChangeText={text => this.setState({ otp: text })}
                                        />
                                    </Item>
                                </CardItem>
                            }
                            <Text style={{alignSelf: 'center', width:'80%', color: 'green', marginBottom: 10}}>
                                {
                                    this.state.displayText
                                }
                            </Text>
                            <SpinnerButton
                                block
                                label={"Pay " + getCurrency() + " " + this.state.amount}
                                style={{backgroundColor: Colours.green, width: '80%', alignSelf: 'center', borderRadius: 10}}
                                onPress={this.onSubmitPress}
                                btnClicked={this.state.btnClicked}
                            />
                            <TouchableOpacity style={{alignSelf: 'center', alignItems: 'center'}}>
                                <Text style={{paddingTop: 10, fontSize: 18}}>Cancel</Text>
                            </TouchableOpacity>
                            
                        </Card>
                    </ScrollView>
                </Content>
                <ProgressDialog
                    visible={this.state.progressVisible}
                    title=""
                    message="Please, wait..."
                />
            </Container>
        );
    }
}