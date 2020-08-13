import React, { Component } from "react";
import { View, Text, Textarea, Icon } from "native-base";
import { Image, TouchableOpacity, StyleSheet } from "react-native";
import { Colours } from "../utils";
import { strings as AppStrings } from "../strings";

const { bookPopUpTimeStrings } = AppStrings;
const strings = bookPopUpTimeStrings;

export default class BookPopUpTime extends Component {
    constructor(props) {
        super(props);
        
    }

    state = {time: ''}

    render() {
        return (
            <View style={[{width: '100%', alignItems: 'center', height: 400}]}>
                
                <View style={[{flexDirection: 'row'}]}>
                    <Text style={[Styles.usernameText]}>{this.props.username} </Text>
                    <Text style={[Styles.serviceInfoText]}>
                          - {this.props.selectedService.glamServiceTitle} - 
                        {this.props.selectedService.title} -
                        {this.props.selectedService.price}
                    </Text>
                </View>
                    <View style={[{flexDirection: 'row', alignSelf: 'stretch'}]}>
                        
                        <TouchableOpacity 
                        onPress={() => this.props.payNowCallback(this.state.time)}
                        style={[{alignSelf: 'center', alignItems: 'center', padding: 5, flex: 1}]}>
                            <Icon name='ios-wallet' />
                            <Text>{strings.payNow}</Text>
                        </TouchableOpacity>
                    </View>
            </View>
        );
    }
}

const Styles = StyleSheet.create({
    usernameText: {
        textTransform: 'capitalize', 
        fontSize: 13, 
        fontWeight: 'bold'
    },
    serviceInfoText: {
        textTransform: 'capitalize', 
        fontSize: 13
    },
});