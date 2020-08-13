import React, {Component} from 'react';
import {
  Container,
  Content,
  List,
  ListItem,
  Text,
  Icon,
  Left,
  Body,
  Right,
  Header,
} from 'native-base';
import {logout, getEmptorMode, Colours} from '../../utils';
import LinearGradient from 'react-native-linear-gradient';
import { Dimensions } from 'react-native';
import { Styles } from "./SettingsStyle";

export default class SettingsScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Header 
            androidStatusBarColor={Colours.secondaryBlack}
            style={{backgroundColor: Colours.secondaryBlack}}
          >
          <Text
            style={{
              alignSelf: 'stretch',
              width: '100%',
              textAlign: 'center',
              textAlignVertical: 'center',
              fontSize: 21,
              fontWeight: 'bold',
              color: Colours.white,
            }}>
            Settings
          </Text>
        </Header>
        <Content>
          <LinearGradient
              colors={[Colours.secondaryBlack, Colours.black]}
              style={{
              flex: 1,
              height: Dimensions.get('screen').height,
              paddingRight: 10,
              paddingLeft: 10,
              }}
          >
            <List>
              <ListItem
                onPress={() => this.props.navigation.navigate('EditProfile')}
                style={[Styles.listItem]}
                >
                <Left style={[Styles.left]}>
                  <Icon name="ios-person" style={[Styles.colorWhite]} />
                </Left>
                <Body style={[Styles.body]}>
                  <Text style={[Styles.colorWhite, {textAlign: 'left'}]}>Edit Profile</Text>
                </Body>
                <Right style={[Styles.right]}>
                  <Icon name="ios-arrow-forward" />
                </Right>
              </ListItem>
              
              <ListItem
                onPress={() => this.props.navigation.navigate('ChangePassword')}
                style={[Styles.listItem]}
                >
                <Left style={[Styles.left]}>
                  <Icon name="ios-key" style={[Styles.colorWhite]} />
                </Left>
                <Body style={[Styles.body]}>
                  <Text style={[Styles.colorWhite, {textAlign: 'left'}]}>Change Password</Text>
                </Body>
                <Right style={[Styles.right]}>
                  <Icon name="ios-arrow-forward" />
                </Right>
              </ListItem>

              <ListItem
                onPress={() => this.props.navigation.navigate('Bookings')}
                style={[Styles.listItem]}
                >
                <Left style={[Styles.left]}>
                  <Icon name="ios-calendar" style={[Styles.colorWhite]} />
                </Left>
                <Body style={[Styles.body]}>
                  <Text style={[Styles.colorWhite, {textAlign: 'left'}]}>Bookings</Text>
                </Body>
                <Right style={[Styles.right]}>
                  <Icon name="ios-arrow-forward" />
                </Right>
              </ListItem>

              {
                !getEmptorMode() &&
                <ListItem
                onPress={() => this.props.navigation.navigate('GlamProfile')}
                  style={[Styles.listItem]}
                  >
                  <Left style={[Styles.left]}>
                    <Icon name="ios-alert" style={[Styles.colorWhite]} />
                  </Left>
                  <Body style={[Styles.body]}>
                    <Text style={[Styles.colorWhite, {textAlign: 'left'}]}>View profile</Text>
                  </Body>
                  <Right style={[Styles.right]}>
                    <Icon name="ios-arrow-forward" />
                  </Right>
                </ListItem>

              }
              {getEmptorMode() && (
                <ListItem
                onPress={() => this.props.navigation.navigate('NewGig')}
                  style={[Styles.listItem]}
                  >
                  <Left style={[Styles.left]}>
                    <Icon name="ios-camera" style={[Styles.colorWhite]} />
                  </Left>
                  <Body style={[Styles.body]}>
                    <Text style={[Styles.colorWhite, {textAlign: 'left'}]}>New Gig</Text>
                  </Body>
                  <Right style={[Styles.right]}>
                    <Icon name="ios-arrow-forward" />
                  </Right>
                </ListItem>
              )}
              {!getEmptorMode() && (
                <ListItem
                onPress={() => this.props.navigation.navigate('TrueImage')}
                  style={[Styles.listItem]}
                  >
                  <Left style={[Styles.left]}>
                    <Icon name="ios-camera" style={[Styles.colorWhite]} />
                  </Left>
                  <Body style={[Styles.body]}>
                    <Text style={[Styles.colorWhite, {textAlign: 'left'}]}>True Images</Text>
                  </Body>
                  <Right style={[Styles.right]}>
                    <Icon name="ios-arrow-forward" />
                  </Right>
                </ListItem>

              )}
              {!getEmptorMode() && (
                <ListItem
                  onPress={() =>
                    this.props.navigation.navigate('BodyVideo', {
                      type: 'body_video',
                      duration: 60,
                    })
                  }
                  style={[Styles.listItem]}
                  >
                  <Left style={[Styles.left]}>
                    <Icon name="ios-film" style={[Styles.colorWhite]} />
                  </Left>
                  <Body style={[Styles.body]}>
                    <Text style={[Styles.colorWhite, {textAlign: 'left'}]}>Body Video</Text>
                  </Body>
                  <Right style={[Styles.right]}>
                    <Icon name="ios-arrow-forward" />
                  </Right>
                </ListItem>
              )}
              {!getEmptorMode() && (
                <ListItem
                  onPress={() =>
                    this.props.navigation.navigate('BodyVideo', {
                      type: 'speech_video',
                      duration: 30,
                    })
                  }
                  style={[Styles.listItem]}
                  >
                  <Left style={[Styles.left]}>
                    <Icon name="ios-film" style={[Styles.colorWhite]} />
                  </Left>
                  <Body style={[Styles.body]}>
                    <Text style={[Styles.colorWhite, {textAlign: 'left'}]}>Speech Video</Text>
                  </Body>
                  <Right style={[Styles.right]}>
                    <Icon name="ios-arrow-forward" />
                  </Right>
                </ListItem>
              )}
              {!getEmptorMode() && (
                <ListItem
                  onPress={() => this.props.navigation.navigate('AddService')}
                  style={[Styles.listItem]}
                  >
                  <Left style={[Styles.left]}>
                    <Icon name="ios-disc" style={[Styles.colorWhite]} />
                  </Left>
                  <Body style={[Styles.body]}>
                    <Text style={[Styles.colorWhite, {textAlign: 'left'}]}>Services</Text>
                  </Body>
                  <Right style={[Styles.right]}>
                    <Icon name="ios-arrow-forward" />
                  </Right>
                </ListItem>

              )}
              <ListItem
                onPress={async () => {
                  await logout();
                  this.props.navigation.navigate('Login');
                }}
                style={[Styles.listItem]}
                >
                <Left style={[Styles.left]}>
                  <Icon name="ios-log-out" style={[Styles.colorWhite]} />
                </Left>
                <Body style={[Styles.body]}>
                  <Text style={[Styles.colorWhite, {textAlign: 'left'}]}>Logout</Text>
                </Body>
                <Right style={[Styles.right]}>
                  <Icon name="ios-arrow-forward" />
                </Right>
              </ListItem>
            </List>
          </LinearGradient>
        </Content>
      </Container>
    );
  }
}
