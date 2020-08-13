import React, {Component} from 'react';
import {AppContext} from './../../../AppProvider';
import {
  Container,
  Content,
  View,
  Text,
  Icon,
  Spinner,
  Fab,
  Button,
  Header,
  Toast,
} from 'native-base';
import {
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {
  modelMale01,
  getEmptorMode,
  getCurrency,
  Colours,
  getId,
  getImage,
  parseDate,
  getDateDifference,
} from '../../utils';
import {Styles} from './GigsStyle';
import {getOffers} from '../../api/OfferApi';
import {getGigs} from '../../api/GigAPI';
import {FloatingAction} from 'react-native-floating-action';
import {strings as AppStrings} from './../../strings';
import { NavigationEvents } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import ListItemComponent from '../../components/ListItem';
import { getStates } from '../../api/GetApiFactorsAPI';

const {genericStrings} = AppStrings;

/*
 * gigType
 * -1 === draft
 * 0 === active (default)
 * 1 == scheduled
 * 2 == completed
 * 3 == bt_gig_with_ads
 *
 **/
const actions = [
  {
    text: 'Draft Gigs',
    icon: require('./../../../assets/icons/baseline_insert_drive_file_black_48dp.png'),
    name: 'bt_draft',
    position: 1,
  },
  // {
  //   text: 'Active Gigs',
  //   icon: require('./../../../assets/icons/baseline_priority_high_black_48dp.png'),
  //   name: 'bt_active',
  //   position: 2,
  // },

  {
    text: 'Scheduled Gigs',
    icon: require('./../../../assets/icons/baseline_schedule_black_48dp.png'),
    name: 'bt_schedule',
    position: 3,
  },
  {
    text: 'Gigs',
    icon: require('./../../../assets/icons/baseline_done_all_black_48dp.png'),
    name: 'bt_gig_with_ads',
    position: 4,
  },
];

export default class GigsScreen extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      gigs: [],
      spinnerActive: true,
      refreshing: false,
      accepted: -1,
      fabActive: false,
      gigType: 3,
      title: '',
    };
  }

  async componentDidMount() {
    await this.loadGigs(this.state.gigType);
    if (!getEmptorMode()) {
      if (this.context.state.states == undefined) await getStates(this.context, this.set);
    }
  }

  loadGigs = async (gigType = 3) => {
    this.setState({spinnerActive: true, gigs: []});
    let data = {
      type: gigType,
    };

    if (getEmptorMode()) {
      data.emptor_id = getId();
    } else {
      data.city_id = this.context.state.user_data.city_id;
    }

    await getGigs(data, this.set, this.context);
    this.setState({spinnerActive: false});
  };

  set = v => {
    this.setState(v);
  };

  parseDate(str) {
    str = str.split(' ')[0];
    var mdy = str.split('-');
    return new Date(mdy[0], mdy[1] - 1, mdy[2]);
  }

  datediff(first, second) {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
  }

  refreshGigs = async () => {
    await this.loadGigs(this.state.gigType);
  };

  onFABSelect = async name => {
    switch (name) {
      case 'bt_draft':
        this.set({gigType: -1, title: 'Draft Gigs'});
        await this.loadGigs(-1);
        break;
      case 'bt_active':
        this.set({gigType: 0, title: 'Active Gigs'});
        await this.loadGigs(0);
        break;
      case 'bt_schedule':
        this.set({gigType: 1, title: 'Scheduled Gigs'});
        await this.loadGigs(1);
        break;
      case 'bt_completed':
        this.set({gigType: 2, title: 'Completed Gigs'});
        await this.loadGigs(2);
        break;
      case 'bt_gig_with_ads':
        this.set({gigType: 3, title: 'Gigs'});
        await this.loadGigs(3);
        break;

      default:
        break;
    }
  };

  renderGigs = () => {
    if (this.state.gigs.length === 0) {
      return (
        
        <Text style={{color: Colours.white, textAlign: 'center', textAlignVertical: 'center'}}>{genericStrings.nothingToShow}</Text>
      );
    }


    return this.state.gigs.map((gig, index) => {
      /**
       * if a glam opens loads screen, load emptor details
       * else do the reverse
       */
      let code = gig.emptor.code;

      let avatar = gig.emptor.avatar;
      let userType = 'emptors';
      return (
        <ListItemComponent 
          key={index}
          image={getImage(userType, code, avatar, 'avatars')} 
          gig={gig} 
          type='gig' 
          onPress={() =>
            this.props.navigation.navigate('GigDetail', {
              gig: gig,

              id: gig.id,
              refreshGigs: this.refreshGigs,
            })
          }
        />
      );
      
    });
  };

  onRefresh = async () => {
    this.set({refreshing: true});
    await this.loadGigs(this.state.gigType);
    this.set({refreshing: false});
  };

  render() {
    return (
      <Container>
        <Header
          androidStatusBarColor={"#212129"}
          style={{backgroundColor: "#212129"}}>
          <Text
            style={[
              {
                alignSelf: 'stretch',
                textAlign: 'center',
                textAlignVertical: 'center',
                color: 'white',
                fontSize: 24,
                fontWeight: 'bold'
              },
            ]}>
            {getEmptorMode() ? ((this.state.title == '') ? 'My Gigs' : this.state.title) : 'Gigs'}
          </Text>
        </Header>
        <Content contentContainerStyle={{flex: 1}}>
          <View style={{flex: 1}}>
            <LinearGradient
              colors={["#212129", Colours.black]}
              style={{
              flex: 1,
              height: Dimensions.get('screen').height,
              paddingRight: 10,
              paddingLeft: 10,
            }}>
            
              <ScrollView
              contentContainerStyle={{flexGrow: 1}}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                  />
                }
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingBottom: 10,
                  paddingTop: 10,
                }}>
                {this.state.spinnerActive ? (
                  <Spinner color={Colours.white} />
                ) : (
                  this.renderGigs()
                )}
              </ScrollView>
            {getEmptorMode() && (
              <FloatingAction
                actions={actions}
                position="right"
                color={Colours.darkmagenta}
                onPressItem={name => {
                  this.onFABSelect(name);
                }}
              />
            )}
            </LinearGradient>
          </View>
        </Content>
      </Container>
    );
  }
}
