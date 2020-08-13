import React, {useState} from 'react';
import {Button, Text, Spinner, Left, Body, Right, View} from 'native-base';
import {Colours} from '../utils';

export const SpinnerButton = props => {
  // const [value, setValue] = useState();
  // setValue({btnClicked: props.btnClicked}); , width: '100%'
  return (
    <Button
        icon={props.icon != undefined ? true : false}
        rounded={(props.rounded != undefined && props.rounded) ? true :false}
        block={(props.block != undefined && props.block) ? true :false}
        transparent={(props.transparent != undefined && props.transparent) ? true :false}
        style={[{paddingLeft: 20, paddingRight: 30, justifyContent: 'center'}, props.style]}
        disabled={(props.disabled != undefined && props.disabled) ? true :false}
        onPress={props.onPress}>
            {props.icon && props.btnClicked == false && props.icon}
            {props.btnClicked == false ? (
                <Text
                style={[
                    {
                    textAlignVertical: 'center',
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 14,
                    width: '80%',
                    height: 30,
                    }, props.textStyle
                ]}>
                {props.label.toString().toUpperCase()}
                </Text>
            ) : (
            <Spinner
                style={[{height: 30, alignSelf: 'center', width: '100%'}]}
                color={Colours.white}
            />
            )}
    </Button>
  );
}