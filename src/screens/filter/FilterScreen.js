import React, { Component } from "react";
import { Container, Content, Card, CardItem, Text, Body, Icon, Button, View, Left, Right, Switch, CheckBox, Header,  } from "native-base";
import ServiceBox from "../../components/ServiceBox";
import { Styles } from "./FilterStyle";
import { TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { Colours } from "../../utils";
import { strings as AppStrings, } from "./../../strings";
import Slider from "react-native-slider";
import { getServiceCategories, getStates } from "../../api/GetApiFactorsAPI";
import { AppContext } from "./../../../AppProvider";
import { Dialog } from "react-native-simple-dialogs";
import { filterGlam, getGlams } from "../../api/GlamAPI";
import { SpinnerButton } from "../../components/SpinnerButton";

const {genericStrings, filterScreenStrings} = AppStrings;
const genders = {
    male: 'male',
    female: 'female',
    both: 'both',
}

export default class FilterScreen extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
    }

    state = {
        noToRender: 5,
        gender: genders.female,
        startingAgeSliderValue: 25,
        endingAgeSliderValue: 75,
        isOnline: true,
        services: [],
        states: [],
        serviceLoading: true,
        dialogVisible: false,
        stateSelected: [],
        servicesSelected: [],
        glams: [],
        btnClicked: false,
        
    }

    async componentDidMount() {
        await getServiceCategories(this.context, this.set);
        await getStates(this.context, this.set);
    }
    
    set = (v) => {
        this.setState(v);
    }

    saveService(serviceId) {
        let servicesSelected = this.state.servicesSelected;

        if (servicesSelected.indexOf(serviceId) == -1) {
            servicesSelected.push(serviceId);
        }
        else {
            /***
             * remove from serviceSelected
             */
            delete servicesSelected[servicesSelected.indexOf(serviceId)];
        }

        this.setState({servicesSelected : servicesSelected });
    }

    onApplyFilterPress = async () => {
        this.setState({btnClicked: true});
        await filterGlam({
            location: JSON.stringify(this.state.stateSelected),
            starting_age_year: this.state.startingAgeSliderValue,
            ending_age_year: this.state.endingAgeSliderValue,
            gender: this.state.gender,
            services: JSON.stringify(this.state.servicesSelected),

        }, this.set, this.context);
        this.setState({btnClicked: false});
        let onFilterCompleted = this.props.navigation.getParam('onFilterCompleted', undefined);
        if (onFilterCompleted != undefined) onFilterCompleted(this.state.glams);
        this.props.navigation.goBack();
    }

    onResetFilterPress = async () => {
        this.setState({
            servicesSelected : [],
            stateSelected: [],
            startingAgeSliderValue: 25,
            endingAgeSliderValue: 75,
            onlineNow: true,
        });
        
        await getGlams(this.set);
        let onFilterCompleted = this.props.navigation.getParam('onFilterCompleted', undefined);
        if (onFilterCompleted != undefined) onFilterCompleted(this.state.glams);
        this.props.navigation.goBack();
    }

    stateSelected = (stateId) => {
        let stateSelected = this.state.stateSelected;

        if (stateSelected.indexOf(stateId) == -1) {
            stateSelected.push(stateId);
        }
        else {
            /***
             * remove from stateSelected
             */
            delete stateSelected[stateSelected.indexOf(stateId)];
        }

        this.setState({stateSelected : stateSelected });
    }

    renderStates = () => {
        return this.state.states.map(state => (
          <TouchableOpacity
            key={state.id}
            style={[{flexDirection: 'row', marginBottom: 3}]}
            onPress={() => this.stateSelected(state.id)}>
            <CheckBox
              checked={
                this.state.stateSelected.indexOf(state.id) != -1 ? true : false
              }
              onPress={() => this.stateSelected(state.id)}
            />
            <Text style={[{marginLeft: 20}]}>{state.name}</Text>
          </TouchableOpacity>
        ));
    };

    renderServiceBox = (id, serviceType) => {
        
        return(
            <TouchableOpacity 
                key={id}
                onPress={() => {
                    this.saveService(id);
                }}
            style={[Styles.backgroundView]} >
                <Text style={[Styles.serviceText]}>{serviceType}</Text>
                {
                    (this.state.servicesSelected.indexOf(id) != -1) && 
                    <Icon name='checkmark' color={Colours.green} style={[Styles.checkmarkIcon]} />
                }
                
            </TouchableOpacity>
            
        );
        
    }

    render() {
        return (
            <Container>
                <Header
                    androidStatusBarColor={Colours.darkmagenta}
                    style={{backgroundColor: Colours.white}}
                    >
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name={(Platform.OS == 'android') ? 'arrow-back' : 'ios-arrow-back'} style={{color: Colours.black}} />
                            </Button>
                        </Left>
                        <Body/>
                </Header>
                <Content>
                    <Card>
                        <CardItem>
                            <Body>
                                <Text style={[{padding: 5}]}>{filterScreenStrings.filterTopText}</Text>
                                <View style={[Styles.serviceView, {}]}>
                                    {
                                        (this.state.services.length == 0) 
                                        
                                        ?
                                         <ActivityIndicator animating={this.state.serviceLoading} style={{width: '100%', alignSelf: 'center'}} />
                                        :
                                            this.state.services.map((service, i) => {
                                                return this.renderServiceBox(service.id, service.name)
                                                //return (<ServiceBox key={i} parentCallback={(e) => this.saveService(e)} serviceType={service.name} id={service.id} />)
                                            })
                                    }
                                </View>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <View style={[Styles.locationView]}>
                                    <TouchableOpacity 
                                        style={[Styles.titleViewLeft]}
                                        onPress={() => this.setState({dialogVisible: true})}
                                    >
                                        <Icon name="pin" style={[Styles.iconLeft]} />
                                        <Text style={[Styles.textRight]}>{filterScreenStrings.location}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={[Styles.titleViewRight]}
                                        onPress={() => this.setState({dialogVisible: true})}
                                        >
                                        <Text style={[Styles.textLeft]}>{filterScreenStrings.addLocation}</Text>
                                        <Icon name={'arrow-forward'} style={[Styles.iconRight]}/>
                                    </TouchableOpacity>
                                </View>
                            </Body>
                            
                        </CardItem>
                        <CardItem style={{flexDirection: 'column'}}>
                            <View style={[Styles.titleViewLeft, ]}>
                                <Icon name="person" style={[Styles.iconLeft]} />
                                <Text style={[Styles.textRight]}>{filterScreenStrings.searchAge}</Text>
                            </View>
                            <View style={[Styles.titleViewLeft, Styles.genderView]}>
                                <TouchableOpacity 
                                    onPress={() => this.setState({ gender: genders.male})}
                                    style={[Styles.genderButton, { backgroundColor: ((this.state.gender == genders.male) ? Colours.darkmagenta : Colours.white) }]} >
                                        <Text style={[Styles.genderText, {color: ((this.state.gender == genders.male) ? Colours.white : Colours.black)}]}>{genericStrings.male}</Text>
                                        
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={() => this.setState({ gender: genders.female})}
                                    style={[Styles.genderButton, { backgroundColor: ((this.state.gender == genders.female) ? Colours.darkmagenta : Colours.white) }]} >
                                        <Text style={[Styles.genderText, {color: ((this.state.gender == genders.female) ? Colours.white : Colours.black)}]}>{genericStrings.female}</Text>
                                        
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={() => this.setState({ gender: genders.both})}
                                    style={[Styles.genderButton,{backgroundColor: ((this.state.gender == genders.both) ? Colours.darkmagenta : Colours.white),  }]} >
                                        <Text style={[Styles.genderText, {color: ((this.state.gender == genders.both) ? Colours.white : Colours.black)}]}>{genericStrings.both}</Text>
                                        
                                </TouchableOpacity>
                            </View>
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Icon name="calendar" style={[Styles.iconLeft]} />
                                <Text style={[Styles.textRight]}>{filterScreenStrings.age}</Text>
                            </Left>
                            <Right>
                                <Text style={[Styles.textLeft]}>18 - 75</Text>
                            </Right>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Slider
                                    style={{width: '100%'}}
                                    minimumValue={18}
                                    maximumValue={75}
                                    value={this.state.startingAgeSliderValue}
                                    thumbTintColor={Colours.darkmagenta}
                                    minimumTrackTintColor={Colours.darkmagenta}
                                    maximumTrackTintColor={Colours.firebrick}
                                    onValueChange={(value) => this.setState({startingAgeSliderValue: Math.floor(value)
                                    })}
                                />
                                <Text style={[Styles.borderBottom,{alignSelf: 'stretch'}]}>From {filterScreenStrings.age}: {(this.state.startingAgeSliderValue)}</Text>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Slider
                                    style={{width: '100%'}}
                                    minimumValue={18}
                                    maximumValue={75}
                                    value={this.state.endingAgeSliderValue}
                                    thumbTintColor={Colours.darkmagenta}
                                    minimumTrackTintColor={Colours.darkmagenta}
                                    maximumTrackTintColor={Colours.firebrick}
                                    onValueChange={(value) => this.setState({endingAgeSliderValue: Math.floor(value)
                                    })}
                                />
                                <Text style={[Styles.borderBottom,{alignSelf: 'stretch'}]}>To {filterScreenStrings.age}: {(this.state.endingAgeSliderValue)}</Text>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Text>{filterScreenStrings.onlineNow}</Text>
                            </Left>
                            <Right>
                                <Switch
                                thumbColor={Colours.darkmagenta}
                                value={this.state.isOnline}
                                onValueChange={(e) => this.setState({isOnline: e})}
                                />
                            </Right>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Text onPress={() => this.onResetFilterPress()} style={[{fontSize: 18, fontWeight: 'bold', textAlign: 'center', alignSelf: 'stretch', color: Colours.darkmagenta, padding: 5,paddingRight: 15}]}>{filterScreenStrings.resetFilter}</Text> 
                                {/* <Button rounded block style={[{backgroundColor: Colours.darkmagenta}]} onPress={() => this.onApplyFilterPress()}>
                                    <Text>
                                        
                                    </Text>
                                </Button> */}
                                <SpinnerButton 
                                label={filterScreenStrings.applyFilter}
                                rounded={true}
                                block={true}
                                style={[{backgroundColor: Colours.darkmagenta}]}
                                onPress={() => this.onApplyFilterPress()}
                                btnClicked={this.state.btnClicked}
                                />
                            </Body>
                        </CardItem>
                    </Card>
                </Content>
                <Dialog
                    visible={this.state.dialogVisible}
                    title={this.state.dialogTitle}
                    onTouchOutside={() => this.setState({dialogVisible: false})}
                    dialogStyle={{padding: 0, zIndex: 1000000}}
                    contentStyle={{padding: 0, width: '100%', zIndex: 100000}}>
                    <View style={{padding: 10}}>
                        <ScrollView style={[{maxHeight: 200}]}>
                        <View>
                            <TouchableOpacity key={-1} style={[{flexDirection: 'row'}]}>
                            <CheckBox
                                checked={
                                this.state.stateSelected.indexOf(-1) != -1 ? true : false
                                }
                                onPress={() => this.stateSelected(-1)}
                            />
                            <Text style={[{marginLeft: 20}]}>All states</Text>
                            </TouchableOpacity>
                            {this.renderStates()}
                        </View>
                        </ScrollView>

                        <Button
                            block
                            style={{alignItems: 'center'}}
                            onPress={() => this.setState({dialogVisible: false})}>
                            <Text style={{textAlign: 'center'}}>Done</Text>
                        </Button>
                    </View>
                </Dialog>
            </Container>
        );
    }
}