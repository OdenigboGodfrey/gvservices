import React, { Component } from "react";
import { AppContext } from "./../../../AppProvider";
import { Container, Content, View, Text, Icon, Separator, Textarea, Item, Input, Button, Toast, Picker, Footer, Header, Left, Body, Right } from "native-base";
import { Image, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { modelMale01, getEmptorMode, getCurrency, Colours, getId, getImage, getDateDifference, parseDate, getDate, getTime, setContext } from "../../utils";
import { Styles } from "./BookingDetailStyle";
import { strings as AppStrings } from "../../strings";
import moment from "moment";
import { Dialog, ProgressDialog } from 'react-native-simple-dialogs';
import { SpinnerButton } from "./../../components/SpinnerButton";
import { saveRating } from "./../../api/RatingAPI";
import { payBooking } from "../../api/WalletAPI";
import { actionOnBooking } from "./../../api/BookingAPI";
import LinearGradient from "react-native-linear-gradient";

const { genericStrings, offerDetailStrings } = AppStrings;
const strings = offerDetailStrings;

export default class BookingDetailScreen extends Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            height: 0,
            imageHeight: 0,
            description: genericStrings.longText,
            booking: props.navigation.getParam('booking', undefined),
            dialogVisible: false,
            amount: 0, 
            rateSelected: -1,
            btnClicked: false,
            progressVisible: false,
        }
    }

    componentDidMount() {
        setContext(this.context);
        this.setState({height: Dimensions.get('screen').height });
        
    }

    set = (value) => {
        this.setState(value);
    }

    rateSelected = (text) => {
        this.setState({rateSelected: text});
    }

    onRatePress = async () => {
        if (this.state.rateSelected == -1) {
            Toast.show({
                text: 'Please select your rating.',
                type: 'warning',
                buttonText: genericStrings.dismiss,
            });
            return;
        }
        this.setState({btnClicked: true});
        await saveRating({
            glam_id: this.state.booking.glam_id,
            booking_id: this.state.booking.id,
            rate: this.state.rateSelected,
            type: 'booking',
            glam_rate_id: this.state.booking.glam_rate_id,
        }, this.set, this.context);
        this.setState({btnClicked: false, dialogVisible: false});
        let booking = this.state.booking;
        booking.rated = true;
        this.setState({booking: booking});
    }

    payGlam = async () => {
        this.setState({progressVisible: true});
        
        await payBooking({
            booking_id: this.state.booking.id,
        }, this.props.navigation, this.set, this.context);
        
        this.setState({progressVisible: false});
    }

    onBookingAction = async(accepted) => {
        this.setState({progressVisible: true});

        await actionOnBooking({
            booking_id: this.state.booking.id,
            emptor_id: this.state.booking.emptor_id,
            accepted: accepted ? 1 : 0,
        }, this.set, this.context);

        this.setState({progressVisible: false});
    }

    onDisputePress = () => {
        this.props.navigation.navigate('Dispute', {
            glamId: this.state.booking.glam_id,
            emptorId: this.state.booking.emptor_id,
            origin: 'booking',
            bookingId: this.state.booking.id,
        });
    }
    

    render() {
        let glamGender = (getEmptorMode()) ? this.state.booking.glam.gender : this.context.state.user_data.gender;
        let emptorGender = (!getEmptorMode()) ? this.state.booking.emptor.gender : this.context.state.user_data.gender;
        let amount =   this.state.booking.paid_amount;

        //this.state.booking.
        let image = (getEmptorMode()) ? getImage('glams', this.state.booking.glam.code, this.state.booking.glam.avatar, 'avatars') : getImage('emptors', this.state.booking.emptor.code, this.state.booking.emptor.avatar, 'avatars');

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
                <Content contentContainerStyle={{flexGrow: 1}}>
                    <LinearGradient
                        colors={[Colours.secondaryBlack, Colours.black]}
                        style={{
                        flex: 1,
                        height: Dimensions.get('screen').height,
                        paddingRight: 10,
                        paddingLeft: 10,
                    }}>
                        <View style={{flex: 1}}>
                            <ScrollView contentContainerStyle={{flexGrow: 1,}}  >
                                <Image 
                                    style={{width: 220, height:220, flex: 0.6, resizeMode: 'contain'}}
                                    source={image}
                                />
                                <View style={{width: '100%', flex: 0.4}}>
                                    <View style={{flex: 0.8, padding: 10, flexDirection: 'column', flexWrap: 'wrap',}}>
                                        <Separator style={[Styles.seperator]}>
                                            <Text>{genericStrings.glam}</Text>
                                        </Separator>
                                        <View style={[Styles.mainView]}>
                                            <View style={[Styles.floatingView]}>
                                                <Icon name={'ios-person'} style={[Styles.iconStyle]} />
                                                <Text style={[Styles.textStyle]}>
                                                    {
                                                        (getEmptorMode()) 
                                                        ? 
                                                            /** if user is an emptor, show glam info */
                                                            this.state.booking.glam.first_name + ' ' + this.state.booking.glam.last_name
                                                        :
                                                            /** if user is a glam, show local glam info */
                                                            this.context.state.user_data.first_name + ' ' + this.context.state.user_data.last_name
                                                    }
                                                </Text>
                                            </View>
                                            <View style={[Styles.floatingView]}>
                                                
                                                <Icon name={(glamGender == 'male') ? 'ios-male' : 'ios-female'} style={[Styles.iconStyle]} />
                                                <Text style={[Styles.textStyle]}>{glamGender}</Text>
                                            </View>
                                            <View style={[Styles.floatingView]}>
                                                <Icon name={'ios-person'} style={[Styles.iconStyle]} />
                                                <Text  style={[Styles.textStyle]}>
                                                    {
                                                        (getEmptorMode()) 
                                                        ? 
                                                            /** if user is an emptor, show glam info */
                                                            this.state.booking.glam.username
                                                        :
                                                            /** if user is a glam, show local glam info */
                                                            this.context.state.user_data.username
                                                    }
                                                </Text>
                                            </View>
                                            
                                        </View>
                                        <Separator style={[Styles.seperator]}>
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
                                                            this.state.booking.emptor.first_name + ' ' + this.state.booking.emptor.last_name
                                                        :
                                                            /** if user is an emptor, show glam info */
                                                            this.context.state.user_data.first_name + ' ' + this.context.state.user_data.last_name
                                                    }
                                                </Text>
                                            </View>
                                            <View style={[Styles.floatingView]}>
                                                <Icon name={(emptorGender == 'male') ? 'ios-male' : 'ios-female'} style={[Styles.iconStyle]} />
                                                <Text style={[Styles.textStyle]}>Male</Text>
                                            </View>
                                            <View style={[Styles.floatingView, {width: 10}]}>
                                                {/* <Icon name={'ios-cash'} style={[Styles.iconStyle]} />
                                                <Text  style={[Styles.textStyle]}>{ 100 + getCurrency() }</Text> */}
                                            </View>
                                            
                                        </View>
                                        <Separator style={[Styles.seperator]}>
                                            <Text>{strings.interaction}</Text>
                                        </Separator>
                                        <View style={[Styles.mainView]}>
                                            <View style={[Styles.floatingView]}>
                                                <Icon name={'ios-disc'} style={[Styles.iconStyle]} />
                                                <Text style={[Styles.textStyle]}>{this.state.booking.service}</Text>
                                            </View>
                                            <View style={[Styles.floatingView]}>
                                                <Icon name={'ios-hourglass'} style={[Styles.iconStyle]} />
                                                <Text style={[Styles.textStyle]}>{getDateDifference(parseDate(this.state.booking.starting_at), parseDate(this.state.booking.ending_at)) + ' day(s)'}</Text>
                                            </View>
                                            <View style={[Styles.floatingView]}>
                                                <Icon name={'ios-cash'} style={[Styles.iconStyle]} />
                                                <Text style={[Styles.textStyle]}>{ amount + getCurrency() }</Text>
                                            </View>
                                            
                                        </View>
                                        <Separator style={[Styles.seperator]}>
                                            <Text>{genericStrings.duration}</Text>
                                        </Separator>
                                        <View style={[Styles.mainView]}>
                                            <View style={[Styles.floatingView]}>
                                                <Icon name={'ios-calendar'} style={[Styles.iconStyle]} />
                                                <Text style={[Styles.textStyle]}>{getDate(this.state.booking.starting_at)}</Text>
                                            </View>
                                            <View style={[Styles.floatingView]}>
                                                <Icon name={'ios-calendar'} style={[Styles.iconStyle]} />
                                                <Text style={[Styles.textStyle]}>{getDate(this.state.booking.ending_at)}</Text>
                                            </View>
                                            <View style={[Styles.floatingView]}>
                                                <Icon name={'ios-clock'} style={[Styles.iconStyle]} />
                                                <Text style={[Styles.textStyle]}>{moment(this.state.booking.starting_at).format('HH:mm')}-{moment(this.state.booking.ending_at).format('HH:mm')}</Text>
                                            </View>
                                        </View>
                                        <Separator style={[Styles.seperator]}>
                                            <Text>{'Venue'}</Text>
                                        </Separator>
                                        <View style={[Styles.mainView, {justifyContent: 'flex-start'}]}>
                                            <View style={[Styles.floatingView, {alignItems: 'flex-start'}]}>
                                                <Icon name={'ios-home'} style={[Styles.iconStyle]} />
                                                <Text style={[Styles.textStyle, {textAlign: 'left'}]}>{this.state.booking.venue}</Text>
                                            </View>
                                        </View>
                                        <Separator style={[Styles.seperator]}>
                                            <Text>{genericStrings.description}</Text>
                                        </Separator>
                                        <View style={[Styles.mainView]}>
                                            <ScrollView style={{height: 120}}>
                                                <Text style={[Styles.textArea]}>
                                                    {this.state.booking.description}
                                                </Text>
                                            </ScrollView>
                                            
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                            <Dialog
                                visible={this.state.dialogVisible}
                                title={this.state.dialogTitle}
                                onTouchOutside={() => this.setState({dialogVisible: false})} 
                                dialogStyle={{padding: 0}}
                                contentStyle={{padding: 0, width: '100%'}}
                            >
                                <View style={{padding: 10}}>
                                    <Item bordered>
                                        <Picker
                                            mode="dropdown"
                                            iosIcon={<Icon name="arrow-down" />}
                                            headerStyle={{ backgroundColor: "#b95dd3" }}
                                            headerBackButtonTextStyle={{ color: "#fff" }}
                                            headerTitleStyle={{ color: "#fff" }}
                                            selectedValue={this.state.rateSelected}
                                            onValueChange={this.rateSelected.bind(this)}
                                            >
                                            <Picker.Item label="Pick stars" value={-1} />
                                            <Picker.Item label="1 star" value={1} />
                                            <Picker.Item label="1.5 stars" value={1.5} />
                                            <Picker.Item label="2 stars" value={2} />
                                            <Picker.Item label="2.5 stars" value={2.5} />
                                            <Picker.Item label="3 star" value={3} />
                                            <Picker.Item label="3.5 stars" value={3.5} />
                                            <Picker.Item label="4 stars" value={4} />
                                            <Picker.Item label="4.5 stars" value={4.5} />
                                            <Picker.Item label="2 stars" value={2} />
                                        </Picker>
                                    </Item>
                                    <SpinnerButton
                                        label={'Rate'}
                                        block={true}
                                        onPress={this.onRatePress}
                                        btnClicked={this.state.btnClicked}
                                    />
                                </View>
                            </Dialog>
                            <ProgressDialog
                                visible={this.state.progressVisible}
                                title=""
                                message="Please, wait..."
                            />
                        </View>
                    </LinearGradient>
                </Content>
                <Footer style={{backgroundColor: Colours.secondaryBlack}}>
                    <View style={{flex: 1, justifyContent: 'space-evenly', flexDirection: 'row', borderTopColor: Colours.gray, borderWidth: 1, paddingTop: 10}}>
                        {
                            getEmptorMode() && this.state.booking.rated != undefined && !this.state.booking.rated && 
                            <TouchableOpacity onPress={() => this.setState({dialogVisible: true})}>
                                <Text style={{color: Colours.darkmagenta}}>Rate</Text>
                            </TouchableOpacity>
                        }
                        {
                            getEmptorMode() && this.state.booking.payment_approved != undefined && !this.state.booking.payment_approved && 
                            <TouchableOpacity onPress={this.payGlam}>
                                <Text style={{color: Colours.darkmagenta}}>Pay</Text>
                            </TouchableOpacity>
                        }
                        {
                            this.state.booking.active == 1 &&
                            <TouchableOpacity onPress={this.onDisputePress}>
                                <Text style={{color: Colours.darkmagenta}}>Open Dispute</Text>
                            </TouchableOpacity>
                        }
                        {
                            !getEmptorMode() && this.state.booking.status == 'pending' && 
                            <TouchableOpacity onPress={() => this.onBookingAction(true)}>
                                <Text style={{color: Colours.darkmagenta}}>Accept</Text>
                            </TouchableOpacity>
                        }
                        {
                            !getEmptorMode() && this.state.booking.status == 'pending' && 
                            <TouchableOpacity onPress={() => this.onBookingAction(false)}>
                                <Text style={{color: Colours.darkmagenta}}>Decline</Text>
                            </TouchableOpacity>
                        }
                        
                    </View>
                </Footer>
            </Container>
        );
    }
}
