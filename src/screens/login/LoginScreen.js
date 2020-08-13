import React, {Component} from 'react';
import {
  Container,
  Content,
  CardItem,
  Text,
  Body,
  Icon,
  View,
  Input,
  Item,
  Form,
  Picker,
} from 'native-base';
import {Styles} from './LoginStyle';
import {strings as AppStrings} from './../../strings';
import {ImageBackground, Image} from 'react-native';
import {
  backgroundImage01,
  glamIcon01,
  getEmptorMode,
  setEmptorMode,
  Colours,
  setContext,
} from '../../utils';
import {login} from '../../api/AuthAPI';
import {AppContext} from '../../../AppProvider';
import {SpinnerButton} from '../../components/SpinnerButton';
import { NavigationEvents } from "react-navigation";

const {loginScreenStrings, genericStrings} = AppStrings;
const strings = loginScreenStrings;

class LoginScreen extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
  }

  state = {
    email: '',
    password: '',
    btnClicked: false,
    userType: genericStrings.glam,
  };

  componentDidMount() {
    this.setState({userType: genericStrings.glam});
  }

  componentWillUnmount() {
    this.setState({userType: genericStrings.glam});
  }

  onPressForgotPassword() {
    this.props.navigation.navigate('InitReset');
  }

  async onPressLoginButton() {
    this.userType(this.state.userType);
    await login(
      {
        email: this.state.email,
        password: this.state.password,
      },
      this.props.navigation,
      this.context,
    );
  }
  onPressCreateAccount() {
    this.props.navigation.navigate('Signup');
  }

  userType = text => {
    setContext(this.context);
    if (text == genericStrings.glam) {
      setEmptorMode(false);
    } else {
      setEmptorMode(true);
    }
    this.setState({userType: text});
  };

  render() {
    return (
      <ImageBackground
        source={backgroundImage01}
        style={[Styles.backgroundImage]}>
          {/* navigation event */}
          <NavigationEvents
            onDidFocus={payload => {
              this.userType(genericStrings.glam);
              console.log('did focus on login')}
            }
          />
        <View style={[Styles.backgroundView]}>
          <Container
            style={{flex: 1, width: '100%', backgroundColor: 'transparent'}}>
            {/* <Header /> */}
            <Content style={{backgroundColor: 'transparent'}}>
              <Form style={{backgroundColor: 'transparent', borderWidth: 0}}>
                {/* <Card style={{flex: 0,backgroundColor: 'transparent', borderWidth: 5}}> */}
                <CardItem style={{backgroundColor: 'transparent'}}>
                  <Body style={[Styles.topImage]}>
                    {/* <Thumbnail source={{uri: 'Image URL'}} /> */}

                    <Image source={glamIcon01} style={[Styles.topImage]} />
                  </Body>
                </CardItem>
                <CardItem style={{backgroundColor: 'transparent'}}>
                  <Text style={[Styles.welcomeText]}>
                    {strings.loginScreenWelcomeText}
                  </Text>
                </CardItem>
                <CardItem style={{backgroundColor: 'transparent'}}>
                  <Body>
                    {/* <Text style={[Styles.loginText]}>{strings.loginText}</Text> */}
                    <Item rounded style={[Styles.inputItem]}>
                      <Icon name="mail" style={{color: 'white'}} />
                      <Input
                        style={{color: 'white'}}
                        placeholderTextColor="white"
                        placeholder={genericStrings.email}
                        onChangeText={text => this.setState({email: text})}
                      />
                    </Item>
                    <Item rounded style={[Styles.inputItem]}>
                      <Icon name="key" style={{color: 'white'}} />
                      <Input
                        style={{color: 'white'}}
                        secureTextEntry={true}
                        placeholderTextColor="white"
                        placeholder={genericStrings.password}
                        onChangeText={text => this.setState({password: text})}
                      />
                    </Item>
                    <Item rounded style={[Styles.inputItem]}>
                      <Icon name="ios-contacts" style={{color: 'white'}} />
                      <Picker
                        style={[{borderColor: 'black', color: Colours.white}]}
                        mode="dropdown"
                        iosIcon={<Icon name="ios-arrow-down" />}
                        headerStyle={{backgroundColor: '#b95dd3'}}
                        headerBackButtonTextStyle={{color: '#fff'}}
                        headerTitleStyle={{color: '#fff'}}
                        selectedValue={this.state.userType}
                        onValueChange={this.userType.bind(this)}>
                        <Picker.Item
                          value={genericStrings.glam}
                          label={genericStrings.glam}
                        />
                        <Picker.Item
                          value={genericStrings.emptor}
                          label={genericStrings.emptor}
                        />
                      </Picker>
                    </Item>

                    <Text
                      onPress={() => this.onPressForgotPassword()}
                      style={[Styles.forgotPasswordText]}>
                      {strings.forgotPassword}
                    </Text>
                  </Body>
                </CardItem>
                <CardItem
                  style={{
                    flexDirection: 'column',
                    alignSelf: 'stretch',
                    backgroundColor: 'transparent',
                  }}>
                  <Body>
                    <SpinnerButton
                      block={true}
                      onPress={async () => {
                        this.setState({btnClicked: true});
                        await this.onPressLoginButton();
                        this.setState({btnClicked: false});
                      }}
                      label={strings.loginText}
                      btnClicked={this.state.btnClicked}
                    />
                    <Text
                      style={[Styles.forgotPasswordText]}
                      onPress={() => this.onPressCreateAccount()}>
                      {strings.createAccountNow}
                    </Text>
                  </Body>
                </CardItem>
                {/* </Card> */}
              </Form>
            </Content>
          </Container>
        </View>
      </ImageBackground>
    );
  }
}

export default LoginScreen;
