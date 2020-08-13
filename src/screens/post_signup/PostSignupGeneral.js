import React, {Component} from 'react';
import {
  View,
  Text,
  Textarea,
  Icon,
  Container,
  Content,
  CardItem,
  Item,
  Input,
  Form,
  Button,
  Body,
  Header,
  Picker,
  DatePicker,
  Spinner,
  Toast,
} from 'native-base';
import {Image, TouchableOpacity, StyleSheet, Keyboard} from 'react-native';
import {Colours, modelMale01, getId, getEmptorMode, toFeet} from '../../utils';
import {strings as AppStrings} from '../../strings';
import {Styles} from './PostSignupStyle';
import {ScrollView} from 'react-native-gesture-handler';
import {edit} from '../../api/EditAPI';
import {SpinnerButton} from '../../components/SpinnerButton';
import {AppContext} from '../../../AppProvider';

const {editProfileStrings, genericStrings} = AppStrings;
const strings = editProfileStrings;
const isEmptorMode = getEmptorMode();

export default class PostSignupGeneral extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
  }

  state = {
    genderSelected: 'male',
    firstName: '',
    lastName: '',
    mobile: '',
    date: '',
    height: '',
    btnClicked: false,
    enforce: false,
  };

  async componentDidMount() {
    // console.log("ctx",JSON.stringify(this.context.state.token), a);
    let userData = this.props.navigation.getParam('data', undefined);
    if (this.context.state.user_data != undefined) {
      console.log(JSON.stringify(this.context.state.user_data));
      this.setState({
        firstName: this.context.state.user_data.first_name,
        lastName: this.context.state.user_data.last_name,
        mobile: this.context.state.user_data.phone,
        gender: this.context.state.user_data.gender,
        enforce:
          this.props.navigation.getParam('enforce', undefined) != undefined,
      });
    }
  }

  genderSelected = gender => {
    this.setState({genderSelected: gender});
  };

  onNextPress = async () => {
    /*** validations */
    if (
      (this.state.firstName == '' ||
        this.state.lastName == '' ||
        this.state.mobile == '' ||
        (!isEmptorMode && this.state.date == '') ||
        (!isEmptorMode && this.state.height == ''))
    ) {
      Toast.show({
        text: strings.fillAllFields,
        type: 'danger',
        buttonText: genericStrings.dismiss,
      });
      return;
    }

    if (this.state.height.length >=4) {
      Toast.show({
        text: 'Height may not be longer than 4.',
        type: 'danger',
        buttonText: genericStrings.dismiss,
      });
      return;
    }

    this.setState({btnClicked: true});
    // let data = FormData();
    // data.append("first_name", this.state.firstName);
    // data.append("last_name", this.state.lastName);
    // data.append("phone", this.state.phone);
    // data.append("height", this.state.height);
    // data.append("gender", this.state.gender);
    // data.append("dob", this.state.dob);
    //data.append("id", getId());
    let data = {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      phone: this.state.mobile,
      height: this.state.height,
      gender: this.state.genderSelected,
      dob: this.state.date,
      id: getId(),
    };

    await edit(
      data,
      this.props.navigation,
      this.context,
      {next: 'PostSignupLocation', enforce: true},
    );

    this.setState({btnClicked: false});
  };

  render() {
    return (
      <Container style={{flex: 1, width: '100%'}}>
        <Header
          style={{
            backgroundColor: 'white',
            shadowColor: 'white',
            shadowOffset: {height: 0, width: 0},
            shadowOpacity: 0,
            elevation: 0,
          }}
        />
        <Content contentContainerStyle={{flex: 1}}>
          <ScrollView keyboardShouldPersistTaps={'handled'}>
            <View style={{flex: 0.7, alignItems: 'center'}}>
              <Image
                source={modelMale01}
                style={{
                  width: 120,
                  height: 120,
                  resizeMode: 'contain',
                  borderRadius: 100,
                }}
              />
            </View>
            <View style={{flex: 2.3}}>
              <View style={{flex: 3.3, padding: 10}}>
                <Item style={{borderBottomWidth: 0}}>
                  <Input
                    style={[Styles.inputText]}
                    placeholder={genericStrings.firstName}
                    onChangeText={text => this.setState({firstName: text})}
                    value={this.state.firstName}
                    editable={this.state.lastName == '' && this.state.enforce}
                  />
                </Item>
                <Item style={{borderBottomWidth: 0}}>
                  <Input
                    style={[Styles.inputText]}
                    placeholder={genericStrings.lastName}
                    onChangeText={text => this.setState({lastName: text})}
                    value={this.state.lastName}
                    editable={this.state.lastName == '' && this.state.enforce}
                  />
                </Item>
                <Item style={{borderBottomWidth: 0, marginBottom: 10}}>
                  <View
                    style={{
                      borderRadius: 1,
                      borderWidth: 1,
                      borderColor: Colours.gray,
                      width: '100%',
                    }}>
                    <Picker
                      style={[{borderColor: 'black'}]}
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      headerStyle={{backgroundColor: '#b95dd3'}}
                      headerBackButtonTextStyle={{color: '#fff'}}
                      headerTitleStyle={{color: '#fff'}}
                      selectedValue={this.state.genderSelected}
                      onValueChange={this.genderSelected.bind(this)}>
                      <Picker.Item value={'male'} label={'Male'} />
                      <Picker.Item value={'female'} label={'Female'} />
                    </Picker>
                  </View>
                </Item>
                <Item style={{borderBottomWidth: 0}}>
                  <Input
                    style={[Styles.inputText]}
                    placeholder={genericStrings.mobile}
                    keyboardType={'numeric'}
                    onChangeText={text => this.setState({mobile: text})}
                    value={this.state.mobile}
                  />
                </Item>
                {!getEmptorMode() && (
                  <Item style={{borderBottomWidth: 0, marginBottom: 10}}>
                    <View
                      style={{
                        borderRadius: 1,
                        borderWidth: 1,
                        borderColor: Colours.gray,
                        width: '100%',
                      }}>
                      <DatePicker
                        maximumDate={new Date()}
                        placeHolderTextStyle={{color: Colours.gray}}
                        placeHolderText={'Date of birth'}
                        onDateChange={date => {
                          Keyboard.dismiss();
                          // let date = new Date().getMo;
                          // date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
                          this.setState({date: date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate()});
                        }}
                      />
                    </View>
                  </Item>
                )}
                {!getEmptorMode() && (
                  <Item style={{borderBottomWidth: 0}}>
                    <View style={{flexDirection: 'row'}}>
                      <Input
                        style={[Styles.inputText, Styles.heightInput]}
                        placeholder={genericStrings.height}
                        keyboardType={'numeric'}
                        onChangeText={text => this.setState({height: text})}
                        value={this.state.height}
                      />
                      <Text style={[Styles.inputText, Styles.heightText]}>
                        {toFeet(this.state.height)}
                      </Text>
                    </View>
                  </Item>
                )}
              </View>
              <View style={{flex: 0.7, paddingLeft: 10, alignItems: 'center'}}>
                <SpinnerButton
                  rounded={true}
                  style={{width: '80%', alignItems: 'center', backgroundColor: Colours.darkmagenta}}
                  btnClicked={this.state.btnClicked}
                  label={'Next'}
                  onPress={this.onNextPress}
                />
                {/* <Button 
                                rounded 
                                style={{width: '80%', alignItems: 'center'}}
                                onPress={this.onNextPress}
                                > 
                                    {
                                        !this.state.btnClicked ?
                                            <Text style={[{textAlignVertical: 'center', textAlign: 'center', width: '100%',}]}>Next</Text>
                                        :
                                        <Spinner style={[{height: 30, alignSelf: 'center', width: '100%'}]} color={Colours.white} />
                                    }
                                    
                                </Button> */}
              </View>
            </View>
          </ScrollView>
        </Content>
      </Container>
    );
  }
}
