import React, { Component } from "react";
import { AppContext } from "./../../../AppProvider";
import { Container, Content, View, Text, Icon, Separator, Textarea, Item, Input, Button, Toast, Header, Left, Body, Right, Footer } from "native-base";
import { Image, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { modelMale01, getEmptorMode, getCurrency, Colours, getId, getImage, getDateDifference, parseDate, getDate, getTime, setContext } from "../../utils";
import { Styles } from "./OfferDetailStyle";
import { actionOnOffers, counterOfferAmount, closeOffer } from "../../api/OfferApi";
import { strings as AppStrings } from "../../strings";
import moment from "moment";
import { Dialog } from 'react-native-simple-dialogs';
import LinearGradient from "react-native-linear-gradient";

const { genericStrings, offerDetailStrings } = AppStrings;
const strings = offerDetailStrings;

export default class OfferDetailScreen extends Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            height: 0,
            imageHeight: 0,
            description: genericStrings.longText,
            offer: props.navigation.getParam('offer', undefined),
            dialogVisible: false,
            amount: 0
        }
    }

    componentDidMount() {
        setContext(this.context);
        this.setState({height: Dimensions.get('screen').height });
        
    }

    set = (value) => {
        this.setState(value);
    }

    onActionPress = async(actionType) => {
        if (typeof(actionType) == 'boolean') {
            
            this.setState({action: actionType});
            /** perform action on booking */
            if (actionType) {
                await actionOnOffers(
                {
                    accepted: (actionType) ? 1 : 0, 
                    offer_id: this.state.offer.id
                }, 
                this.set, this.context);
            }
            else {
                await closeOffer({
                    closed_by: (getEmptorMode()) ? 'emptor' : 'glam',
                    offer_id: this.state.offer.id
                }, this.set, this.context);
            }
            
            
            this.props.navigation.state.params.onAction(this.props.navigation.getParam('id', -1));
            this.props.navigation.goBack();
            
        }
        else {
            /** counter offer */
            this.set({dialogVisible: false});
            if (this.state.amount > 0) {
                await counterOfferAmount(
                    {
                        amount: this.state.amount, 
                        offer_id: this.state.offer.id
                    }, 
                    this.set, this.context);
                    
                this.props.navigation.state.params.refreshOffers();
                this.props.navigation.goBack();
            }
            else {
                Toast.show({
                    text: 'Amount must be greater than 0',
                    type: 'danger',
                    buttonText: genericStrings.dismiss
                });
            }
            
        }
    }

    render() {
        let glamGender = (getEmptorMode()) ? this.state.offer.glam.gender : this.context.state.user_data.gender;
        let emptorGender = (!getEmptorMode()) ? this.state.offer.emptor.gender : this.context.state.user_data.gender;
        let amount = ((this.state.offer.emptor_amount != 0) ? this.state.offer.emptor_amount: this.state.offer.real_amount);
        
        let counterOfferButton = false;
        let emptorAcceptOfferButton = false;
        
        if (this.state.offer.emptor_amount != 0 && this.state.offer.counter_amount == null) {
            /***
             * glam is yet to counter offer
             */
            
            if (!getEmptorMode()) {
                counterOfferButton = (
                <TouchableOpacity onPress={() => this.set({dialogVisible: true})}>
                    <Text style={{color: Colours.darkmagenta}}>Counter Offer</Text>
                </TouchableOpacity>
                );
            }
        }
        
        if (this.state.offer.emptor_amount != 0 && this.state.offer.counter_amount != null && getEmptorMode() && !this.state.offer.accepted) {
            /***
             * glam has counter offered, emptor needs to accept/finalize if not accepted
             */
            emptorAcceptOfferButton = true;
            amount = this.state.offer.counter_amount;
        }

        // console.log("counter_amount", this.state.offer.emptor_amount, this.state.offer.counter_amount, getEmptorMode(), this.state.offer.id, emptorAcceptOfferButton, (!getEmptorMode() && this.state.offer.counter_amount == null));

        // get other parties display image
        let image = (getEmptorMode()) ? getImage('glams', this.state.offer.glam.code, this.state.offer.glam.avatar, 'avatars') : getImage('emptors', this.state.offer.emptor.code, this.state.offer.emptor.avatar, 'avatars');

        return (
            <Container>
                <Header
                    androidStatusBarColor={Colours.secondaryBlack}
                    style={{backgroundColor: Colours.secondaryBlack}}>
                        <Left style={{alignSelf: 'flex-start', alignItems: 'flex-start'}}>
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name='arrow-back' />
                            </Button>
                        </Left>
                        <Body />
                        <Right />
                </Header>
                <Content style={{flex: 1}}>
                    <LinearGradient
                        colors={[Colours.secondaryBlack, Colours.black]}
                        style={{
                        flex: 1,
                        height: Dimensions.get('screen').height,
                        paddingRight: 10,
                        paddingLeft: 10,
                    }}>
                        <View style={{flex: 1}}>
                            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                                <View style={{flexDirection: 'row'}}>    
                                    <Image
                                        style={{width: 220, height:220, flex: 0.6, resizeMode: 'contain'}}
                                        source={image}
                                    />
                                </View>
                                <View style={{width: '100%', flex: 0.4}}>
                                    <View style={{flex: 0.8, padding: 10, flexDirection: 'column', flexWrap: 'wrap',}}>
                                        <Separator style={{maxHeight: 20, backgroundColor: Colours.secondaryBlack, height: 20}}>
                                            <Text sty>{genericStrings.glam}</Text>
                                        </Separator>
                                        <View style={[Styles.mainView]}>
                                            <View style={[Styles.floatingView]}>
                                                <Icon name={'ios-person'} style={[Styles.iconStyle]} />
                                                <Text style={[Styles.textStyle]}>
                                                    {
                                                        (getEmptorMode()) 
                                                        ? 
                                                            /** if user is an emptor, show glam info */
                                                            this.state.offer.glam.first_name + ' ' + this.state.offer.glam.last_name
                                                        :
                                                            /** if user is a glam, show local glam info */
                                                            this.context.state.user_data.first_name + ' ' + this.context.state.user_data.last_name
                                                    }
                                                </Text>
                                            </View>
                                            <View style={[Styles.floatingView]}>
                                                
                                                <Icon name={(glamGender == 'male') ? 'ios-male' : 'ios-female'} style={[Styles.iconStyle]} />
                                                <Text  style={[Styles.textStyle]}>{glamGender}</Text>
                                            </View>
                                            <View style={[Styles.floatingView]}>
                                                <Icon name={'ios-person'} style={[Styles.iconStyle]} />
                                                <Text  style={[Styles.textStyle]}>
                                                    {
                                                        (getEmptorMode()) 
                                                        ? 
                                                            /** if user is an emptor, show glam info */
                                                            this.state.offer.glam.username
                                                        :
                                                            /** if user is a glam, show local glam info */
                                                            this.context.state.user_data.username
                                                    }
                                                </Text>
                                            </View>
                                            
                                        </View>
                                        <Separator style={{maxHeight: 20, backgroundColor: Colours.secondaryBlack, height: 20}}>
                                            <Text>{genericStrings.emptor}</Text>
                                        </Separator>
                                        <View style={[Styles.mainView]}>
                                            <View style={[Styles.floatingView]}>
                                                <Icon name={'ios-person'} style={[Styles.iconStyle]} />
                                                <Text style={[Styles.textStyle]}>
                                                    {
                                                        (!getEmptorMode()) 
                                                        ? 
                                                            /** if user is a glam, show local glam info */
                                                            this.state.offer.emptor.first_name + ' ' + this.state.offer.emptor.last_name
                                                        :
                                                            /** if user is an emptor, show glam info */
                                                            this.context.state.user_data.first_name + ' ' + this.context.state.user_data.last_name
                                                    }
                                                </Text>
                                            </View>
                                            <View style={[Styles.floatingView]}>
                                                <Icon name={(emptorGender == 'male') ? 'ios-male' : 'ios-female'} style={[Styles.iconStyle]} />
                                                <Text  style={[Styles.textStyle]}>Male</Text>
                                            </View>
                                            <View style={[Styles.floatingView, {width: 10}]}>
                                                {/* <Icon name={'ios-cash'} style={[Styles.iconStyle]} />
                                                <Text  style={[Styles.textStyle]}>{ 100 + getCurrency() }</Text> */}
                                            </View>
                                            
                                        </View>
                                        <Separator style={{maxHeight: 20, backgroundColor: Colours.secondaryBlack, height: 20}}>
                                            <Text>{strings.interaction}</Text>
                                        </Separator>
                                        <View style={[Styles.mainView]}>
                                            <View style={[Styles.floatingView]}>
                                                <Icon name={'ios-disc'} style={[Styles.iconStyle]} />
                                                <Text style={[Styles.textStyle]}>{this.state.offer.service}</Text>
                                            </View>
                                            <View style={[Styles.floatingView]}>
                                                <Icon name={'ios-hourglass'} style={[Styles.iconStyle]} />
                                                <Text  style={[Styles.textStyle]}>{getDateDifference(parseDate(this.state.offer.starting_at), parseDate(this.state.offer.ending_at)) + ' day(s)'}</Text>
                                            </View>
                                            <View style={[Styles.floatingView]}>
                                                <Icon name={'ios-cash'} style={[Styles.iconStyle]} />
                                                <Text  style={[Styles.textStyle]}>{ amount + getCurrency() }</Text>
                                            </View>
                                            
                                        </View>
                                        <Separator style={{maxHeight: 20, backgroundColor: Colours.secondaryBlack, height: 20}}>
                                            <Text>{genericStrings.duration}</Text>
                                        </Separator>
                                        <View style={[Styles.mainView]}>
                                            <View style={[Styles.floatingView]}>
                                                <Icon name={'ios-calendar'} style={[Styles.iconStyle]} />
                                                <Text style={[Styles.textStyle]}>{getDate(this.state.offer.starting_at)}</Text>
                                            </View>
                                            <View style={[Styles.floatingView]}>
                                                <Icon name={'ios-calendar'} style={[Styles.iconStyle]} />
                                                <Text style={[Styles.textStyle]}>{getDate(this.state.offer.ending_at)}</Text>
                                            </View>
                                            <View style={[Styles.floatingView]}>
                                                <Icon name={'ios-clock'} style={[Styles.iconStyle]} />
                                                <Text style={[Styles.textStyle]}>{moment(this.state.offer.starting_at).format('HH:mm')}-{moment(this.state.offer.ending_at).format('HH:mm')}</Text>
                                            </View>
                                        </View>
                                        <Separator style={{maxHeight: 20, backgroundColor: Colours.secondaryBlack, height: 20}}>
                                            <Text>{'Venue'}</Text>
                                        </Separator>
                                        <View style={[Styles.mainView, {justifyContent: 'flex-start'}]}>
                                            <View style={[Styles.floatingView, {alignItems: 'flex-start'}]}>
                                                <Icon name={'ios-home'} style={[Styles.iconStyle]} />
                                                <Text style={[Styles.textStyle, {textAlign: 'left'}]}>{this.state.offer.venue}</Text>
                                            </View>
                                        </View>
                                        <Separator style={{maxHeight: 20, backgroundColor: Colours.secondaryBlack, height: 20}}>
                                            <Text>{genericStrings.description}</Text>
                                        </Separator>
                                        <View style={[Styles.mainView]}>
                                            <ScrollView style={{height: 120}}>
                                                <Text style={[Styles.textArea]}>
                                                    {this.state.offer.description}
                                                </Text>
                                            </ScrollView>
                                            
                                            {/* <Textarea 
                                                value={this.state.description}
                                                editable={false}
                                                
                                                rowSpan={5}
                                                
                                            /> */}
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </LinearGradient>
                    <Dialog
                        visible={this.state.dialogVisible}
                        title={this.state.dialogTitle}
                        onTouchOutside={() => this.setState({dialogVisible: false})} 
                        dialogStyle={{padding: 0}}
                        contentStyle={{padding: 0, width: '100%'}}
                    >
                        <View style={{padding: 10}}>
                            <Item bordered>
                                <Input 
                                    placeholder={'Enter Final Amount'} 
                                    onChangeText={(text) => this.set({amount: text})}
                                    keyboardType={'numeric'}
                                />
                            </Item>
                            <Button
                            block
                            style={{alignItems: 'center', }}
                            onPress={() => this.onActionPress('final')}
                            >
                                <Text style={{textAlign: 'center'}}>Done</Text>
                            </Button>
                        </View>
                    </Dialog>
                </Content>
                <Footer style={{backgroundColor: Colours.secondaryBlack}}>
                    <View style={{flex: 1, justifyContent: 'space-evenly', flexDirection: 'row', borderWidth: 1, paddingTop: 10}}>
                        {
                            (emptorAcceptOfferButton || (!getEmptorMode() && this.state.offer.counter_amount == null))
                            &&
                            <TouchableOpacity onPress={() => this.onActionPress(true)}>
                                <Text style={{color: Colours.green}}>Accept</Text>
                            </TouchableOpacity>
                        }

                        {
                            (counterOfferButton != false) && counterOfferButton
                        }
                        {
                            !this.state.offer.accepted && 
                            <TouchableOpacity onPress={() => this.onActionPress(false)}>
                                <Text style={{color: Colours.red}}>Close</Text>
                            </TouchableOpacity>
                        }
                        
                    </View>
                </Footer>
            </Container>
        );
    }
}
