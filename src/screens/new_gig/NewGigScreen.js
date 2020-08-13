import React, {Component} from 'react';
import {
  Container,
  Content,
  Text,
  View,
  Item,
  Input,
  DatePicker,
  Textarea,
  Picker,
  Icon,
  Button,
  CheckBox,
  Fab,
  Spinner,
} from 'native-base';
import {Styles} from './NewGigStyle';
import {strings as AppStrings} from './../../strings';
import {TouchableOpacity, Dimensions, ScrollView, ActivityIndicator} from 'react-native';
import {Colours, getCurrency, toFeet, getId, getDateDifference, parseDate} from '../../utils';
import TimePicker from "../../components/TimePicker";
import LinearGradient from 'react-native-linear-gradient';
import {GooglePlacesInput} from '../../components/PlacesInput';
import {getServiceCategories, getStates} from '../../api/GetApiFactorsAPI';
import {AppContext} from './../../../AppProvider';
import {Dialog, ProgressDialog} from 'react-native-simple-dialogs';
import {postGig} from '../../api/GigAPI';
import moment from 'moment';

const {} = AppStrings;
const {addServiceString, genericStrings, newGigStrings} = AppStrings;
const strings = newGigStrings;
export default class NewGig extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      selected2: '',
      adFeeDaily: 200,
      glamFee: 0,
      adFee: 0,
      glamNo: 0,
      adDuration: 1,
      duration: 0,
      days: 0,
      currency: getCurrency(),
      title: '',
      service: '',
      description: '',
      starting_at: new Date(),
      services: [],
      states: [],
      serviceSelected: -1,
      genderSelected: 'male',
      height: 0,
      stateSelected: [],
      windowheight: 0,
      dialogTitle: '',
      dialogVisible: false,
      timeToPost: 0,
      spinnerVisible: false,
      startingAtPlaceholder: 'Start Date',
      progressVisible: true,
      gigId: undefined,
      draftGig: false,
    };
  }

  async componentDidMount() {
    this.set({windowheight: Dimensions.get('window').height});
    await getServiceCategories(this.context, this.set);
    await getStates(this.context, this.set);

    if (this.props.navigation.getParam('gig', undefined) != undefined) {
      /*** draft gig is editted */
      this.loadGigInfo();
      this.setState({draftGig: true});
    }
    this.set({progressVisible: false});
  }

  set = v => {
    this.setState(v);
  };

  

  setDate = date => {
    console.log('setting date', date);
    this.setState({starting_at: date});
  };

  onValueChange = () => {};

  serviceSelected = text => {
    this.set({serviceSelected: text});
  };

  stateSelected = text => {
    console.log('state sel', text);
    let selectedStates = this.state.stateSelected;
    let indexOf = selectedStates.indexOf(text);
    let allStates = -1;
    if (text != -1) {
      /**
        remove all states
    */
      if (selectedStates.indexOf(allStates) != -1) {
        delete selectedStates[selectedStates.indexOf(allStates)];
      }

      if (indexOf == -1) {
        /**
         * add city_id to selected states
         */
        selectedStates.push(text);
      } else {
        /**
         * remove city_id from selected states
         */
        delete selectedStates[indexOf];
      }
    } else {
      /**
       * no selected state
       */
      selectedStates = [allStates];
    }

    this.setState({stateSelected: selectedStates});
  };

  onTimeToPost = text => {
    this.set({timeToPost: text});
  };

  genderSelected = text => {
    this.set({genderSelected: text});
  };

  renderStates = () => {
    return this.state.states.map(state => (
      <TouchableOpacity
        key={state.id}
        style={[{flexDirection: 'row', marginBottom: 3}]}
        onPress={() => this.stateSelected(state.id)}>
        <CheckBox
          checked={
            this.state.stateSelected.indexOf(state.id) != -1 ? true : false
          }
          onPress={() => this.stateSelected(state.id)}
        />
        <Text style={[{marginLeft: 20}]}>{state.name}</Text>
      </TouchableOpacity>
    ));
  };

  loadGigInfo = () => {
    let gig = this.props.navigation.getParam('gig', undefined);
    console.log("gig", gig);
    this.setState({
      gigId: gig.id,
      title: gig.title,
      amount: gig.amount,
      total_amount: gig.total_amount,
      duration: gig.duration,
      description: gig.description,
      venue: gig.venue,
      starting_at: moment(gig.starting_at).toDate(),
      ending_at: moment(gig.ending_at).toDate(),
      serviceSelected: gig.category.id,
      stateSelected: (JSON.parse(gig.location)),
      timeToPost: 3,
      height: gig.height,
      gender: (gig.gender == null) ? -1 : gig.gender,
      adDuration: getDateDifference(parseDate(gig.gig_ad.starting_at), parseDate(gig.gig_ad.ending_at)),
      glamFee: gig.amount,
      glamNo: gig.persons,
      days: getDateDifference(parseDate(gig.starting_at), parseDate(gig.ending_at)),
      startingAtPlaceholder: moment(gig.starting_at).format('DD/MM/YYYY'),
      selectedTime: moment(gig.starting_at).format('HH:mm'),
    });
  }

  onSubmitPress = async () => {
    this.setState({spinnerVisible: true});

    let endingDate = moment(this.state.starting_at)
      .add(this.state.days, 'days')
      .format('YYYY-MM-DD');

    let stateSelected = this.state.stateSelected;
    if (stateSelected.length == 1 && stateSelected.indexOf(-1) != -1) {
      stateSelected = [];
    }
    
    let data = {
      emptor_id: getId(),
      title: this.state.title,
      amount: this.state.glamFee,
      total_amount: this.calcTotalGlamFee() + this.calcTotalAdFee(),
      duration: this.state.duration,
      description: this.state.description,
      venue: this.state.venue,
      persons: this.state.glamNo,
      starting_at: moment(this.state.starting_at).format('YYYY-MM-DD'),
      ending_at: endingDate,
      category_id: this.state.serviceSelected,
      location: JSON.stringify(this.state.stateSelected),
      draft: this.state.timeToPost == 3 ? true : false,
      gender:
        this.state.genderSelected == -1 ? null : this.state.genderSelected,
      height: this.state.height,
      ad_duration: this.state.adDuration,
    };

    if (this.state.gigId !== undefined) {
      data.gig_id = this.state.gigId;
    }

    /**
     * gig to be run by cronjob
     */
    if (this.state.timeToPost == 1) {
      data.scheduled_at = moment(new Date())
        .add(30, 'minutes')
        .format('YYYY-MM-DD HH:mm');
    } else if (this.state.timeToPost == 2) {
      data.scheduled_at = moment(new Date())
        .add(1, 'hour')
        .format('YYYY-MM-DD HH:mm');
    }

    

    await postGig(data, this.set, this.context, this.props.navigation);
    
    this.setState({spinnerVisible: false});
  };

  calcTotalGlamFee = () => {
    let glamFee =
      this.state.glamFee * this.state.glamNo * parseInt(this.state.days);
    if (isNaN(glamFee)) {
      glamFee = 0;
    }

    return glamFee;
  };

  calcTotalAdFee = () => {
    let adFee =
      parseInt(this.state.adFeeDaily) * parseInt(this.state.adDuration);
    if (isNaN(adFee)) {
      adFee = 0;
    }

    return adFee;
  };

  render() {
    let glamFee = this.calcTotalGlamFee();
    let adFee = this.calcTotalAdFee();

    let gigTotal = glamFee + adFee;
    let windowheight = Dimensions.get('window').height;

    console.log("Render", this.state);
    return (
      <View
        style={{
          position: 'absolute',
          flex: 1,
          width: '100%',
          height: windowheight,
        }}>
        <ScrollView
          style={{
            maxHeight: windowheight,
            elevation: 2,
            zIndex: 2,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}>
          <LinearGradient
            colors={[Colours.grey, Colours.black]}
            style={{
              flex: 1,
              height: Dimensions.get('screen').height,
              paddingRight: 10,
              paddingLeft: 10,
              marginBottom: 20,
            }}>
            {/* <View style={{ flex: 1, flexDirection: 'column'}}> */}
            <View style={{width: '100%', flexDirection: 'row'}}>
              <Text
                style={[
                  Styles.newGigText,
                  {alignSelf: 'flex-start', flex: 1, textAlign: 'left'},
                ]}>
                {strings.newGig}
              </Text>
              <View style={{alignSelf: 'center', height: 15, width: 30}}>
                <ActivityIndicator animating={this.state.spinnerVisible} color={Colours.darkmagenta} />
                {/* {this.state.spinnerVisible && <Spinner color={Colours.darkmagenta} size={15} style={{alignSelf: 'center'}} />} */}
              </View>
              
              
              <Text
                onPress={this.onSubmitPress}
                style={[
                  Styles.newGigText,
                  {
                    width: 120,
                    alignSelf: 'flex-end',
                    textAlign: 'center',
                    backgroundColor: Colours.darkmagenta,
                    color: Colours.white,
                    padding: 3,
                    borderRadius: 10,
                    marginBottom: 5,
                    marginTop: 5,
                  },
                ]}>
                {strings.save}
              </Text>
            </View>

            {/* serivce type */}
            <View
              style={[
                {
                  padding: 10,
                  position: 'absolute',
                  width: '100%',
                  height: '70%',
                  top: '3%',

                },
              ]}>
              <View style={{alignItems: 'flex-end'}}>
                <View style={[{flexDirection: 'row'}]}>
                  <Text style={[Styles.topTextTotal]}>{strings.gigTotal} </Text>
                  <Text style={[Styles.topTextTotal]}>
                    {this.state.currency + gigTotal}
                  </Text>
                </View>
                <Text style={[Styles.topTextList]}>
                  {strings.glamFee} {this.state.currency + glamFee}
                </Text>
                <Text style={[Styles.topTextList, {fontSize: 16}]}>
                  {strings.adFee} {this.state.currency + adFee}
                </Text>
              </View>

              {/*  */}
              <View style={[Styles.rowView, {marginBottom: 5}]}>
                <Input
                  placeholder={'Gig Title'}
                  style={[Styles.round, {flex: 1.5, textAlign: 'left'}]}
                  onChangeText={text => this.setState({title: text})}
                  value={this.state.title}
                />

                {/* <TouchableOpacity style={[Styles.round, Styles.selectServiceBtn]}>
                                        <Text style={[Styles.selectServiceText, {}]}>Select Service</Text>
                                    </TouchableOpacity> */}
              </View>
              <View style={[Styles.rowView]}>
                <View
                  style={[
                    Styles.round,
                    {flex: 1, backgroundColor: Colours.gray},
                  ]}>
                  <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="ios-arrow-down" />}
                    headerStyle={{backgroundColor: '#b95dd3'}}
                    headerBackButtonTextStyle={{color: '#fff'}}
                    headerTitleStyle={{color: '#fff'}}
                    textStyle={{color: 'white'}}
                    selectedValue={this.state.serviceSelected}
                    onValueChange={this.serviceSelected.bind(this)}>
                    <Picker.Item label={addServiceString.service} value={-1} />
                    {this.state.services.map(service => {
                      return (
                        <Picker.Item
                          key={service.id}
                          label={service.name}
                          value={service.id}
                        />
                      );
                    })}
                    {/* <Picker.Item label="Male" value="male" />
                                            <Picker.Item label="Female" value="female" /> */}
                  </Picker>
                </View>
                <TouchableOpacity
                  style={[
                    Styles.round,
                    {
                      marginLeft: 10,
                      flex: 1,
                      backgroundColor: Colours.gray,
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                  ]}
                  onPress={() => this.setState({dialogVisible: true})}>
                  <Text
                    style={{
                      textAlign: 'center',
                      textAlignVertical: 'center',
                      alignSelf: 'stretch',
                      color: 'white',
                    }}>
                    Select States
                  </Text>
                </TouchableOpacity>
              </View>
              <Textarea
                rowSpan={4}
                style={{
                  width: '100%',
                  backgroundColor: 'white',
                  marginTop: 5,
                  borderRadius: 10,
                }}
                placeholder={strings.gigDescription}
                onChangeText={text => this.setState({description: text})}
                value={this.state.description}
              />
              <View style={[{flexDirection: 'row'}]}>
                <View style={[{flexDirection: 'row', flex: 1}]}>
                  <Text style={[Styles.inputSideTextLeft]}>N</Text>
                  <Input
                    style={[Styles.glamFeeInput]}
                    placeholder={this.state.glamFee != 0 ? this.state.glamFee.toString() : strings.offerPerGlam}
                    onChangeText={text => this.setState({glamFee: text})}
                    keyboardType="numeric"
                    value={(!this.state.draftGig && this.state.glamFee == 0) ? undefined : this.state.glamFee.toString()}
                  />
                </View>
                <View style={[{flexDirection: 'row', flex: 1}]}>
                  <Input
                    placeholder={this.state.glamNo != 0 ? this.state.glamNo.toString() : strings.noOfGlams}
                    style={[Styles.glamNoInput]}
                    keyboardType="numeric"
                    onChangeText={text => this.setState({glamNo: text})}
                    value={(!this.state.draftGig && this.state.glamNo == 0) ? undefined : this.state.glamNo.toString()}
                  />
                  {/* <Text style={[Styles.inputSideTextRight]}>{strings.glams}</Text> */}
                </View>
              </View>
              <View style={[Styles.rowView, {justifyContent: 'space-around'}]}>
                <Input
                  style={[
                    Styles.round,
                    Styles.backgroundWhite,
                    {maxWidth: 50, fontSize: 14},
                  ]}
                  placeholder={this.state.days != 0 ? this.state.days.toString() : 'Days'}
                  onChangeText={text => this.setState({days: text})}
                  keyboardType={'numeric'}
                  value={(!this.state.draftGig && this.state.days == 0) ? undefined : this.state.days.toString()}
                />
                <View
                  style={[
                    Styles.round,
                    {marginLeft: 3, marginRight: 3, justifyContent: 'center'},
                  ]}>
                  <DatePicker
                    defaultDate={new Date()}
                    minimumDate={new Date()}
                    locale={'en'}
                    timeZoneOffsetInMinutes={undefined}
                    modalTransparent={false}
                    animationType={'fade'}
                    androidMode={'default'}
                    placeHolderText={this.state.startingAtPlaceholder}
                    textStyle={{color: 'green'}}
                    placeHolderTextStyle={{color: '#d3d3d3'}}
                    onDateChange={this.setDate}
                    disabled={false}
                  />
                </View>
                <View
                  style={[
                    Styles.round,
                    {justifyContent: 'center', marginRight: 3, padding: 5},
                  ]}>
                  <TimePicker
                    onConfirm={time => this.setState({selectedTime: time})}
                    time={this.state.selectedTime}
                  />
                </View>
                <Input
                  style={[
                    Styles.round,
                    Styles.backgroundWhite,
                    {maxWidth: 70, fontSize: 14},
                  ]}
                  placeholder={this.state.duration != 0 ? this.state.duration.toString() :strings.dailyDuration}
                  onChangeText={text => this.setState({duration: text})}
                  value={(!this.state.draftGig && this.state.duration == 0) ? undefined : this.state.duration.toString()}
                />
              </View>
            </View>
            {/* lower View */}
            <View
              style={[
                Styles.round,
                {
                  marginTop: 5,
                  position: 'absolute',
                  width: '98%',
                  top: 0.65 * Dimensions.get('window').height,
                  left: 10,
                  height: '30%',
                  backgroundColor: 'transparent',
                },
              ]}>
              <View
                style={{
                  backgroundColor: 'white',
                  position: 'absolute',
                  width: '100%',
                  borderRadius: 10,
                  zIndex: 100,
                  elevation: 5,
                }}>
                <GooglePlacesInput
                  placeholder={(this.state.venue != '') ? this.state.venue : strings.location}
                  top={5}
                  left={3}
                  width={'98%'}
                  onSelect={place => {
                    // console.log("places", place);
                    if (place.status == 'OK') {
                      this.setState({venue: place.result.formatted_address});
                    }
                  }}
                />
              </View>
              <View
                style={[
                  Styles.rowView,
                  {marginTop: 10, height: 60, alignItems: 'center', top: 60},
                ]}>
                <View
                  style={[
                    Styles.round,
                    {
                      flex: 1,
                      height: 80,
                      maxHeight: 60,
                      width: 80,
                      flexDirection: 'row',
                      alignItems: 'center',
                    },
                  ]}>
                  <Input
                    style={[Styles.round, {padding: 10, flex: 0.6}]}
                    placeholder={strings.height + ' cm'}
                    onChangeText={text => {
                      this.setState({height: text});
                    }}
                    keyboardType={'numeric'}
                    value={(!this.state.draftGig && this.state.height == 0) ? undefined : this.state.height.toString()}
                  />
                  <Text style={{color: 'black', fontSize: 14, flex: 0.4}}>
                    {toFeet(this.state.height)}
                  </Text>
                </View>
                {/* <Input style={[Styles.round, { padding: 10,flex: 1 }]} placeholder={strings.adDuration} /> */}
                <View style={[Styles.round, {marginLeft: 10, flex: 1}]}>
                  <Picker
                    style={[{borderColor: 'black'}]}
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    headerStyle={{backgroundColor: '#b95dd3'}}
                    headerBackButtonTextStyle={{color: '#fff'}}
                    headerTitleStyle={{color: '#fff'}}
                    selectedValue={this.state.genderSelected}
                    onValueChange={this.genderSelected.bind(this)}>
                    <Picker.Item value={'-1'} label={'All'} />
                    <Picker.Item value={'male'} label={'Male'} />
                    <Picker.Item value={'female'} label={'Female'} />
                  </Picker>
                </View>
              </View>
              <View
                style={[
                  {
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 120,
                    paddingTop: 5,
                    zIndex: 1,
                  },
                ]}>
                <View
                  style={[
                    Styles.rowView,
                    {marginTop: 10, height: 60, alignItems: 'center'},
                  ]}>
                  <View
                    Style={[
                      Styles.round,
                      {
                        flex: 1,
                        backgroundColor: 'red',
                        height: 60,
                        maxHeight: 60,
                        width: 60,
                      },
                    ]}>
                    <Input
                      style={[Styles.round, {padding: 10, flex: 1}]}
                      placeholder={(this.state.adDuration != 1) ? this.state.adDuration.toString() : strings.adDuration}
                      onChangeText={text => this.setState({adDuration: text})}
                      keyboardType={'numeric'}
                      value={(!this.state.draftGig && this.state.adDuration == 1) ? undefined : this.state.adDuration.toString()}
                    />
                    <Text style={{color: 'white', fontSize: 14}}>
                      {this.state.currency +
                        this.state.adFeeDaily.toString() +
                        ' ' +
                        strings.perDay}{' '}
                    </Text>
                  </View>
                  {/* <Input style={[Styles.round, { padding: 10,flex: 1 }]} placeholder={strings.adDuration} /> */}
                  <View style={[Styles.round, {marginLeft: 10, flex: 1}]}>
                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      style={{width: '100%', flex: 1}}
                      placeholder="Select Service"
                      placeholderStyle={{color: '#bfc6ea'}}
                      placeholderIconColor="#007aff"
                      textStyle={{color: 'white'}}
                      selectedValue={this.state.timeToPost}
                      onValueChange={this.onTimeToPost.bind(this)}>
                      <Picker.Item label="Post Now" value={0} />
                      <Picker.Item label="Post in 30mins" value={1} />
                      <Picker.Item label="Post in 1hr" value={2} />
                      <Picker.Item label="Save as Draft" value={3} />
                    </Picker>
                  </View>
                </View>

                {/* <Button block onPress={() => console.log('clicked')}>
                  <Text>Done</Text>
                </Button> */}
                {/* <TouchableOpacity 
                                        style={[Styles.round, {alignSelf: 'center',  backgroundColor: Colours.darkmagenta, paddingLeft: 25, paddingRight: 25, paddingTop: 7,paddingBottom: 7}]}
                                        onPress={() => {
                                            this.onSubmitPress();
                                        }}>
                                        <Text style={{color: 'white'}}>Done</Text>
                                    </TouchableOpacity> */}
                {/* <TouchableOpacity
                                    style={[Styles.round, {alignSelf: 'center', marginTop: 40, backgroundColor: Colours.darkmagenta, paddingLeft: 25, paddingRight: 25, paddingTop: 7,paddingBottom: 7}]}
                                    onPress={() => {
                                        console.log("btn clicked");
                                         this.onSubmitPress(); 
                                    }}
                                    >
                                         <Icon name='ios-calendar' style={{color: Colours.green, fontSize: 44}} /> 
                                        <Text style={[{ fontSize: 18, textAlign: 'center', color: 'white'}]}>Done</Text>
                                    </TouchableOpacity>    */}
              </View>
            </View>
            {/* </View> */}
          </LinearGradient>
        </ScrollView>
        <Dialog
          visible={this.state.dialogVisible}
          title={this.state.dialogTitle}
          onTouchOutside={() => this.setState({dialogVisible: false})}
          dialogStyle={{padding: 0}}
          contentStyle={{padding: 0, width: '100%'}}>
          <View style={{padding: 10}}>
            <ScrollView style={[{maxHeight: 200}]}>
              <View>
                <TouchableOpacity key={-1} style={[{flexDirection: 'row'}]}>
                  <CheckBox
                    checked={
                      this.state.stateSelected.indexOf(-1) != -1 ? true : false
                    }
                    onPress={() => this.stateSelected(-1)}
                  />
                  <Text style={[{marginLeft: 20}]}>All states</Text>
                </TouchableOpacity>
                {this.renderStates()}
              </View>
            </ScrollView>

            <Button
              block
              style={{alignItems: 'center'}}
              onPress={() => this.setState({dialogVisible: false})}>
              <Text style={{textAlign: 'center'}}>Done</Text>
            </Button>
          </View>
        </Dialog>
        <ProgressDialog
            visible={this.state.progressVisible}
            title="Please Wait..."
            message={'Loading gig info'}
        />
      </View>
    );
  }
}
