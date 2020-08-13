import React, { Component } from "react";
import { AppContext } from "./../../../AppProvider";
import { Container, Content, View, Text, Icon, Spinner, Fab, Button, Header,  } from "native-base";
import { Image, TouchableOpacity, ScrollView, RefreshControl, Dimensions } from "react-native";
import { modelMale01, getEmptorMode, getCurrency, Colours, getId, getImage, parseDate, getDateDifference } from "../../utils";
import { Styles } from "./OffersStyle";
import { getOffers } from "../../api/OfferApi";
import { FloatingAction } from "react-native-floating-action";
import { strings  as AppStrings } from "./../../strings";
import ListItemComponent from "../../components/ListItem";
import LinearGradient from "react-native-linear-gradient";


const { genericStrings } = AppStrings;
/***
 * (accepted,closed, all) offers
 * 
 */
const actions = [
    {
        text: "All Offers",
        icon: require("./../../../assets/icons/baseline_library_add_check_black_48dp.png"),
        name: "bt_all",
        position: 1
    },
    {
      text: "Accepted Offers",
      icon: require("./../../../assets/icons/baseline_check_black_48dp.png"),
      name: "bt_accepted",
      position: 2
    },
    
    {
      text: "Closed Offers",
      icon: require("./../../../assets/icons/baseline_cancel_black_48dp.png"),
      name: "bt_closed",
      position: 3
    },
    {
        text: "Open Offers",
        icon: require("./../../../assets/icons/baseline_priority_high_black_48dp.png"),
        name: "bt_open",
        position: 4
    },
  ];
export default class OffersScreen extends Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            offers: [],
            spinnerActive: true,
            refreshing: false,
            accepted: -1,
            fabActive: false,
            title: '',
        }
    }

    async componentDidMount() {
        await this.loadoffers(this.state.accepted);
    }

    loadoffers = async (accepted=-1) => {
        /**
         * -1 == only unaccepted (default)
         * 0 == only accepted
         * 1 == all
         * 2 == closed
         */
        this.setState({spinnerActive: true, offers: []});
        if (getEmptorMode() == true) {
            await getOffers({
                user_type: 1,
                emptor_id: getId(),
                accepted: accepted,
            }, this.set, this.context);
        }
        else {
            await getOffers({
                user_type: 0,
                glam_id: getId(),
                accepted: accepted,
            }, this.set, this.context);
        }
        this.setState({spinnerActive: false});
    }

    set = (v) => {
        this.setState(v);
    }


    refreshOffers = async() => {
        await this.loadoffers(this.state.accepted);
    }

    renderOffers = () => {
        if (this.state.offers.length == 0) {
            return (
                // <View style={{width: '100%', height: 250, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{color: Colours.white, textAlign: 'center', textAlignVertical: 'center'}}>{genericStrings.nothingToShow}</Text>
                // </View>
            );
          }

        return this.state.offers.map((offer, index) => {
            /**
             * if a glam opens loads screen, load emptor details
             * else do the reverse
             */
            let code = (!getEmptorMode()) ? offer.emptor.code : offer.glam.code;;

            let avatar = (!getEmptorMode()) ? offer.emptor.avatar : offer.glam.avatar;
            let userType = (!getEmptorMode()) ? 'emptors': 'glams';
            return (
                <ListItemComponent
                  key={index}
                  image={getImage(userType, code, avatar, 'avatars')} 
                  offer={offer} 
                  type='offer' 
                  onPress={() => this.props.navigation.navigate('OfferDetail', {
                        offer: offer, 
                        onAction: (index) => {
                            this.set({offers: this.state.offers.filter(x => x.id != index)});
                        },
                        id: offer.id,
                        refreshOffers: this.refreshOffers
                    })}
                />
              );
        });
    }

    onRefresh = async() => {
        this.set({refreshing: true});
        await this.loadoffers(this.state.accepted);
        this.set({refreshing: false});
    }

    onFABSelect = async (name) => {
        switch (name) {
            case 'bt_open':
                this.set({accepted: -1, title: 'Open Offers'});
                await this.loadoffers(-1);
                break;
            case 'bt_accepted':
                this.set({accepted: 0, title: 'Accepted Offers'});
                await this.loadoffers(0);
                break;
            case 'bt_all':
                this.set({accepted: 1, title: 'All Offers'});
                await this.loadoffers(1);
                break;
            case 'bt_closed':
                this.set({accepted: 2, title: 'Closed Offers'});
                await this.loadoffers(2);
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
                        {(this.state.title !== '') ? this.state.title : 'Offers'}
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
                                this.renderOffers()
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