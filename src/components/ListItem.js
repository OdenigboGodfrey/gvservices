import React ,{ Component  } from "react";
import { ImageBackground, StyleSheet, TouchableOpacity, TouchableHighlight, Image, Dimensions } from "react-native";
import { Container, Content, Text, View, Icon, Toast } from "native-base";
import { Colours, modelFemale01, getDateDifference, parseDate, getCurrency, getEmptorMode, toFeet } from "../utils";
import { strings as AppStrings } from "./../strings";

const {genericStrings} = AppStrings;

export default class ListItemComponent extends Component {
    constructor(props) {
        super(props);
    }

    state = {}

    render () {
        let props = this.props;
        if (props.type == 'gig') {
            return this.renderGigList();
        }
        else if (props.type == 'offer') {
            return this.renderOfferList();
        }
        else if (props.type == 'booking') {
            return this.bookingListItem();
        }
        else if (props.type == 'user') {
            return this.renderUserList();
        }
    }

    bookingListItem() {
        let props = this.props;

        let paidButton = undefined;
        let rateButton = undefined;
        if (getEmptorMode() && props.payment_approved != undefined  && !props.booking.payment_approved ) {
            paidButton = (
                <TouchableOpacity 
                    style={{position: 'absolute', zIndex: 6}} 
                    onPress={() => {
                        Toast.show({
                            text: 'You have not paid this glam.',
                            buttonText: genericStrings.dismiss,
                            duration: 5000,
                            type: 'warning'
                        });
                    }}
                >
                    <Icon
                        name={'ios-alert'}
                        style={{
                            color: Colours.white,
                            alignSelf: 'flex-end',
                            fontSize: 21,
                        }}
                    />
                </TouchableOpacity>
            );
        }

        if (getEmptorMode() && props.booking.unfinished_rating != undefined && props.booking.unfinished_rating) {
            rateButton = (<TouchableOpacity 
                onPress={() => {
                    Toast.show({
                    text: 'You have not rated this booking.',
                    buttonText: genericStrings.dismiss,
                    duration: 5000,
                    });
                }}>
                <Icon
                    name={'ios-alert'}
                    style={{
                        color: Colours.darkmagenta,
                        zIndex: 2,
                        alignSelf: 'flex-end',
                        fontSize: 16,
                    }}
                />
            </TouchableOpacity>);
        }

        return (
            <TouchableOpacity 
                style={{flexDirection: 'row', width: '100%', marginBottom: 10}}
                onPress={this.props.onPress}
            >
                <View style={{position: 'absolute', zIndex: 5, alignSelf: 'center'}}>
                    <Image source={modelFemale01} style={{width: 80, height: 80, borderRadius: 10}} />
                    {paidButton}{rateButton}
                </View>
                <View style={{ 
                    backgroundColor: '#4a4a57', 
                    height: 100, 
                    marginLeft: 50, 
                    padding: 5, 
                    paddingLeft: 50, 
                    borderRadius: 10,
                    width: (Dimensions.get('screen').width * 0.80),
                }}
                >
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flexDirection: 'row', marginRight: 10}}>
                            <Icon name={'ios-person'} style={[Styles.iconStyle]} />
                            <Text style={[Styles.textStyle]}>
                                {
                                    (!getEmptorMode()) ? props.booking.emptor.first_name : props.booking.glam.username
                                }
                            </Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Icon name={'ios-disc'} style={[Styles.iconStyle]} />
                            <Text style={[Styles.textStyle]}>{props.booking.service}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 12}}>
                        <View style={{flexDirection: 'row', marginRight: 10 }}>
                            <Icon name={'ios-calendar'} style={[Styles.iconStyle]} />
                            <Text style={[Styles.textStyle]}>
                            {getDateDifference(
                                parseDate(props.booking.starting_at),
                                parseDate(props.booking.ending_at),
                            ) + ' day(s)'}
                            </Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Icon name={'ios-cash'} style={[Styles.iconStyle]} />
                            <Text style={[Styles.textStyle]}>{props.booking.paid_amount + ' ' + getCurrency()}</Text>
                            {
                                (getEmptorMode() && (props.booking.counter_amount != null))  &&
                                <View style={{backgroundColor: Colours.darkmagenta, height: 10, width: 10,  top:5, borderRadius: 50,}}></View>
                            }
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    renderOfferList() {
        let props = this.props;

        return (
            <TouchableOpacity 
                style={{flexDirection: 'row', width: '100%', marginBottom: 10}}
                onPress={this.props.onPress}
            >
                <View style={{position: 'absolute', zIndex: 5, alignSelf: 'center'}}>
                    <Image source={props.image} style={{width: 80, height: 80, borderRadius: 10}} />
                </View>
                <View style={{ 
                    backgroundColor: '#4a4a57', 
                    height: 100, 
                    marginLeft: 50, 
                    padding: 5, 
                    paddingLeft: 50, 
                    borderRadius: 10,
                    width: (Dimensions.get('screen').width * 0.80),
                }}
                >
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flexDirection: 'row', marginRight: 10}}>
                            <Icon name={'ios-person'} style={[Styles.iconStyle]} />
                            <Text style={[Styles.textStyle]}>
                                {
                                    (!getEmptorMode()) ? props.offer.emptor.first_name : props.offer.glam.username
                                }
                            </Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Icon name={'ios-disc'} style={[Styles.iconStyle]} />
                            <Text style={[Styles.textStyle]}>{props.offer.service}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 12}}>
                        <View style={{flexDirection: 'row', marginRight: 10 }}>
                            <Icon name={'ios-calendar'} style={[Styles.iconStyle]} />
                            <Text style={[Styles.textStyle]}>
                            {getDateDifference(
                                parseDate(props.offer.starting_at),
                                parseDate(props.offer.ending_at),
                            ) + ' day(s)'}
                            </Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Icon name={'ios-cash'} style={[Styles.iconStyle]} />
                            <Text style={[Styles.textStyle]}>
                                {
                                    ((props.offer.counter_amount != null ) 
                                    ? 
                                        props.offer.counter_amount 
                                    : 
                                        (props.offer.emptor_amount != 0) 
                                            ? 
                                                props.offer.emptor_amount
                                            : 
                                                props.offer.real_amount) + ' ' + getCurrency()
                                }
                            </Text>
                            {
                                (getEmptorMode() && (props.offer.counter_amount != null))  &&
                                <View style={{backgroundColor: Colours.darkmagenta, height: 10, width: 10,  top:5, borderRadius: 50,}}></View>
                            }
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    renderGigList() {
        let props = this.props;
        let paidButton = undefined;
        let rateButton = undefined;
        if (getEmptorMode() && props.gig.all_paid != undefined && !props.gig.all_paid) {
            paidButton = (
                <TouchableOpacity 
                    style={{position: 'absolute', zIndex: 6}} 
                    onPress={() => {
                        Toast.show({
                        text: 'You have a pending payment(s).',
                        buttonText: genericStrings.dismiss,
                        duration: 5000,
                        type: 'warning'
                        });
                    }}
                >
                    <Icon
                        name={'ios-alert'}
                        style={{
                            color: Colours.white,
                            alignSelf: 'flex-end',
                            fontSize: 21,
                        }}
                    />
                </TouchableOpacity>
            );
        }

        if (getEmptorMode() && props.gig.unfinished_rating != undefined && props.gig.unfinished_rating) {
            rateButton = (
                <TouchableOpacity 
                    style={{position: 'absolute', zIndex: 6, left: 20}} 
                    onPress={() => {
                        Toast.show({
                        text: 'You have an unfinished rating(s).',
                        buttonText: genericStrings.dismiss,
                        duration: 5000,
                        });
                    }}
                >
                <Icon
                    name={'ios-alert'}
                    style={{
                        color: Colours.white,
                        zIndex: 2,
                        alignSelf: 'flex-end',
                        fontSize: 21,
                    }}
                />
            </TouchableOpacity>);
        }

        return (
            <TouchableOpacity 
                style={{flexDirection: 'row', width: '100%', marginBottom: 10}}
                onPress={this.props.onPress}
            >
                <View style={{position: 'absolute', zIndex: 5, alignSelf: 'center'}}>
                    <Image source={props.image} style={{width: 80, height: 80, borderRadius: 10}} />
                    <View style={{position: 'absolute',zIndex: 5, flexDirection: 'row'}}>
                        {paidButton}{rateButton}
                    </View>
                    
                </View>
                <View style={{ 
                    backgroundColor: '#4a4a57', 
                    height: 100, 
                    marginLeft: 50, 
                    padding: 5, 
                    paddingLeft: 50, 
                    borderRadius: 10,
                    width: (Dimensions.get('screen').width * 0.80),
                }}
                >
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flexDirection: 'row', marginRight: 10}}>
                            <Icon name={'ios-person'} style={[Styles.iconStyle]} />
                            <Text style={[Styles.textStyle]}>{props.gig.emptor.first_name}</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Icon name={'ios-disc'} style={[Styles.iconStyle]} />
                            <Text style={[Styles.textStyle]}>{props.gig.service}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 12}}>
                        <View style={{flexDirection: 'row', marginRight: 10 }}>
                            <Icon name={'ios-calendar'} style={[Styles.iconStyle]} />
                            <Text style={[Styles.textStyle]}>
                            {getDateDifference(
                                parseDate(props.gig.starting_at),
                                parseDate(props.gig.ending_at),
                            ) + ' day(s)'}
                            </Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Icon name={'ios-cash'} style={[Styles.iconStyle]} />
                            <Text style={[Styles.textStyle]}>
                            {props.gig.amount + ' ' + getCurrency()}
                            </Text>
                            {getEmptorMode() && props.gig.counter_amount != null && (
                            <View
                                style={{
                                backgroundColor: Colours.darkmagenta,
                                height: 10,
                                width: 10,
                                top: 5,
                                borderRadius: 50,
                                }}
                            />
                            )}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    renderUserList() {
        let props = this.props;
        console.log("props", props.user, props.userType, (props.userType == 'glam'));
        // let code =
        //     props.userType == 'glam' ? props.user.glam.code : props.user.emptor.code;
        let gender =
            props.userType == 'glam' ? props.user.glam.gender : props.user.emptor.gender;
        // let avatar =
        //     props.userType == 'glam' ? props.user.glam.avatar : props.user.emptor.avatar;
        let userType = props.userType;

        return (
            <TouchableOpacity 
                style={{flexDirection: 'row', width: '100%', marginBottom: 10}}
                onPress={props.onPress}
            >
                <View style={{position: 'absolute', zIndex: 5, alignSelf: 'center'}}>
                    <Image source={props.image} style={{width: 80, height: 80, borderRadius: 10}} />
                </View>
                <View style={{ 
                    backgroundColor: '#4a4a57', 
                    height: 100, 
                    marginLeft: 50, 
                    padding: 5, 
                    paddingLeft: 50, 
                    borderRadius: 10,
                    width: (Dimensions.get('screen').width * 0.80),
                }}
                >
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flexDirection: 'row', marginRight: 10}}>
                            <Icon name={'ios-person'} style={[Styles.iconStyle]} />
                            <Text style={[Styles.textStyle]}>
                                {
                                    userType == 'glam'
                                    ? props.user.glam.username
                                    : props.user.emptor.first_name
                                }
                            </Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Icon
                                name={gender == 'male' ? 'ios-male' : 'ios-female'}
                                style={[Styles.iconStyle]}
                            />
                            <Text style={[Styles.textStyle]}>{gender}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 12}}>
                        <View style={{flexDirection: 'row', marginRight: 10 }}>
                            <Text style={[Styles.textStyle]}>
                                {props.user.glam.height != null
                                    ? props.user.glam.height + ' cm (' + toFeet(props.user.glam.height) + ')'
                                    : 'n/a'}
                            </Text>
                        </View>
                        <View style={{flexDirection: 'row', marginRight: 10 }}>
                            <Text style={[Styles.textStyle]}>
                                {props.user.glam.rating.average_rating} stars
                            </Text>
                        </View>
                    </View>
                    {/* Pay and rate buttons */}
                    <View
                        style={{
                            flexDirection: 'row-reverse',
                        }}
                    >
                    {
                        /*** if not payment_approved and user has been accepted */
                        getEmptorMode() 
                        &&
                        props.user.accepted == true 
                        &&
                        props.user.payment_approved != undefined 
                        &&
                        !props.user.payment_approved && (
                            <TouchableOpacity
                            onPress={props.onPayPress}
                            style={{
                                flex: 0.3,
                                justifyContent: 'flex-end',
                                flexDirection: 'row',
                            }}>
                            <Icon
                                name={'ios-alert'}
                                style={{
                                fontSize: 16,
                                alignSelf: 'flex-end',
                                color: Colours.white,
                                }}
                            />
                            <Text
                                style={[
                                Styles.textStyle,
                                {
                                    color: Colours.white,
                                    alignSelf: 'flex-end',
                                    marginRight: 15,
                                },
                                ]}>
                                Pay
                            </Text>
                            </TouchableOpacity>
                        )}
                        {
                            getEmptorMode() && props.user.accepted == true && props.user.rated != undefined && !props.user.rated && (
                            <TouchableOpacity
                                style={{
                                flex: 0.3,
                                justifyContent: 'flex-end',
                                flexDirection: 'row',
                                marginLeft: 5,
                                }}
                                onPress={props.onRatePress}
                                >
                                <Icon
                                name={'ios-alert'}
                                style={{
                                    fontSize: 16,
                                    alignSelf: 'flex-end',
                                    color: Colours.white,
                                }}
                                />
                                <Text
                                style={[
                                    Styles.textStyle,
                                    {
                                    color: Colours.white,
                                    alignSelf: 'flex-end',
                                    marginRight: 15,
                                    },
                                ]}>
                                Rate
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const Styles = StyleSheet.create({
    iconStyle:{
        fontSize: 18,
        marginTop: 2, 
        color: Colours.white
    },
    textStyle: {
        marginLeft: 5, 
        marginRight: 5, 
        color: Colours.white
    },
});