import React, { Component } from "react";
import { View, ScrollView } from "react-native";
import {
  Icon,
  Button,
  Text,
  Left,
  Body,
  Right,
  List,
  ListItem
} from "native-base";
import { ParseDateTime, getCurrency, Colours, getDate, getEmptorMode } from "./../utils";

const TransactionHistory = props => {
  return <List style={{width: '100%'}}>{List_item(props.ts)}</List>;
};

function Green(data) {
  return (
    <ListItem thumbnail key={(data.reference_id != undefined) ? data.reference_id : data.id} style={{ width: '100%'}}>
      <Left>
        <Icon name="arrow-round-down" style={{ color: "green" }} />
        {/* <Thumbnail square source={<Icon name="wallet" /> } /> */}
      </Left>
      <Body>
        <Text style={{fontSize: 14, color: 'white'}}>{data.reason}</Text>
        <Text note numberOfLines={1}>
          {getDate(data.created_at)}
        </Text>
      </Body>
      <Right>
        <Button transparent>
          <Text>
            {getCurrency()}
            {data.amount}
          </Text>
        </Button>
      </Right>
    </ListItem>
  );
}

function Red(data) {
  return (
    <ListItem thumbnail key={data.id}>
      <Left>
        <Icon name="arrow-round-up" style={{ color: "red" }} />
        {/* <Thumbnail square source={<Icon name="wallet" /> } /> */}
      </Left>
      <Body>
        <Text style={{fontSize: 14, color: 'white'}}>{data.reason}</Text>
        <Text note numberOfLines={1}>
          {getDate(data.created_at)}
        </Text>
      </Body>
      <Right>
        <Button transparent>
          <Text>
            {getCurrency()}
            {parseFloat(data.amount).toFixed(2)}

          </Text>
        </Button>
      </Right>
    </ListItem>
  );
}

function Gray(data) {
    return (
      <ListItem 
        thumbnail 
        key={(data.reference_id != undefined) ? data.reference_id : data.id} style={{ width: '100%'}}
        >
        <Left>
          <Icon name="ios-remove-circle" style={{ color: Colours.white, fontSize: 20 }} />
          {/* <Thumbnail square source={<Icon name="wallet" /> } /> */}
        </Left>
        <Body>
          <Text style={{fontSize: 14, color: 'white'}}>{data.reason}</Text>
          <Text note numberOfLines={1}>
            {getDate(data.created_at)}
          </Text>
        </Body>
        <Right>
          <Button transparent>
            <Text>
              {getCurrency()}
              {data.amount}
            </Text>
          </Button>
        </Right>
      </ListItem>
    );
  }

function List_item(ts) {
  return ts.map(data => {
    if (data.type === "gig") {
        /*** glam earned from gig */
        data.reason = "Gig payment";
      return Green(data);
    }
    else if (data.type === "booking") {
        /*** glam earned from booking */
        data.reason = "Booking payment";
        return Green(data);
    }
    else if (data.type === "deposit") {
      /*** glam funded */
      data.reason = "Account funding";
      return Green(data);
    }
    else if (data.referred_id != undefined && data.referred_id != null) {
      /*** glam funded */
      data.reason = "Referral payment";
      return Green(data);
    }
    else if (data.reference_id != undefined || data.reference_id != null) {
        /*** emptor funded */
        data.reason = "Account funding";
        return Green(data);
    }
    else if((data.booking_id != undefined || data.gig_id != undefined) && getEmptorMode()) {
        /*** escrow transaction */
        if (data.cashed) {
            data.reason = "Glam payment" + ((data.booking_id != undefined) ? "(Booking) " :  "(Gig)");
            return Red(data);
        }
        else {
            data.reason = "Pending payment " + ((data.booking_id != undefined) ? "(Booking) " :  "(Gig)");
            return Gray(data);
        }
      }
    else {
      return Red(data);
    }
  });
}
export default TransactionHistory;
