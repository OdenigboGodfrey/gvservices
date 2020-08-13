import React, {Component} from 'react';
import {AppContext} from './../../../AppProvider';
import {
  Container,
  Content,
  View,
  Text,
  Icon as NBIcon,
  Spinner,
  Fab,
  Button,
  Header,
  Toast,
  Item,
  Picker,
} from 'native-base';
import {
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {
  getEmptorMode,
  getCurrency,
  Colours,
  getId,
  getImage,
  parseDate,
  getDateDifference,
  toFeet,
} from '../../utils';
import {Styles} from './ListUsersStyle';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {strings as AppStrings} from './../../strings';
import {Dialog, ProgressDialog} from 'react-native-simple-dialogs';
import {saveRating} from '../../api/RatingAPI';
import {SpinnerButton} from '../../components/SpinnerButton';
import { payInterest } from '../../api/WalletAPI';
import LinearGradient from 'react-native-linear-gradient';
import ListItemComponent from '../../components/ListItem';

/*
 * userType
 * -1 === draft
 * 0 === active
 * 1 == scheduled
 * 2 == completed
 *
 **/
/***
 * page was meant to be generic for all both emptors and glams
 */
const {genericStrings} = AppStrings;
export default class ListUsersScreen extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      spinnerActive: true,
      refreshing: false,
      accepted: -1,
      fabActive: false,
      userType: 0,
      dialogVisible: false,
      btnClicked: false,
      user: undefined,
      gig: this.props.navigation.getParam('gig', {}),
      progressVisible: false,
    };
  }

  async componentDidMount() {
    this.setState({
      users: this.props.navigation.getParam('users', []),
      userType: this.props.navigation.getParam('userType', undefined),
    });
  }

  set = v => {
    this.setState(v);
  };

  get = () => this.state;

  onPress = id => {
    let source = this.props.navigation.getParam('source', undefined);
    switch (source) {
      case 'gigDetail':
        let gig = this.state.gig;
        if (Object.keys(gig).length > 0) {
          let gigId = gig.id;
          this.props.navigation.navigate(
            this.props.navigation.getParam('nextPage', ''),
            {
              index: id,
              users: this.state.users,
              gigId: gigId,
              gig: gig,
            },
          );
        } else {
          Toast.show({
            text: 'An error occured',
            type: 'danger',
            buttonText: genericStrings.dismiss,
          });
        }
        break;

      default:
        break;
    }
  };

  rateSelected = text => {
    this.setState({rateSelected: text});
  };

  onRatePress = async () => {
    if (this.state.rateSelected == -1) {
      Toast.show({
        text: 'Please select your rating.',
        type: 'warning',
        buttonText: genericStrings.dismiss,
      });
      return;
    }
    if (Object.keys(this.state.gig) == 0) {
      Toast.show({
        text: 'An error occured',
        type: 'danger',
        buttonText: genericStrings.dismiss,
      });
      return;
    }

    this.setState({btnClicked: true});

    let res = await saveRating(
      {
        glam_id: this.state.user.glam_id,
        gig_id: this.state.gig.id,
        rate: this.state.rateSelected,
        type: 'gig',
        glam_rate_id: this.state.gig.category_id,
      },
      this.get,
      this.set,
      this.context,
    );

    this.setState({btnClicked: false, dialogVisible: false});

  };

  payGlam = async interestId => {
    this.setState({progressVisible: true});
    
    await payInterest({
      interest_id: interestId,
    }, this.props.navigation, this.get, this.set, this.context);

    
    this.setState({progressVisible: false});
  };

  renderUsers = () => {
    if (this.state.users.length == 0) {
      return (
          <View style={{width: '100%', height: 250, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{color: Colours.darkmagenta, textAlign: 'center', textAlignVertical: 'center'}}>{genericStrings.nothingToShow}</Text>
          </View>
      );
    }
    
    return this.state.users.map((user, index) => {
      console.log('user', user, this.state.userType);
      /**
       * if a glam opens loads screen, load emptor details
       * else do the reverse
       */
      let code =
        this.state.userType == 'glam' ? user.glam.code : user.emptor.code;
      let glamGender =
        this.state.userType == 'glam' ? user.glam.gender : user.emptor.gender;
      let avatar =
        this.state.userType == 'glam' ? user.glam.avatar : user.emptor.avatar;
      let userType = this.state.userType == 'glam' ? 'glams' : 'emptors';
      return (
        <ListItemComponent
          key={index}
          image={getImage(userType, code, avatar, 'avatars')} 
          user={user} 
          userType={this.state.userType}
          type='user' 
          onPress={() => {
            this.onPress(index);
          }}
          onPayPress={
            () => {
              this.setState({user: user});
              this.payGlam(user.id);
              }
          }
          onRatePress={() => this.setState({dialogVisible: true, user: user})}
        />
      );
      
      return (
        <TouchableOpacity
          key={index}
          style={{flexDirection: 'row', paddingTop: 0, marginLeft: 5}}
          onPress={() => {
            this.onPress(index);
          }}>
          <View style={{width: 90}}>
            <View style={{position: 'absolute'}}>
              <Image
                style={[Styles.userImage]}
                source={getImage(userType, code, avatar, 'avatars')}
              />
            </View>
          </View>

          <View style={[Styles.bodyView]}>
            <View
              style={{flexDirection: 'column', flex: 0.7, paddingBottom: 2}}>
              <View style={{flexDirection: 'row'}}>
                <NBIcon name={'ios-person'} style={[Styles.iconStyle]} />
                <Text style={[Styles.textStyle]}>
                  {this.state.userType == 'glam'
                    ? user.glam.username
                    : user.emptor.first_name}
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <NBIcon
                  name={glamGender == 'male' ? 'ios-male' : 'ios-female'}
                  style={[Styles.iconStyle]}
                />
                <Text style={[Styles.textStyle]}>{glamGender}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <NBIcon
                  name={glamGender == 'male' ? 'ios-man' : 'ios-woman'}
                  style={[Styles.iconStyle]}
                />
                {/* <Icon name="text-height" size={30} style={[Styles.iconStyle]} /> */}
                <Text style={[Styles.textStyle]}>
                  {user.glam.height != null
                    ? user.glam.height + ' (' + toFeet(user.glam.height) + ')'
                    : 'n/a'}
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={[
                    Styles.textStyle,
                    {
                      color: Colours.darkmagenta,
                      alignSelf: 'flex-end',
                      marginRight: 0,
                    },
                  ]}
                />
              </View>
            </View>

            {getEmptorMode() &&
              user.payment_approved != undefined &&
              !user.payment_approved && (
                <TouchableOpacity
                  style={{
                    flex: 0.3,
                    justifyContent: 'flex-end',
                    flexDirection: 'row',
                  }}>
                  <NBIcon
                    name={'ios-alert'}
                    style={{
                      fontSize: 16,
                      alignSelf: 'flex-end',
                      color: Colours.darkmagenta,
                    }}
                  />
                  <Text
                    onPress={() => {
                      this.setState({user: user});
                      this.payGlam(user.id);
                    }}
                    style={[
                      Styles.textStyle,
                      {
                        color: Colours.darkmagenta,
                        alignSelf: 'flex-end',
                        marginRight: 15,
                      },
                    ]}>
                    Pay
                  </Text>
                </TouchableOpacity>
              )}
            {getEmptorMode() && user.rated != undefined && !user.rated && (
              <TouchableOpacity
                style={{
                  flex: 0.3,
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                  marginLeft: 5,
                }}
                onPress={() =>
                  this.setState({dialogVisible: true, user: user})
                }
                >
                <NBIcon
                  name={'ios-alert'}
                  style={{
                    fontSize: 16,
                    alignSelf: 'flex-end',
                    color: Colours.darkmagenta,
                  }}
                />
                <Text
                  style={[
                    Styles.textStyle,
                    {
                      color: Colours.darkmagenta,
                      alignSelf: 'flex-end',
                      marginRight: 15,
                    },
                  ]}>
                  Rate
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      );
    });
  };
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
                textAlign: 'center',
                textAlignVertical: 'center',
                color: 'white',
                fontWeight: 'bold'
              },
            ]}>
            {this.props.navigation.getParam('header', '')}
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
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: 10,
                paddingTop: 10,
              }}>
              {this.renderUsers()}
            </ScrollView>
          </LinearGradient>
        </Content>
        <Dialog
          visible={this.state.dialogVisible}
          title={this.state.dialogTitle}
          onTouchOutside={() => this.setState({dialogVisible: false})}
          dialogStyle={{padding: 0}}
          contentStyle={{padding: 0, width: '100%'}}>
          <View style={{padding: 10}}>
            <Item bordered>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                headerStyle={{backgroundColor: '#b95dd3'}}
                headerBackButtonTextStyle={{color: '#fff'}}
                headerTitleStyle={{color: '#fff'}}
                selectedValue={this.state.rateSelected}
                onValueChange={this.rateSelected.bind(this)}>
                <Picker.Item label="Pick stars" value={-1} />
                <Picker.Item label="1 star" value={1} />
                <Picker.Item label="1.5 stars" value={1.5} />
                <Picker.Item label="2 stars" value={2} />
                <Picker.Item label="2.5 stars" value={2.5} />
                <Picker.Item label="3 star" value={3} />
                <Picker.Item label="3.5 stars" value={3.5} />
                <Picker.Item label="4 stars" value={4} />
                <Picker.Item label="4.5 stars" value={4.5} />
                <Picker.Item label="5 stars" value={2} />
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
      </Container>
    );
  }
}
