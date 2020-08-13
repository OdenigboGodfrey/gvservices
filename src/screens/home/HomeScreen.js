import React, { Component } from "react";
import { Container, Content, Card, CardItem, Text, Body, Icon, Button, Footer, FooterTab, View, Tabs, Tab, TabHeading, Badge } from "native-base";
import { Styles } from "./HomeStyles";
import { strings as AppStrings, } from "./../../strings";
import { ScrollView,  } from "react-native-gesture-handler";
import { Dimensions, TouchableOpacity} from "react-native";
import FeaturedScreen from "../featured/FeaturedScreen";
import GlamsScreen from "../glams/GlamsScreen";
import FilterScreen from "../filter/FilterScreen";
import GlamProfileScreen from "../glam_profile/GlamProfileScreen";
import InterestScreen from "../gig_interest/InterestScreen";
import { createAppContainer, NavigationEvents } from 'react-navigation';
import { createStackNavigator } from "react-navigation-stack";
import TabNavigation from "../../navigations/TabNavigation";
import { Colours, getToken, Request, urls, getSubBase, getEmptorMode, getId } from "../../utils";
import SettingsScreen from "../settings/SettingsScreen";
import { getData } from "../../storage/MainStorage";
import OffersScreen from "../offer/OffersScreen";
import { getGlamBadgeCounter } from "../../api/GlamAPI";
import { AppContext } from "./../../../AppProvider";
import GigsScreen from "../gigs/GigsScreen";
import WalletScreen from "../wallet/WalletScreen";

/**
 *  glam sees [Gigs, offers, wallet, , more]
 *  emptor sees [glams, offers, wallet, , more ]
 */

let isEmptorMode = undefined;
const strings = AppStrings.homeScreenStrings;
const currently_active = {
    _home: 0,
    _offers: 1,
    _wallet: 2,
    _models: 3,
    _gigs: 4,
    _more: 5,
    _request: 6

}

export const CustomNavigator = createAppContainer(createStackNavigator(
    {
        Featured:  FeaturedScreen,
        All:  GlamsScreen,
    }));
  

class HomeScreen extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        console.log(this.props)
    } 

    state = {
        active: currently_active._home,
        prev_source: '_home',
        _home: false,
        _offers: false,
        _wallet: false,
        _models: false,
        _gigs: false,
        _more: false,
        _request: false,
        tabsVisible: true,
        swipeablePanelActive: false,
        featured: false,
        badges: {},
        glams: undefined,
    }

    async componentDidMount() {}

    set = (v) => {
        this.setState(v);
    }

    onFooterTabPress(source) {
        console.log('state', JSON.stringify(this.state));
        this.setState({ [this.state.prev_source]: false, [source]: true, prev_source: source });
        this.context.set({ [this.state.prev_source]: false, [source]: true, prev_source: source });
        console.log('state', JSON.stringify(this.state));
    }

    _handlePress(index) {
        console.log(index);
    }
    
    height = 0;
    windowheight=0;
    prevScrollOffset = 5;

    onContentSizeChange = (width, height) => {
        this.height = height;
        this.windowheight = Dimensions.get('window').height;
      };

    onScroll(event) {
        let currentScrollOfset = event.nativeEvent.contentOffset.y;
        if (currentScrollOfset > this.prevScrollOffset) {
            //scrolling down
            this.setState({tabsVisible: false});
            
        }
        else {
            //scrolling up
            this.setState({tabsVisible: true});
        }
        if (this.windowheight <= this.height && ((currentScrollOfset * 2) >= (this.height/2))) {
            //reached botom
        }
        this.prevScrollOffset = currentScrollOfset;
    }

    onFilterPress() {
        // this.setState({swipeablePanelActive: true});
        console.log("pressed");
        this.props.navigation.navigate('Filter');
    }

    onFilterCompleted = (data) => {
        this.context.set({glams: data});
    }

    closePanel() {
        this.setState({swipeablePanelActive: false});
    }

    parentCallback(childData) {
        // this.props.navigation = navigation;
        this.props.navigation.navigate('GlamProfile');
        //console.log('image cliecked')
    }
    
    render() {
        isEmptorMode = getEmptorMode();
         return (
            //  <TabNavigation />
            <Container>
                <NavigationEvents
                    onDidFocus={async payload => {
                        if (this.context.state.prev_source == '') {
                            this.setState({_home: true});
                            this.context.set({_home: true, 'prev_source': '_home'});
                        }
                        
                        if (!getEmptorMode()) {
                            await getGlamBadgeCounter({
                                glam_id : getId()
                            }, this.set, this.context)
                        }
                    }}
                />
                {
                    this.context.state._home &&
                    // <TouchableOpacity onPress={() => console.log('pressed')}><Text>featured</Text></TouchableOpacity>
                            <Content contentContainerStyle={{flex: 1}} onScroll={(e) => this.onScroll(e)}>
                                {/* <ScrollView> */}
                                {
                                        getEmptorMode() && 
                                    <View>
                                        <View style={[{flexDirection: 'row', paddingTop: 10, marginBottom: 10, alignSelf: 'stretch'}]}>
                                            <TouchableOpacity onPress={() => {this.setState({featured: true});}} style={[Styles.headerNavButton, {
                                                backgroundColor: this.state.featured ? Colours.black : Colours.white
                                            }]}>
                                                <Text style={[Styles.headerNavText, {
                                                    color: this.state.featured ? Colours.white : Colours.black
                                                }]}>{strings.featured}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => this.setState({featured: false})} style={[Styles.headerNavButton,{
                                                backgroundColor: !this.state.featured ? Colours.black : Colours.white
                                            }]}>
                                                <Text style={[Styles.headerNavText, {
                                                    color: !this.state.featured ? Colours.white : Colours.black
                                                }]}>{strings.all}</Text>
                                            </TouchableOpacity>
                                            <View style={[{ alignSelf: 'stretch', flexDirection: 'row-reverse', flex: 1, paddingRight:10}]}>
                                                <TouchableOpacity onPress={() => {
                                                    // this.setState({swipeablePanelActive: true});
                                                    this.props.navigation.navigate('Filter', {
                                                        onFilterCompleted: (data) => this.onFilterCompleted(data),
                                                    })
                                                }} style={[{alignItems: 'flex-end', marginRight: 10, alignSelf: 'center'}]}>
                                                    <Icon name='ios-funnel' style={{color: Colours.primaryTextColor}} />
                                                </TouchableOpacity>
                                            </View>
                                        
                                        </View> 
                                    {
                                        this.state.featured && 
                                        <ScrollView>
                                            <FeaturedScreen navigation={this.props.navigation} />
                                        </ScrollView>
                                    }
                                    {
                                        !this.state.featured &&
                                        <ScrollView>
                                            <GlamsScreen navigation={this.props.navigation} glams={this.state.glams} />
                                        </ScrollView>
                                        
                                    }
                                </View>
                                
                            }
                            {
                                !getEmptorMode() && 
                                <View style={{flex: 1}}>
                                    <GigsScreen  navigation={this.props.navigation} />
                                </View>
                            }
                                {/* </ScrollView> */}
                            </Content>
                        
                    // </View>
                }
                {
                    this.context.state._offers &&
                        <View style={{flex: 1}}>
                            
                            <OffersScreen navigation={this.props.navigation} />
                            
                        </View>
                }
                {
                    this.context.state._wallet &&
                    <View style={{flex: 1}}>
                        <WalletScreen navigation={this.props.navigation} />
                    </View>
                }
                {
                    this.context.state._models &&
                    
                    <View style={{flex: 1}}>
                        {
                            getEmptorMode() &&
                            <GigsScreen  navigation={this.props.navigation} />
                        }
                    </View>
                }
                
                {
                    this.context.state._more &&
                    <View style={{flex: 1}}>
                        <SettingsScreen navigation={this.props.navigation} />
                    </View>
                }
            {
                    this.state.tabsVisible &&
                    <Footer>
                        <FooterTab style={{backgroundColor: Colours.black}}>
                            <Button 
                                badge 
                                vertical 
                                active={this.state._home} 
                                onPress={() => this.onFooterTabPress('_home')}
                                style={{backgroundColor: Colours.black}}
                            >
                                <Icon name="ios-home" style={{fontSize: 20, color: (!this.context.state._home) ? Colours.grey: Colours.white}} />
                                <Text style={{fontSize:9, color: (!this.context.state._home) ? Colours.grey: Colours.white}}>Home</Text>
                                {/* <Icon name="ios-" /> */}
                                {/* <Text></Text> */}
                            </Button>
                            <Button
                                badge 
                                vertical 
                                active={this.state._offers } 
                                onPress={() => this.onFooterTabPress('_offers')}
                                style={{backgroundColor: Colours.black}}
                            >
                                {
                                    (this.context.state.badges != undefined && this.context.state.badges.offers != undefined && this.context.state.badges.offers > 0) && 
                                    <Badge>
                                        <Text>{this.context.state.badges.offers}</Text>
                                    </Badge>
                                }
                                
                                <Icon name="ios-pricetag" style={{fontSize: 20,color: (!this.context.state._offers) ? Colours.grey: Colours.white}} />
                                <Text style={{fontSize:9, color: (!this.context.state._offers) ? Colours.grey: Colours.white}}>Offers</Text>
                            </Button>
                            <Button 
                                badge 
                                vertical 
                                active={this.state._wallet } 
                                onPress={() => this.onFooterTabPress('_wallet')}
                                style={{backgroundColor: Colours.black}}
                            >
                                
                                <Icon name="ios-wallet" style={{fontSize: 20, color: (!this.context.state._wallet) ? Colours.grey: Colours.white}} />
                                <Text style={{fontSize:9, color: (!this.context.state._wallet) ? Colours.grey: Colours.white}}>Wallet</Text>
                            </Button>
                            {
                                getEmptorMode() &&
                            
                                <Button 
                                    badge 
                                    vertical 
                                    active={this.state._models } 
                                    onPress={() => this.onFooterTabPress('_models')}
                                    style={{backgroundColor: Colours.black}}
                                >
                                    <Icon name="ios-person" style={{fontSize: 20, color: (!this.context.state._models) ? Colours.grey: Colours.white}} />
                                    <Text style={{fontSize:9, color: (!this.context.state._models) ? Colours.grey: Colours.white}}>Gigs</Text>
                                </Button>
                            }
                            {/* <Button 
                                badge 
                                vertical 
                                active={this.state._gigs } 
                                onPress={() => this.onFooterTabPress('_gigs')}
                                >
                                <Icon active name="navigate" />
                            </Button> */}
                            <Button 
                                badge 
                                vertical
                                active={this.state._more } 
                                onPress={() => this.onFooterTabPress('_more')}
                                style={{backgroundColor: Colours.black}}
                            >
                                
                                <Icon name="ios-more" style={{fontSize: 20, color: (!this.context.state._models) ? Colours.grey: Colours.white}} />
                                <Text style={{fontSize:9, color: (!this.context.state._models) ? Colours.grey: Colours.white}}>More</Text>
                            </Button>
                        </FooterTab>
                </Footer>
                }
      
          </Container>
         );
    }
}

export default HomeScreen;