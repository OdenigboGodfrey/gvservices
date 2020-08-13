import React, { Component } from "react";
import { AppContext } from "../../../AppProvider";
import { Container, Content, View, Text, Icon, Spinner, Fab, Button, Toast, Header, Left, Body,  } from "native-base";
import { Image, TouchableOpacity, ScrollView, RefreshControl, Platform, Dimensions } from "react-native";
import { modelMale01, getEmptorMode, getCurrency, Colours, getId, getImage, parseDate, getDateDifference } from "../../utils";
import { Styles } from "./BookingStyle";
import { getBookings } from "../../api/BookingAPI";
import { FloatingAction } from "react-native-floating-action";
import { strings as AppStrings, strings } from "../../strings";
import ListItemComponent from "../../components/ListItem";
import LinearGradient from "react-native-linear-gradient";

/***
 * (rejected,pending, active,ended,all) bookings
 * 
 */
const {genericStrings} = AppStrings;
const actions = [
    {
        text: "All Bookings",
        icon: require("./../../../assets/icons/baseline_library_add_check_black_48dp.png"),
        name: "bt_all",
        position: 1,
    },
    {
      text: "Pending Bookings",
      icon: require("./../../../assets/icons/baseline_hourglass_empty_black_48dp.png"),
      name: "bt_pending",
      position: 2,
    },
    
    {
      text: "Rejected Bookings",
      icon: require("./../../../assets/icons/baseline_cancel_black_48dp.png"),
      name: "bt_reject",
      position: 3,
    },
    {
        text: "Ended Bookings",
        icon: require("./../../../assets/icons/baseline_done_all_black_48dp.png"),
        name: "bt_ended",
        position: 4,
      },
    {
        text: "Active Bookings",
        icon: require("./../../../assets/icons/baseline_priority_high_black_48dp.png"),
        name: "bt_active",
        position: 5,
    },
  ];
export default class BookingsScreen extends Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            bookings: [],
            spinnerActive: true,
            refreshing: false,
            status: 1,
            fabActive: false,
            title: '',
        }
    }

    async componentDidMount() {
        await this.loadbookings(this.state.status);
    }

    loadbookings = async (status=1) => {
        // console.log("state", this.state.status);
        /***
         * -1 == rejected
         * 0 === pending (action is needed to be performed)
         * 1 === active (default)
         * 2 == ended
         * 3 == all
         */
        this.setState({spinnerActive: true, bookings: []});
        if (getEmptorMode() == true) {
            await getBookings({
                user_type: 1,
                emptor_id: getId(),
                status: status,
            }, this.set, this.context);
        }
        else {
            await getBookings({
                user_type: 0,
                glam_id: getId(),
                status: status,
            }, this.set, this.context);
        }
        this.setState({spinnerActive: false});
    }

    set = (v) => {
        this.setState(v);
    }

    parseDate(str) {
        str = str.split(' ')[0];
        var mdy = str.split('-');
        return new Date(mdy[0], mdy[1]-1, mdy[2]);
    }
    
    datediff(first, second) {
        // Take the difference between the dates and divide by milliseconds per day.
        // Round to nearest whole number to deal with DST.
        return Math.round((second-first)/(1000*60*60*24));
    }

    refreshBookings = async() => {
        await this.loadbookings(this.state.status);
    }

    renderBookings = () => {
        if (this.state.bookings.length == 0) {
            return (
                // <View style={{width: '100%', height: 250, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color: Colours.white, textAlign: 'center', textAlignVertical: 'center', height: 250}}>{genericStrings.nothingToShow}</Text>
                // {/* </View> */}
            );
        }
        return this.state.bookings.map((booking, index) => {
            /**
             * if a glam opens loads screen, load emptor details
             * else do the reverse
             */
            let code = (!getEmptorMode()) ? booking.emptor.code : booking.glam.code;;

            let avatar = (!getEmptorMode()) ? booking.emptor.avatar : booking.glam.avatar;
            let userType = (!getEmptorMode()) ? 'emptors': 'glams';
            return (
                <ListItemComponent
                  key={index}
                  image={getImage(userType, code, avatar, 'avatars')} 
                  booking={booking} 
                  type='booking' 
                  onPress={() => this.props.navigation.navigate('BookingDetail', {
                    booking: booking, 
                    id: booking.id,
                    })}
                />
              );
        });
    }

    onRefresh = async() => {
        this.set({refreshing: true});
        await this.loadbookings(this.state.status);
        this.set({refreshing: false});
    }

    onFABSelect = async (name) => {
        console.log("bookingscree", name);
        switch (name) {
            case 'bt_reject':
                this.set({status: -1, title: 'Rejected Bookings'});
                await this.loadbookings(-1);
                break;
            case 'bt_pending':
                this.set({status: 0, title: 'Pending Bookings'});
                await this.loadbookings(0);
                break;
            case 'bt_active':
                this.set({status: 1, title: 'Active Bookings'});
                await this.loadbookings(1);
                break;
            case 'bt_ended':
                this.set({status: 2, title: 'Ended Bookings'});
                await this.loadbookings(2);
                break;
            case 'bt_all':
                this.set({status: 3, title: 'All Bookings'});
                await this.loadbookings(3);
                break;      
            default:
                break;
        }
    }

    render() {
        return (
            <Container>
                <Header
                    androidStatusBarColor={Colours.secondaryBlack}
                    style={{backgroundColor: Colours.secondaryBlack}}>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name={(Platform.OS == 'android') ? 'arrow-back' : 'ios-arrow-back'} />
                            </Button>
                        </Left>
                        <Body>
                            <Text style={{color: 'white', fontWeight: 'bold'}}>{(this.state.title != '') ? this.state.title : 'Bookings'}</Text>
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
                        <ScrollView 
                        refreshControl={
                            <RefreshControl 
                                refreshing={this.state.refreshing} 
                                onRefresh={this.onRefresh} 
                            />
                        }
                        contentContainerStyle={{flexGrow: 1, paddingBottom: 10, paddingTop: 10}}
                        >
                            {
                                (this.state.spinnerActive) ? 
                                    <Spinner color={Colours.white} />
                                :
                                    this.renderBookings()
                            }
                        </ScrollView>
                        <FloatingAction
                            actions={actions}
                            position="right"
                            color={Colours.darkmagenta}
                            onPressItem={name => {
                            this.onFABSelect(name);
                            }}
                        />
                    </LinearGradient>
                </Content>
            </Container>
        );
    }
}