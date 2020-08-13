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
import {logout, getEmptorMode, Colours} from './../utils';
import LinearGradient from 'react-native-linear-gradient';
import { Dimensions, StyleSheet } from 'react-native';

export default class ItemComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <ListItem
            onPress={this.props.onPress}
            style={[Styles.listItem]}
            >
            <Left style={[Styles.left, this.props.iconLeftStyles]}>
                <Icon name={this.props.iconLeft} style={[Styles.colorWhite]} />
            </Left>
            <Body style={[Styles.body, this.props.bodyStyles]}>
                {this.props.body}
                {/* <Text style={[Styles.colorWhite, {textAlign: 'left'}]}>{this.props.label}</Text> */}
            </Body>
            {
                this.props.iconRight != undefined &&
                <Right style={[Styles.right, this.props.iconRightStyles]}>
                    <Icon name={this.props.iconRight} />
                </Right>
            }
        </ListItem>
    );
  }
}

const Styles = StyleSheet.create({
    colorWhite: {
        color: Colours.white,
    },
    listItem: {
        backgroundColor: "#50505f", 
        padding: 10, 
        borderBottomWidth: 0, 
        borderRadius: 5,
        marginBottom: 10,
    },
    left: {
        flex: 0.1
    },
    body: {
        alignItems: 'flex-start', 
        flex: 0.6,
    },
    right: {
        flex: 0.3
    }
});