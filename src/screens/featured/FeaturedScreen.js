import React, { Component } from "react";
import { Container, Content, Card, CardItem, Text, Body, Icon, Button, Spinner,  } from "native-base";
import ImageBox from "../../components/ImageBox";
import ServiceBox from "../../components/ServiceBox";
import { View } from "react-native";
import { Styles } from "../featured/FeaturedStyle";
import { getGlams } from "../../api/GlamAPI";
import { getImage, getAge, getState, Colours } from "../../utils";
import { AppContext } from "./../../../AppProvider";
import { NavigationEvents } from "react-navigation";
import { strings as AppStrings } from "./../../strings";

const { genericStrings } = AppStrings;

export default class FeaturedScreen extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
    }
    

    state = {
        noToRender: 21, 
        glams: [],
        spinnerActive: true
    }
    
    async componentDidMount() {
        await getGlams(this.set, true);
        this.setState({spinnerActive: false});
        if (this.context.state.states == undefined) await getStates(this.context, this.set);
    }

    set = (v) => {
        this.setState(v);
        // console.log("setting", JSON.stringify(v));
    }

    parentCallback(childData) {
        // this.props.navigation = navigation;
        console.log(childData, JSON.stringify(this.props));
        this.props.navigation.navigate('GlamProfile');
        //console.log('image cliecked')
    }

    renderImageBoxes() {
        if (this.state.glams.length == 0) {
            return (
                <View style={{width: '100%', height: 250, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color: Colours.darkmagenta, textAlign: 'center', textAlignVertical: 'center'}}>{genericStrings.nothingToShow}</Text>
                </View>
            );
          }
        let elements = [];
        for(let i = 0; i < this.state.glams.length; i++) {
            let state = getState(this.context.state.states, this.state.glams[i].city_id);
            elements.push(
                <ImageBox 
                key={i} 
                navigation={this.props.navigation} 
                source={getImage('glams', this.state.glams[i].code, this.state.glams[i].avatar,)}
                parentCallback={(e) => this.parentCallback(e)} 
                glamName={this.state.glams[i].first_name} 
                glamAge={getAge(this.state.glams[i].birthday)} 
                glamState={state.name} 
                onPress={() => this.props.navigation.navigate('GlamProfile', { id: this.state.glams[i].id })} 
                />
                
            );
        }
        return elements;
    }

    render() {
        return(
            // <Container>
            <View style={[Styles.backgroundView, {paddingTop: 25}] }>
                {/* <NavigationEvents 
                    onDidFocus={async () => {
                        
                    }}  
                /> */}
                {
                    this.state.spinnerActive ? 
                    <View style={{width: '100%', alignItems: 'center', height: '100%', justifyContent: 'center'}}>
                        <Spinner color={Colours.darkmagenta} />
                    </View>
                    :
                    this.renderImageBoxes()
                }
            </View>
            // </Container>
        );
    }
}