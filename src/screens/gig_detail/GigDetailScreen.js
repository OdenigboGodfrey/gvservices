import React, {Component} from 'react';
import {AppContext} from './../../../AppProvider';
import {
  Container,
  Content,
  View,
  Text,
  Icon,
  Separator,
  Textarea,
  Item,
  Input,
  Button,
  Toast,
  CheckBox,
  Header,
  Left,
  Body,
  Footer,
} from 'native-base';
import {Image, TouchableOpacity, ScrollView, Dimensions} from 'react-native';
import {
  modelMale01,
  getEmptorMode,
  getCurrency,
  Colours,
  getId,
  getImage,
  getDateDifference,
  parseDate,
  getDate,
  getTime,
  setContext,
  toFeet,
  getState,
} from '../../utils';
import {Styles} from './GigDetailStyle';
import {closeGig, sendInterest} from '../../api/GigAPI';
import {strings as AppStrings} from '../../strings';
import moment from "moment";
import {Dialog} from 'react-native-simple-dialogs';
import LinearGradient from 'react-native-linear-gradient';

const {genericStrings, gigDetailStrings} = AppStrings;
const strings = gigDetailStrings;

export default class GigDetailScreen extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      height: 0,
      imageHeight: 0,
      description: genericStrings.longText,
      gig: props.navigation.getParam('gig', undefined),
      locations: JSON.parse(props.navigation.getParam('gig', []).location),
      dialogVisible: false,
      amount: 0,
    };
  }

  componentDidMount() {
    setContext(this.context);
    this.setState({height: Dimensions.get('screen').height});
  }

  set = value => {
    this.setState(value);
  };

  renderLocations = () => {
    let locations = [];
    // getState
    // console.log("states", this.context.state.states, this.state.gig.location)
    // this.state.locations = JSON.parse(this.state.location);
    if (this.state.locations.length == 0) {
      return(
        <View key={0} style={[{flexDirection: 'row', marginBottom: 3}]}>
          <Text style={[{marginLeft: 20, color: 'white'}]}>{genericStrings.na}</Text>
        </View>
      );
    }
    else 
    {
      for (let i = 0; i < this.state.locations.length; i++) {
        let stateName = '';
        try {
          // used to catch key error thrown if state hasn't been re-rendered/saved
          let state = getState(
            this.context.state.states,
            this.state.locations[i],
          );
          stateName = state.name;
        } catch (e) {}
        if (stateName != '') {
          locations.push(
            <View key={i} style={[{flexDirection: 'row', marginBottom: 3}]}>
              <CheckBox checked={true} disabled />
              <Text style={[{marginLeft: 20, color: 'white'}]}>{stateName}</Text>
            </View>,
          );
        }
      }
      return locations;
    }
    
  };

  onActionPress = async actionType => {
    // if (typeof(actionType) == 'boolean') {

    this.setState({action: actionType});
    /** perform action on booking */
    if (actionType) {
      if (!getEmptorMode()) {
        await sendInterest(
          {
            emptor_id: this.state.gig.emptor_id,
            glam_id: getId(),
            gig_id: this.state.gig.id,
          },
          this.set,
          this.context,
          this.props.navigation,
        );
      }
    } else {
      await closeGig(
        {
          gig_id: this.state.gig.id,
          emptor_id: getId(),
        },
        this.set,
        this.context,
        this.props.navigation,
      );
    }

    // this.props.navigation.goBack();

    // }
    // else {
    //     /** counter gig */
    //     this.set({dialogVisible: false});
    //     if (this.state.amount > 0) {
    //         await counterGigAmount(
    //             {
    //                 amount: this.state.amount,
    //                 gig_id: this.state.gig.id
    //             },
    //             this.set, this.context);

    //         this.props.navigation.state.params.refreshGigs();
    //         this.props.navigation.goBack();
    //     }
    //     else {
    //         Toast.show({
    //             text: 'Amount must be greater than 0',
    //             type: 'danger',
    //             buttonText: genericStrings.dismiss
    //         });
    //     }

    // }
  };

  render() {
    let emptorGender = !getEmptorMode()
      ? this.state.gig.emptor.gender
      : this.context.state.user_data.gender;
    let amount = this.state.gig.amount;

    //this.state.gig.
    let image = getImage(
      'emptors',
      this.state.gig.emptor.code,
      this.state.gig.emptor.avatar,
      'avatars',
    );


    return (
      <Container style={{flex: 1}}>
        <Header
          style={{backgroundColor: Colours.secondaryBlack}}
          androidStatusBarColor={Colours.secondaryBlack}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon
                name={
                  Platform.OS == 'android' ? 'arrow-back' : 'ios-arrow-back'
                }
              />
            </Button>
          </Left>
          <Body>
            <Text
              style={[
                {
                  alignSelf: 'stretch',
                  textAlign: 'left',
                  textAlignVertical: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                },
              ]}>
              Gig Details
            </Text>
          </Body>
        </Header>
        <Content>
          <LinearGradient
            colors={[Colours.secondaryBlack, Colours.black]}
            style={{
            flex: 1,
            height: Dimensions.get('screen').height,
            paddingRight: 10,
            paddingLeft: 10,
          }}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
              {/* <Image 
                                style={{width: '100%', flex: 0.6, resizeMode: 'stretch'}}
                                source={image}
                            /> */}
              <View style={{width: '100%', flex: 1}}>
                <View
                  style={{
                    flex: 0.8,
                    padding: 10,
                    flexDirection: 'column',
                    flexWrap: 'wrap',
                  }}>
                  <Separator style={[Styles.separator]}>
                    <Text>{strings.gigTitle}</Text>
                  </Separator>
                  <View style={[Styles.mainView, {justifyContent: 'flex-start'}]}>
                    <View style={[Styles.floatingView]}>
                      <Icon name={'ios-person'} style={[Styles.iconStyle]} />
                      <Text style={[Styles.textStyle]}>{this.state.gig.title}</Text>
                    </View>
                  </View>
                  <Separator style={[Styles.separator]}>
                    <Text>{genericStrings.emptor}</Text>
                  </Separator>
                  <View style={[Styles.mainView]}>
                    <View style={[Styles.floatingView]}>
                      <Icon name={'ios-person'} style={[Styles.iconStyle]} />
                      <Text style={[Styles.textStyle]}>
                        {/** if user is a glam, show local glam info */
                        this.state.gig.emptor.first_name +
                          ' ' +
                          this.state.gig.emptor.last_name}
                      </Text>
                    </View>
                    <View style={[Styles.floatingView]}>
                      <Icon
                        name={emptorGender == 'male' ? 'ios-male' : 'ios-female'}
                        style={[Styles.iconStyle]}
                      />
                      <Text style={[Styles.textStyle]}>{emptorGender.toString().toUpperCase()}</Text>
                    </View>
                    <View style={[Styles.floatingView, {width: 10}]}>
                      {/* <Icon name={'ios-cash'} style={[Styles.iconStyle]} />
                                            <Text  style={[Styles.textStyle]}>{ 100 + getCurrency() }</Text> */}
                    </View>
                  </View>
                  <Separator style={[Styles.separator]}>
                    <Text>{strings.gigDetail}</Text>
                  </Separator>
                  <View style={[Styles.mainView]}>
                    <View style={[Styles.floatingView]}>
                      <Icon name={'ios-disc'} style={[Styles.iconStyle]} />
                      <Text style={[Styles.textStyle]}>
                        {this.state.gig.service}
                      </Text>
                    </View>
                    <View style={[Styles.floatingView]}>
                      <Icon name={'ios-hourglass'} style={[Styles.iconStyle]} />
                      <Text style={[Styles.textStyle]}>
                        {getDateDifference(
                          parseDate(this.state.gig.starting_at),
                          parseDate(this.state.gig.ending_at),
                        ) + ' day(s)'}
                      </Text>
                    </View>
                    <View style={[Styles.floatingView]}>
                      <Icon name={'ios-cash'} style={[Styles.iconStyle]} />
                      <Text style={[Styles.textStyle]}>
                        {amount + getCurrency()}
                      </Text>
                    </View>
                  </View>
                  <Separator style={[Styles.separator]}>
                    <Text>{strings.gigRequirement}</Text>
                  </Separator>
                  <View style={[Styles.mainView]}>
                    <View style={[Styles.floatingView]}>
                      {/* height */}
                      <Icon name={'ios-disc'} style={[Styles.iconStyle]} />
                      <Text style={[Styles.textStyle]}>
                        {this.state.gig.height != null
                          ? this.state.gig.height +
                            ' ' +
                            toFeet(this.state.gig.height)
                          : genericStrings.na}{' '}
                      </Text>
                    </View>
                    <View style={[Styles.floatingView]}>
                      {/* Gender */}
                      <Icon
                        name={
                          this.state.gig.gender == null
                            ? 'ios-male'
                            : this.state.gig.gender == 'male'
                            ? 'ios-male'
                            : 'ios-female'
                        }
                        style={[Styles.iconStyle]}
                      />
                      <Text style={[Styles.textStyle]}>
                        {(this.state.gig.gender == null || this.state.gig.gender == 'null') ? genericStrings.na: this.state.gig.gender}
                      </Text>
                    </View>
                    <View style={[Styles.floatingView]}>
                      {/* location icon(hashtag) */}
                      <Icon name={'ios-cash'} style={[Styles.iconStyle]} />
                      <Text style={[Styles.textStyle]}>
                        {this.state.gig.persons} persons
                      </Text>
                    </View>
                  </View>
                  <Separator style={[Styles.separator]}>
                    <Text>{genericStrings.duration}</Text>
                  </Separator>
                  <View style={[Styles.mainView]}>
                    <View style={[Styles.floatingView]}>
                      <Icon name={'ios-calendar'} style={[Styles.iconStyle]} />
                      <Text style={[Styles.textStyle]}>
                        {getDate(this.state.gig.starting_at)}
                      </Text>
                    </View>
                    <View style={[Styles.floatingView]}>
                      <Icon name={'ios-calendar'} style={[Styles.iconStyle]} />
                      <Text style={[Styles.textStyle]}>
                        {getDate(this.state.gig.ending_at)}
                      </Text>
                    </View>
                    <View style={[Styles.floatingView]}>
                      <Icon name={'ios-clock'} style={[Styles.iconStyle]} />
                      <Text style={[Styles.textStyle]}>
                        {moment(this.state.gig.starting_at).format('HH:mm')}-
                        {moment(this.state.gig.ending_at).format('HH:mm')}
                      </Text>
                    </View>
                  </View>
                  <Separator style={[Styles.separator]}>
                    <Text>{'Venue'}</Text>
                  </Separator>
                  <View style={[Styles.mainView, {justifyContent: 'flex-start'}]}>
                    <View style={[Styles.floatingView, {alignItems: 'flex-start'}]}>
                      <Icon name={'ios-home'} style={[Styles.iconStyle]} />
                      <Text style={[Styles.textStyle, {textAlign: 'left'}]}>
                        {this.state.gig.venue}
                      </Text>
                    </View>
                  </View>
                  <Separator style={[Styles.separator]}>
                    <Text>{genericStrings.location}</Text>
                  </Separator>
                  <View style={[Styles.mainView, {justifyContent: 'flex-start'}]}>
                    <View
                      style={[
                        Styles.floatingView,
                        {marginRight: 0, flexWrap: 'wrap'},
                      ]}>
                      {this.renderLocations()}
                    </View>
                  </View>
                  <Separator style={[Styles.separator]}>
                    <Text>{genericStrings.description}</Text>
                  </Separator>
                  <View style={[Styles.mainView]}>
                    <ScrollView style={{height: 120}}>
                      <Text style={[Styles.textArea]}>
                        {this.state.gig.description}
                      </Text>
                    </ScrollView>

                    {/* <Textarea 
                                            value={this.state.description}
                                            editable={false}
                                            
                                            rowSpan={5}
                                            
                                        /> */}
                  </View>

                  <View style={{flexDirection: 'row'}} />
                  <View style={{flexDirection: 'row'}} />
                </View>
              </View>
            </ScrollView>
            <Dialog
              visible={this.state.dialogVisible}
              title={this.state.dialogTitle}
              onTouchOutside={() => this.setState({dialogVisible: false})}
              dialogStyle={{padding: 0}}
              contentStyle={{padding: 0, width: '100%'}}>
              <View style={{padding: 10}}>
                <Item bordered>
                  <Input
                    placeholder={'Enter Final Amount'}
                    onChangeText={text => this.set({amount: text})}
                    keyboardType={'numeric'}
                  />
                </Item>
                <Button
                  block
                  style={{alignItems: 'center'}}
                  onPress={() => this.onActionPress('final')}>
                  <Text style={{textAlign: 'center'}}>Done</Text>
                </Button>
              </View>
            </Dialog>
          </LinearGradient>
        </Content>
        <Footer style={{backgroundColor: Colours.secondaryBlack}}>
          <View
            style={{
              width: '100%',
              justifyContent: 'space-evenly',
              flexDirection: 'row',
              borderTopColor: Colours.gray,
              borderWidth: 1,
              paddingTop: 10,
            }}>
            {/***
             * show glam the interested button
             */
            !getEmptorMode() && (
              <TouchableOpacity onPress={() => this.onActionPress(true)}>
                <Text style={{color: Colours.green}}>Interested</Text>
              </TouchableOpacity>
            )}
            {/**
             * sow emptor interests
             */
            getEmptorMode() && this.state.gig.draft == 0 && (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('ListUsers', {
                    users: this.state.gig.interests,
                    userType: 'glam',
                    header: 'Interested Glams',
                    nextPage: 'Interest',
                    source: 'gigDetail',
                    gigId: this.state.gig.id,
                    gig: this.state.gig,
                  })
                }
                style={{flexDirection: 'row'}}>
                {this.state.gig.unfinished_rating != undefined &&
                  this.state.gig.unfinished_rating && (
                    <Icon
                      name={'ios-alert'}
                      style={{color: Colours.darkmagenta, fontSize: 22}}
                    />
                  )}
                <Text style={{color: Colours.darkmagenta}}>
                  {this.state.gig.interests.length} Interest
                </Text>
              </TouchableOpacity>
            )}
            {/**
             * sow emptor interests
             */
            getEmptorMode() && this.state.gig.draft == 1 && (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('NewGig', {
                    gigId: this.state.gig.id,
                    gig: this.state.gig,
                  })
                }
                style={{flexDirection: 'row'}}>
                {this.state.gig.unfinished_rating != undefined &&
                  this.state.gig.unfinished_rating && (
                    <Icon
                      name={'ios-alert'}
                      style={{color: Colours.darkmagenta, fontSize: 22}}
                    />
                  )}
                <Text style={{color: Colours.darkmagenta}}>
                  Edit
                </Text>
              </TouchableOpacity>
            )}
            {/* {
                                  getEmptorMode() && this.state.gig.unfinished_rating != undefined && !this.state.gig.unfinished_rating && 
                                  <TouchableOpacity onPress={() => this.setState({dialogVisible: true})}>
                                      <Text style={{color: Colours.darkmagenta}}>Rate</Text>
                                  </TouchableOpacity>
                              } */}
            {/**
             * show emptor the close button
             */
            getEmptorMode() && (
              <TouchableOpacity onPress={() => this.onActionPress(false)}>
                <Text style={{color: Colours.red}}>Close</Text>
              </TouchableOpacity>
            )}
          </View>
        </Footer>
      </Container>
    );
  }
}
