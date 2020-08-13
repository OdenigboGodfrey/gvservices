import React, { Component } from "react";
import { Container, Content, Card, CardItem, Text, Body, Icon, Button, Spinner,  } from "native-base";
import ImageBox from "../../components/ImageBox";
import { View, ScrollView } from "react-native";
import { Styles } from "../glams/GlamsStyle";
import { getGlams } from "../../api/GlamAPI";
import { getAge, modelMale01, getImage, getState, Colours } from "../../utils";
import { AppContext } from "./../../../AppProvider";
import { getStates } from "../../api/GetApiFactorsAPI";
import { NavigationEvents } from "react-navigation";

export default class GlamsScreen extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        // console.log(this.props)
    }

    state = {
        noToRender: 20, 
        glams: [], 
        states: [],
        spinnerActive: true
    }

    async componentDidMount() {
        if (this.props.glams != undefined) {
            this.setState({glams: this.props.glams});
        }
        else {
            await getGlams(this.set);
        }

        this.setState({spinnerActive: false});
        console.log("states", this.context.state.states);
        if (this.context.state.states == undefined || (this.context.state.states != undefined && this.context.state.states.length == 0)) await getStates(this.context, this.set);
    }

    set = (v) => {
        this.setState(v);
    }

    parentCallback = (childData) => {
        console.log(childData);
        // this.props.navigation.navigate('GlamProfile');JSON.stringify(this.props)
    }

    renderImageBoxes() {
        
        let elements = [];
        console.log("glamscreen", this.context.state.glams);
        let glams = (this.context.state.glams != undefined) ? this.context.state.glams : this.state.glams;
        
        if (glams.length == 0) {
            return (
                <View style={{width: '100%', height: 250, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color: Colours.darkmagenta, textAlign: 'center', textAlignVertical: 'center'}}>{genericStrings.nothingToShow}</Text>
                </View>
            );
          }

        for(let i = 0; i < glams.length; i++) {
            let glam = this.state.glams[i];
            // console.log("for loop ",await getState(this.state.glams[i].city_id));
            /**getState(this.context.states,1) */
            // console.log("glamscreen", this.context.state.states, this.state.states);
            let state = getState((this.context.state.states ==undefined) ? this.state.states: this.context.state.states, glam.city_id);
            let stateName = '';
            try {
                // used to catch key error thrown if state hasn't been re-rendered/saved
                stateName = state.name;
            }
            catch(e) {}
            
            
            elements.push(
                <ImageBox 
                parentCallback={this.parentCallback} 
                source={getImage('glams', glam.code, glam.avatar,)} 
                key={i} glamName={glam.first_name} 
                glamAge={getAge(glam.birthday)} 
                glamState={stateName} 
                onPress={() => this.props.navigation.navigate('GlamProfile', { glamId: glam.id })} 
                />
            );
        }
        return elements;
    }

    render() {
        return(
            // <Container>
            <View style={[Styles.backgroundView, {paddingTop: 25}] }>
                {/* <NavigationEvents onDidFocus={async() => {
                    
                }} /> */}
                
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