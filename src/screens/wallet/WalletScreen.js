import React, { Component } from "react";
import { Container, Content, Item, Picker, Header, View, Text, Icon, Input, Button, Spinner, Left, Body, CardItem, Card } from "native-base";
import { getServiceCategories, getServiceCategoriesFields } from "../../api/GetApiFactorsAPI";
import { AppContext } from "./../../../AppProvider";
import { SpinnerButton } from "../../components/SpinnerButton";
import { changePassword } from "../../api/AuthAPI";
import { getId, Colours, getEmptorMode, getCurrency } from "../../utils";
import { Styles } from "./WalletStyle";
import { strings as AppStrings } from "../../strings";
import { Platform, ScrollView, RefreshControl, Dimensions } from "react-native";
import { get_my_wallet } from "../../api/WalletAPI";
import TransactionHistory from "../../components/TransactionHistory";
import LinearGradient from "react-native-linear-gradient";

const {changePasswordStrings, genericStrings} = AppStrings;
const strings = changePasswordStrings;

export default class WalletScreen extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            btnClicked: false,
            balance: 0,
            transactionHistory: [],
            spinnerActive: true,
            refreshing: false,
        }
    }

    async componentDidMount() {
        this.setState({spinnerActive: true});
        await get_my_wallet(this.set, this.context);
        this.setState({spinnerActive: false});
    }

    set = (v) => {
        this.setState(v);
    }

    onRefresh = async() => {
        await get_my_wallet(this.set, this.context);
    }


    render() {
        return (
            <Container>
                <Header
                    androidStatusBarColor={Colours.secondaryBlack}
                    style={{backgroundColor: Colours.secondaryBlack}}>
                    <Text
                        style={[
                        {
                            alignSelf: 'stretch',
                            textAlign: 'left',
                            textAlignVertical: 'center',
                            color: 'white',
                            fontSize: 21,
                            fontWeight: 'bold'
                        },
                        ]}>
                        My Wallet
                    </Text>
                </Header>
                <Content contentContainerStyle={{flex: 1}}>
                    <LinearGradient
                        colors={[Colours.secondaryBlack, Colours.black]}
                        style={{
                        flex: 1,
                        height: Dimensions.get('screen').height,
                        paddingRight: 10,
                        paddingLeft: 10,
                        }}
                    >
                        {
                            this.state.spinnerActive ?
                            <Spinner color={Colours.white} style={{alignSelf: 'center', justifyContent: 'center', flex: 1}} />
                            :
                            <Card style={{flex: 1, backgroundColor: 'transparent'}}>
                                <CardItem style={{alignItems: 'center', backgroundColor: 'transparent'}}>
                                    <View 
                                    style={{
                                        height:100, 
                                        width:200, 
                                        marginTop:20,
                                        marginLeft:50, 
                                        borderWidth:2, 
                                        borderRadius:10, 
                                        backgroundColor:Colours.darkmagenta, 
                                        justifyContent: 'center'}}
                                        >
                                    
                                        <View style={{flex:2}}>
                                                <Text style={{textAlign:'center',marginTop:20, fontSize:18, color:'#fff'}}>
                                                    {getCurrency()+' '} 
                                                    {
                                                    (this.state.balance != "") ? parseFloat(this.state.balance).toFixed(2) : 0
                                                    }
                                                </Text>
                                            </View>
                                            <View style={{flex:1,textAlign:'center'}}>
                                                <Text style={{textAlign:'center',color:'#fff' }}>Balance</Text>
                                            </View>
                                        </View>
                                </CardItem>
                                <CardItem style={{backgroundColor: 'transparent'}}>
                                    <Button 
                                        block 
                                        style={{width: '100%', backgroundColor: Colours.darkmagenta}} 
                                        onPress={()=>this.props.navigation.navigate('Deposit')}>
                                        <Text>Deposit</Text>
                                    </Button>
                                </CardItem>
                                <View style={{ width: '100%', marginBottom: 100}}>
                                    
                                    <ScrollView 
                                    style={{marginBottom: 100}}
                                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
                                    >
                                        {
                                            this.state.transactionHistory.length > 0 ?
                                                <TransactionHistory ts={this.state.transactionHistory} />
                                            :
                                                <Text style={{
                                                    textAlign: 'center', 
                                                    textAlignVertical: 'center', 
                                                    marginTop: '20%', 
                                                    color: Colours.white
                                                }}>
                                                    {genericStrings.nothingToShow}
                                                </Text>
                                        }
                                    </ScrollView>
                                    
                                </View>
                            </Card>
                        }
                    </LinearGradient>
                </Content>
            </Container>
        );
    }
}