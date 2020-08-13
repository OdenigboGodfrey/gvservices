/* eslint-disable prettier/prettier */
import React, { Component } from "react";
import { Text, Icon, View } from "native-base";
import { Styles } from "./InterestStyle";
import { strings as AppStrings, } from "./../../strings";
import { Image, Dimensions, TouchableOpacity, ScrollView, TouchableHighlight } from "react-native";
import { modelMale01, modelFemale03, modelFemale02, Colours, testData, getImage, getEmptorMode, getId } from "../../utils";
import { Dialog } from 'react-native-simple-dialogs';
import { getGlam } from "../../api/GlamAPI";
import {AppContext} from './../../../AppProvider';
import { markInterest, actionOnInterest } from "../../api/GigAPI";

const { glamProfileScreenStrings } = AppStrings;
const strings = glamProfileScreenStrings;

const cards = [
    {
      text: 'Card One',
      name: 'One',
      image: modelMale01,
    },
    {
        text: 'Card 2',
        name: '2',
        image: modelFemale03,
    },
    {
        text: 'Card 3',
        name: '3',
        image: modelMale01,
    },
    {
        text: 'Card 4',
        name: '4',
        image: modelFemale02,
    },
    {
        text: 'Card One',
        name: 'One',
        image: modelMale01,
      },
      {
          text: 'Card 2',
          name: '2',
          image: modelFemale03,
      },
      {
          text: 'Card 3',
          name: '3',
          image: modelMale01,
      },
      {
          text: 'Card 4',
          name: '4',
          image: modelFemale02,
      },
    
  ];

export default class InterestScreen extends Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);

        this.state = {
            swipeablePanelActive: false,
            height: 0,
            average_rating: 4,
            username: 'username',
            fullName: 'Full Name',
            ratingsText: '400+ ratings',
            gender: 'Female',
            address: 'Independence Layout, Enugu',
            topViewHeightPercent: 0.80,
            bottomViewHeightPercent: 0.20,
            topMarginPercent: 0.80,
            dialogVisible: false,
            dialogTitle: '',
            gigInfoText: 'Gig 4325678 Interests',
            gigInfoCounter: '3 of 15',
            glamIndex: props.navigation.getParam('index', -1),
            users: props.navigation.getParam('users', []),
            gigId: props.navigation.getParam('gigId', 0),
            trueImages: [],
            glamDefaultImage: undefined,
        }
    }

    async componentDidMount() {
        this.set({ 
            height: Dimensions.get('window').height, 
            fullName:  testData[this.state.glamIndex].fullName,
            username: testData[this.state.glamIndex].username,
            gender: testData[this.state.glamIndex].gender,
            address:  testData[this.state.glamIndex].address,
            ratingsText:  testData[this.state.glamIndex].ratings,
            average_rating:  testData[this.state.glamIndex].star,
            gigInfoCounter: (this.state.glamIndex + 1) + ' of ' + this.state.users.length,
            gigInfoText: 'Gig ' + this.state.gigId + ' Interests',

        });

        await getGlam(
            {glam_id: this.state.users[this.state.glamIndex].glam_id},
            this.set,
            this.context,
          );
          /** mark this interest as seen */
        //   if (getEmptorMode()) {  
        //     await markInterest({
        //         emptor_id: getId(),
        //         glam_id: this.state.users[this.state.glamIndex].glam_id,
        //         gig_id: this.state.gigId,
        //         interest_id: this.state.users[this.state.glamIndex].id
        //     })
        // }

    }

    set = (value) => {
        this.setState(value);    
    }

    renderStars(no_of_stars = 5, average_rating) {
        let elems = [];
        for (let i=1; i<= no_of_stars; i++){
          if (i <= Math.floor(average_rating)) {
            elems.push(
              <TouchableOpacity key={i} onPress={async () => {
                this.updateAverageRate(i);
              }}>
                  <Icon name="star" style={[Styles.starActive]}  />
            </TouchableOpacity>
            );
          }
          else {
            elems.push(
                <TouchableOpacity key={i} onPress={() => this.updateAverageRate(i)} key={i}>
                    <Icon name="star" style={[Styles.starInactive]} />
              </TouchableOpacity>
              );
          }
          
        }
        return elems;
      }

    async updateAverageRate(index) {
        this.setState({ average_rating: index });
    // this.renderStars(no_of_stars, this.state.average_rating);
    }

    heightAnimateInterval = undefined;

    renderImages() {
        // let elems = [];
        return this.state.trueImages.map((item, index) => {
            // elems.push
            return (
                <TouchableHighlight key={index} onPress={() => this.setState({dialogVisible: true, dialogTitle: this.state.fullName + "'s pictures"})}>
                    <Image style={[Styles.trueImage]} source={getImage('glams', this.state.code, item.image, 'true_images')} />
                </TouchableHighlight>
            );
        })
        // return elems;
    }

    async onInterestAction(actionType) {
        await actionOnInterest({
            emptor_id: getId(),
            glam_id: this.state.users[this.state.glamIndex].glam_id,
            gig_id: this.state.gigId,
            interest_id: this.state.users[this.state.glamIndex].id,
            accepted: (actionType) ? 1 : 0,
        }, this.set, this.context)
    }


    onBodyVideoPressed() {
        alert('body video');
    }

    onSpeechVideoPressed() {
        alert('speech video');
    }

    shadeViewHeight = '50%';
    shadeViewTop = '50%';

    render(){
        // console.log(this.state.topViewHeightPercent,this.state.height, (this.state.topViewHeightPercent * this.state.height))
        // console.log("image" , JSON.stringify([cards[0].image,"http://192.168.43.171:8000/uploads/glams/c39b5512-04d8-4716-962c-154acfd3/true_images/image-1eb81ca7-e4f9-4d61-bf49-b630388e223d.jpg"]))
        let gig = this.props.navigation.getParam('gig', undefined);
        console.log("interestscren", gig, gig.published_at != null && gig.active == 0);
        return (
            <ScrollView contentContainerStyle={{flexGrow: 1}} scrollEnabled={true}>
                <View style={[{height: this.state.height, flex: 1, width: '100%'}]}>
                    
                <View style={[{flex: 1, position: 'absolute', height: this.state.height, width: '100%'}]}>
                
                    <View style={[{position: 'absolute', height: (this.state.topViewHeightPercent * this.state.height), width: '100%'}]}>
                        <View style={{height: 40,padding: 7, backgroundColor: Colours.black, width: '100%', flexDirection: 'row', borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                            <Text style={[{color: 'white', flex: 1.2}]}>{this.state.gigInfoText}</Text>
                            <Text style={[{color: 'white', justifyContent: 'flex-end', flex: 0.8, textAlign: 'right'}]}>{this.state.gigInfoCounter}</Text>
                        </View>
                        <Image source={this.state.glamDefaultImage} style={[Styles.backgroundGlamImage]} />
                        <View style={[{backgroundColor: 'black', opacity: 0.5, width: '100%', position: 'absolute', height: this.shadeViewHeight, top: this.shadeViewTop, borderRadius: 10}]}></View>
                        <View style={[{width: '100%', position: 'absolute', height: this.shadeViewHeight, top: this.shadeViewTop}]}>
                            <View style={[{ flex: 1, paddingLeft: 10}]}>
                                <View>
                                    {/* username */}
                                    <Text style={[Styles.whiteText, Styles.userNameText]}>{this.state.username}</Text>
                                    {/* fullName */}
                                    <Text style={[Styles.whiteText, Styles.fullNameText]}>{this.state.fullName}</Text>
                                </View>
                                <View style={[{ width: '100%', flexDirection: 'row', padding: 5,}]}>
                                    <View style={[{alignSelf: 'flex-start',alignItems: 'flex-start', flex: 0.4, height: '100%'}]}>
                                        {/* render stars */}
                                        <View style={[{flexDirection: 'row', flex: 0.5}]}>
                                            {
                                                this.renderStars(5, this.state.average_rating)
                                            }
                                        </View>
                                        <View style={[{flex: 0.5, alignSelf: 'stretch', alignContent: 'flex-end'}]}>
                                            {/* ratings */}
                                            <Text style={[Styles.whiteText,]}>{this.state.ratingsText}</Text>
                                        </View>
                                    </View>
                                    
                                    <View style={[{alignSelf: 'flex-end', alignItems: 'flex-end', flex: 0.6, paddingRight: 5}]}>
                                        {/* gender */}
                                        <Text style={[Styles.whiteText, {marginBottom: 5} ]}>{this.state.gender}</Text>
                                        {/* address */}
                                        <Text style={[Styles.whiteText, {textAlign: 'right'}]}>{this.state.address}</Text>
                                    </View>
                                </View>
                                <View style={{ width: '100%', flexDirection: 'row', marginBottom: 10 }}>
                                    <ScrollView horizontal nestedScrollEnabled>
                                    {
                                        this.renderImages()
                                    }
                                    </ScrollView>
                                    
                                </View>
                                <View style={[{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', paddingRight: 5}]}>
                                    <TouchableOpacity onPress={() => this.onSpeechVideoPressed()} style={[Styles.speechBodyButton]}>
                                        <Icon name='ios-film' />
                                        <Text style={[Styles.speechBodyText]}>{strings.speechVideo}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.onBodyVideoPressed()} style={[Styles.speechBodyButton]}>
                                        <Icon name='ios-film' />
                                        <Text style={[Styles.speechBodyText]}>{strings.bodyVideo}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[{position: 'absolute', height: (this.state.bottomViewHeightPercent * this.state.height), width: '100%', top: (this.state.topMarginPercent * this.state.height),backgroundColor: 'black', flexDirection: 'row', paddingTop: 20  }]}>
                        {
                            !(gig.published_at != null && gig.active == 0) &&
                            <TouchableOpacity onPress={() => this.onInterestAction(false)} style={[Styles.interestButton]}>
                                <Icon name='ios-close' style={[Styles.interestIcon, {fontSize: 70}]}  />
                            </TouchableOpacity>
                        }
                        {
                            !(gig.published_at != null && gig.active == 0) &&
                            <TouchableOpacity onPress={() => this.onInterestAction(true)} style={[Styles.interestButton, {marginTop:10}]}>
                                <Icon name='ios-checkmark' style={[Styles.interestIcon]}  />
                            </TouchableOpacity>
                        }
                        {/* <TouchableOpacity onPress={() => this.onInterestAction(true)} style={[Styles.interestButton]}>
                            <Icon name='ios-star' style={[Styles.interestIcon]}  />
                        </TouchableOpacity> */}
                        
                        
                            
                        
                    </View>
                </View>
                {/* dialog */}
                <Dialog
                    visible={this.state.dialogVisible}
                    title={this.state.dialogTitle}
                    onTouchOutside={() => this.setState({dialogVisible: false})} >
                    {/* <View style={[{}]}> */}
                    <ScrollView 
                        horizontal 
                        contentContainerStyle={{flexGrow: 1, flexDirection: 'row'}}>
                        {
                        this.state.trueImages.map(
                            item => 
                            (
                                <View style={[{width: 250, height: 260, marginRight: 10, paddingBottom: 10}]}>
                                    <Image source={getImage('glams',this.state.code, item.image,'true_images')} style={{width: 250, height: 250, resizeMode: 'contain'}} />
                                </View>
                            )
                            
                            )
                        }
                        
                    </ScrollView>
                        {/* <SliderBox images={["https://source.unsplash.com/1024x768/?tree","http://192.168.43.171:8000/uploads/glams/c39b5512-04d8-4716-962c-154acfd3/true_images/image-1eb81ca7-e4f9-4d61-bf49-b630388e223d.jpg"]} style={{}} sliderBoxHeight={300}  /> */}

                       {/* <SliderBox images={this.state.trueImages.map(item => {
                           console.log("item", item, getImage('glams', this.state.code, item.image, 'true_images').uri);
                           return getImage('glams', this.state.code, item.image, 'true_images').uri;
                        })} style={{}} sliderBoxHeight={300}  /> */}
                    {/* </View> */}
                </Dialog>
            </View>
            </ScrollView>
            
        );
    }
}
