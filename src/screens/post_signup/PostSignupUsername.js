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
  Toast,
} from 'native-base';
import {Image, TouchableOpacity, StyleSheet} from 'react-native';
import {Colours, modelMale01, getEmptorMode, getId} from '../../utils';
import {strings as AppStrings} from '../../strings';
import {Styles} from './PostSignupStyle';
import {SpinnerButton} from '../../components/SpinnerButton';
import {edit} from '../../api/EditAPI';
import {AppContext} from './../../../AppProvider';
import {ScrollView} from 'react-native-gesture-handler';

const {bookPopUpTimeStrings, genericStrings} = AppStrings;
const strings = bookPopUpTimeStrings;
const nextPage = "PostSignupAvatar";

export default class PostSignupUsername extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
  }

  state = {
    username: '',
    btnClicked: false,
  };

  /** navigation param */
  navigationParam = {
    next: nextPage,
    enforce: this.props.navigation.getParam('enforce', undefined),
    data: this.props.navigation.getParam('data', undefined),
  };

  componentDidMount() {
    /*** emptors dont have usernames */
    if (getEmptorMode()) {
      this.props.navigation.navigate(nextPage, this.navigationParam);
    }
    
    let userData = this.props.navigation.getParam('data', undefined);
    if (
      userData != undefined &&
      (( userData.username != undefined || userData.username != null) &&
        this.props.navigation.getParam('enforce', undefined) != undefined)
    ) {
      console.log("PostUserName", userData.username, userData);
      this.props.navigation.navigate(nextPage, this.navigationParam);
    }
    if (!getEmptorMode()) {
      this.set({
        username: this.context.state.user_data.username,
      });
    }
  }

  set = v => {
    this.setState(v);
  };

  genderSelected = gender => {
    this.setState({genderSelected: gender});
  };

  onNextPress = async () => {
    if (
      this.state.username == ''
    ) {
      Toast.show({
        text: strings.fillAllFields,
        type: 'danger',
        buttonText: genericStrings.dismiss,
      });
      return;
    }
    this.setState({btnClicked: true});
    // PostSignupAvatar
    await edit(
      {
        username: this.state.username,
        id: getId(),
      },
      this.props.navigation,
      this.context,
      this.navigationParam,
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
        <Content contentContainerStyle={{flex: 1}} scrollEnabled={true}>
          <ScrollView>
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
              <View style={{flex: 3, padding: 10, alignItems: 'center'}}>
                <Item style={{borderBottomWidth: 0, marginBottom: 10}}>
                  <Input
                    style={[Styles.inputText]}
                    placeholder={genericStrings.username}
                    onChangeText={text => this.setState({username: text})}
                    value={this.state.username}
                  />
                </Item>
                <SpinnerButton
                  rounded={true}
                  style={{width: '80%', backgroundColor: Colours.darkmagenta}}
                  label={'Next'}
                  onPress={this.onNextPress}
                  btnClicked={this.state.btnClicked}
                />
                {/* <Button rounded >
                                    <Text style={[{textAlignVertical: 'center', textAlign: 'center', width: '100%',}]}></Text>
                                </Button> */}
              </View>
              <View style={{flex: 1, paddingLeft: 10, alignItems: 'center'}} />
            </View>
          </ScrollView>
        </Content>
      </Container>
    );
  }
}
