import React, { Component } from "react";
import { AppContext } from "../../../AppProvider";
import { Container, Content, Text, Button, Item, Input, Header, Card, CardItem, CheckBox, View, Picker, Icon, Left, Body,  } from "native-base";
import {  ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { Colours, setContext, getCurrency } from "../../utils";
import { Styles } from "./DepositStyle";
import { init_Paystack, getBanks_Paystack, deposit } from "../../api/WalletAPI";
import { strings as AppStrings } from "../../strings";
import { ProgressDialog } from "react-native-simple-dialogs";
import { SpinnerButton } from "./../../components/SpinnerButton";
import WebView from "react-native-webview";
import LinearGradient from "react-native-linear-gradient";

const {genericStrings} = AppStrings;
const paystackKey = 'pk_test_8f6a255c6f6bc1554b027e197c08b2c2e72c5097';
const paystackSecretKey = 'sk_test_f9834df4ac267fdf7ebb3630bb29f4da35b73965';

export default class DepositScreen extends Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            btnClicked: false,
            amount: 0,
            ExpMonth: 0,
            ExpYear: 0,
            CVC: 0,
            cardNo: 0,
            bank: '',
            account_number: '',
            progressVisible: false,
            currency: 'NGN',
            byCard: true,
            bankSelected: '',
            banks: ['Loading Banks...'],
            accountNumber: '',
            amountSet: false,
            webviewVisible: false,
        }
    }

    async componentDidMount() {
        setContext(this.context);
        /*** create a reference for this transaction, remove [+, -, ., white space,] */
        let date = new Date();
        date = date.getDate() + "_" + date.getMonth() + "_" + date.getFullYear() + "_" + date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds();
        
        let ref = (this.context.state.user_data.first_name +'_'+ this.context.state.user_data.last_name + '_' + this.context.state.user_data.phone + '_').replace('-','_').replace(' ','_').replace('+','_').replace('.','_') + date;
        this.set( { ref: ref, });
        console.log("ref", ref);
    }

    set = (v) => {
        this.setState(v);
    }


    render() {
        return (
            <Container>
                <Header 
                style={{backgroundColor: Colours.secondaryBlack}} 
                androidStatusBarColor={Colours.secondaryBlack}
                >
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                        <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                      <Text style={{textAlign: 'center', textAlignVertical: 'center', color: 'white'}}>
                          Deposit
                      </Text>
                    </Body>
                </Header>
                <Content contentContainerStyle={{flex: 1}}>
                  <LinearGradient
                      colors={[Colours.secondaryBlack, Colours.black]}
                      style={{
                      flex: 1,
                      height: Dimensions.get('screen').height,
                      paddingRight: 10,
                      paddingLeft: 10,
                  }}>
                      {
                          !this.state.webviewVisible &&
                          <Item style={{
                            marginTop: 10, 
                            alignSelf: 'center', 
                            backgroundColor: 'transparent'
                            }}
                            
                            >
                              <Input 
                                  placeholder={'Amount'} 
                                  keyboardType={'numeric'} 
                                  style={{color: Colours.white}}
                                  placeholderTextColor={Colours.white}
                                  onChangeText={text => this.setState({amount: text})} 
                              />
                          </Item>
                      }
                      {   !this.state.webviewVisible &&
                          <SpinnerButton 
                              label={'Pay'}
                              rounded
                              style={{
                                width: '80%', 
                                alignSelf: 'center', 
                                marginTop: 10, 
                                backgroundColor: Colours.darkmagenta,
                              }}
                              textStyle={{fontWeight: 'bold'}}
                              btnClicked={this.state.btnClicked}
                              onPress={() => this.setState({webviewVisible: true})}
                          />
                      } 
                      {
                          this.state.webviewVisible &&
                          <WebView
                              style={{width: '100%', height: '90%'}} 
                              containerStyle={{width: '100%', height: '100%'}} 
                              
                              source={{
                                html: this.getHTML()
                              }}
                              injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=width, initial-scale=0.5, maximum-scale=0.5, user-scalable=2.0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
                              scalesPageToFit={false}
                              onMessage={(e) => {
                                  this.messageReceived(e.nativeEvent.data);
                                }}
                          />
                      }  
                    </LinearGradient>
                </Content>
                <ProgressDialog
                    visible={this.state.progressVisible}
                    title=""
                    message="Please, wait..."
                />
            </Container>
        );
    }


  getHTML = () => {
    return (`
    <html>
      <head>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
      </head>
      
        <body style="background-color:#fff;height:100vh ">

          <div style="width: 50%; margin: 0 auto;margin-top: 250px">
            <table class="table table-striped">
              <tbody>
                <tr>
                  <th>Email</th>
                  <td>`+this.context.state.user_data.email+`</td>
                </tr>
                <tr>
                  <th>Phone</th>
                  <th>`+this.context.state.user_data.phone+`</th>
                </tr>
                <tr>
                  <th>Amount</th>
                  <th>`+ this.state.amount +`</th>
                </tr>
              </tbody>
            </table>
            <button type="button" class="btn btn-success" onclick="payWithPaystack()" style="width: 220px">
              Pay  `+ getCurrency() + ' ' +(this.state.amount) + `
            </button>
          </div>
        </body>
        <script src="https://js.paystack.co/v1/inline.js"></script>
      <script>
        function payWithPaystack(){
          var handler = PaystackPop.setup({
            key: '`+ paystackKey +`',
            email: '`+ this.context.state.user_data.email +`',
            amount: `+ (this.state.amount * 100) +`,
            currency: "NGN",
            ref: '` + this.state.ref + `',
            metadata: {
              custom_fields: [
                  {
                      display_name: "Mobile Number",
                      variable_name: "mobile_number",
                      value: "` + this.context.state.user_data.phone + `"
                  }
              ]
            },
            callback: function(response){
                //alert('success. transaction ref is ' + response.reference);
                var resp = {event:'successful', transactionRef:response, reference: response.reference};
                window.ReactNativeWebView.postMessage(JSON.stringify(resp))
            },
            onClose: function(){
                //alert('window closed');
                var resp = {event:'cancelled', reference: '`+this.state.ref+`'};
                window.ReactNativeWebView.postMessage(JSON.stringify(resp))
            }
          });
          handler.openIframe();
        }
      </script>

    `);
  } 

  messageReceived = async (data) => {
    var webResponse = JSON.parse(data);
    switch (webResponse.event) {
      case "cancelled":
          /** was cancelled */
          console.log("was cancelled");
        break;

      case "successful":
        const reference = webResponse.reference;

        await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
          method: "GET",
          headers: new Headers({
            Authorization: "Bearer " + paystackSecretKey,
          }),
        })
          .then((response) => response.json())
          .then(async (data) => {
            /** was verified successfully */
            if (data.data.status == 'success') {
              /** payment was verified post to deposit */
              await deposit({
                amount: this.state.amount,
                reference_id: this.state.ref,
              }, this.set, this.context);
            }
            
          })
          .catch((error) => {
            // props.onCancel();
            console.log("failed verified", JSON.stringify(error));
          });
        break;

      default:
        console.warn('Unhandled event', webResponse)
        break;
    }
  };
}
  