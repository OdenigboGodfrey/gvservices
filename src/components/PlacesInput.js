import React from 'react';
import { PlacesAPIKey } from "../utils";
import PlacesInput from "react-native-places-input";
import { Icon } from 'native-base';

export const GooglePlacesInput = (props) => {
    return (
      <PlacesInput
          googleApiKey={PlacesAPIKey}
          placeHolder={props.placeholder}
          language={"en-US"}
          onSelect={props.onSelect}
          iconResult={<Icon name="ios-pin" style={{fontSize: 18}} />}
          onChangeText={props.onChangeText}
          onFocus={() => {console.log("Focused")}}
          stylesContainer={{
            position: 'relative',
            alignSelf: 'stretch',
            margin: 0,
            top: (props.top != undefined? props.top : 0),
            left: (props.left != undefined? props.left : 0),
            right: (props.right != undefined? props.right : 0),
            bottom: (props.bottom != undefined? props.bottom : 0),
            marginBottom: 10,
            width: (props.width != undefined? props.width : '95%'),
            zIndex: 100,
        }}
        stylesList={{
            // top: 50,
            borderColor: '#dedede',
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderBottomWidth: 1,
            left: -1,
            right: -1,
            zIndex: 10,
            elevation: 5,
        }}
      />
    );
  }