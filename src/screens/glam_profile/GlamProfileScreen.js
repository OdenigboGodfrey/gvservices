import React, {Component} from 'react';
import {Text, Icon, Button, View, Tabs, Tab, TabHeading, Toast} from 'native-base';
import {Styles} from './GlamProfileStyle';
import {strings as AppStrings} from './../../strings';
import {
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TouchableHighlight,
  Animated,
  
} from 'react-native';
import {
  modelMale01,
  modelFemale03,
  modelFemale02,
  Colours,
  testData,
  getImage,
  getId,
  getEmptorMode,
  getYoutubeVideoId,
} from '../../utils';
import {Dialog, ProgressDialog, ConfirmDialog} from 'react-native-simple-dialogs';

import GlamService from '../../components/GlamService';
import BookPopUp from '../../components/BookPopUp';
import BookPopUpMap from '../../components/BookPopUpMap';
import BookPopUpTime from '../../components/BookPopUpTime';
import {getGlam, getGlamServices, deleteTrueImage} from '../../api/GlamAPI';
import {AppContext} from './../../../AppProvider';
import {getServiceCategories} from './../../api/GetApiFactorsAPI';
import {sendOffer} from '../../api/OfferApi';
import YoutubePlayer from 'react-native-youtube-iframe';
import { VLCPlayer, VlCPlayerView } from 'react-native-vlc-media-player';
import { duration } from 'moment';


const {glamProfileScreenStrings, genericStrings} = AppStrings;
const strings = glamProfileScreenStrings;

const popUpBoxMode = {
  slider: 0,
  speechVideo: 1,
  service: 2,
  time: 3,
  completed: 4,
};

class GlamProfileScreen extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    
    this.state = {
      username: '',
      swipeablePanelActive: false,
      height: 0,
      average_rating: 4.5,
      username: 'username',
      fullName: 'Full Name',
      ratingsText: '400+ ratings',
      gender: 'Female',
      address: 'Independence Layout, Enugu',
      glamDefaultImage: modelMale01,
      services: [],
      trueImages: [],
      serviceId: 0,
      topViewHeightPercent: 0.55,

      dialogVisible: false,
      dialogTitle: '',
      popUpBoxMode: popUpBoxMode.service,
      glamIndex: 0,
      selectedService: {},
      description: '',
      animationTop: new Animated.Value(0.55),
      animationHeight: new Animated.Value(0.45),
      viewState: true,
      progressVisible: true,
      progressDialogText: 'Loading Glam Details...',
      imgS: undefined,
      confirmDialogVisible: false,
      trueImageId: undefined,
      
      videoType: '',
      video: '',
      paused: false,
      playing: true,
    };
    
    this.windowHeight = Dimensions.get('window').height;
  }

  windowHeight = 0;
  topMarginPercent = 0.55;
  bottomViewHeightPercent = 0.45;

  async componentDidMount() {
    
    this.set({
      height: Dimensions.get('window').height,
      bottomViewHeightPercent: new Animated.Value(
        this.bottomViewHeightPercent * this.windowHeight,
      ),
      topMarginPercent: new Animated.Value(
        this.topMarginPercent * this.windowHeight,
      ),
      username: testData[this.state.glamIndex].username,
      average_rating: testData[this.state.glamIndex].star,
      ratingsText: testData[this.state.glamIndex].ratings + strings.ratings,
      gender: testData[this.state.glamIndex].gender,
      address: testData[this.state.glamIndex].address,
      glamDefaultImage: testData[this.state.glamIndex].image,
      fullName: testData[this.state.glamIndex].fullName,
      services: testData[this.state.glamIndex].services,
      bio: genericStrings.longText,
      
    });

    let glamId = (getEmptorMode()) ? this.props.navigation.getParam('glamId', 0) : getId();
    await getGlam(
      {glam_id: glamId},
      this.set,
      this.context,
    );
    this.setState({progressDialogText: 'Loading Glam Services...'});
    await getGlamServices(
      {glam_id: glamId},
      this.set, this.context
    );
    this.setState({progressVisible: false});
  }

  set = value => {
    this.setState(value);
  };

  renderStars(no_of_stars = 5, average_rating) {
    let elems = [];
    // average_rating = 4.5;
    for (let i = 1; i <= no_of_stars; i++) {
      if (i <= Math.floor(average_rating)) {
        elems.push(
          <TouchableOpacity
            key={i}>
            <Icon name="star" style={[Styles.starActive]} />
          </TouchableOpacity>,
        );
      }
      else if ((average_rating - i) != 0 && i <= Math.ceil(average_rating)) {
        elems.push(
          <TouchableOpacity
            key={i + 0.5}>
            <Icon name="star-half" style={[Styles.starActive]} />
          </TouchableOpacity>,
        );
      }
       else {
        elems.push(
          <TouchableOpacity
            key={i}>
            <Icon name="star" style={[Styles.starInactive]} />
          </TouchableOpacity>,
        );
      }
    }
    return elems;
  }

  heightAnimateInterval = undefined;
  moveRate = 0.01;
  playerRef = undefined;
  vlcPlayer = undefined;
  /*** variables for height of absoulte views */
  shadeViewHeight = '50%';
  shadeViewTop = '50%';

  onServiceTabSelected(index) {
    if (index == 1) {
      this.setState({viewState: true});

      setTimeout(() => {
        // this.set({topMarginPercent: 0.25 * this.windowHeight, bottomViewHeightPercent: 0.75 * this.windowHeight});
        this.toggleAnimation();
      }, 10);
      // if (this.heightAnimateInterval == undefined) {
      //     this.heightAnimateInterval = setInterval(() => {
      //         console.log(this.state.topMarginPercent.toFixed(2), this.state.bottomViewHeightPercent)
      //         if (this.state.bottomViewHeightPercent == 0.75) {
      //             clearInterval(this.heightAnimateInterval);
      //             this.heightAnimateInterval = undefined;
      //         }
      //         this.setState({ topMarginPercent: this.state.topMarginPercent - this.moveRate, bottomViewHeightPercent: this.state.bottomViewHeightPercent + this.moveRate})
      //     }, 1);
      // }
    } else {
      this.set({
        topMarginPercent: new Animated.Value(0.55 * this.windowHeight),
        bottomViewHeightPercent: new Animated.Value(0.45 * this.windowHeight),
      });
    }
  }

  toggleAnimation = () => {
    let heightVal = 0;
    let topMarginVal = 0;
    if (this.state.viewState == true) {
      heightVal = 0.75 * this.windowHeight;
      topMarginVal = 0.25 * this.windowHeight;
      Animated.timing(this.state.bottomViewHeightPercent, {
        toValue: heightVal,
        timing: 1500,
      }).start();
      // .start(()=>{this.setState({viewState : false})});
      Animated.timing(this.state.topMarginPercent, {
        toValue: topMarginVal,
        timing: 1500,
      }).start(() => {
        this.setState({viewState: false});
      });
    } else {
      heightVal = this.bottomViewHeightPercent * this.windowHeight;
      topMarginVal = this.topMarginPercent * this.windowHeight;
      Animated.timing(this.state.bottomViewHeightPercent, {
        toValue: heightVal,
        timing: 1500,
      }).start();
      //   .start(this.setState({viewState: true}));
      Animated.timing(this.state.topMarginPercent, {
        toValue: topMarginVal,
        timing: 1500,
      }).start(() => {
        this.setState({viewState: true});
      });
    }
  };

  renderImages() {
    let elems = [];
    this.state.trueImages.map((item, index) => {
      let imgSrc = getImage('glams',this.state.code,item.image,'true_images');
      if (this.state.imgS == undefined) this.setState({imgS: imgSrc});
      
      elems.push(
        <TouchableOpacity
          key={item.id}
          onPress={() =>
            this.setState({
              dialogVisible: true,
              dialogTitle: this.state.fullName + "'s pictures",
              popUpBoxMode: popUpBoxMode.slider,
            })
          }>
          <Image
            style={[Styles.trueImage]}
            source={imgSrc}
          />
          {
              !getEmptorMode() &&
              <TouchableOpacity 
                  style={{position: 'absolute', height: 20, width: 20, alignSelf: 'flex-end', zIndex: 2, top: 0,right:1}}
                  onPress={() => this.onTrueImageDelete(item.id)}
              >
                  <Icon name={'ios-trash'} style={{ color: 'red', fontWeight: 'bold', position: 'absolute', zIndex: 2, height: 20, width: 20, alignSelf: 'flex-end'}} />
              </TouchableOpacity>
          }
        </TouchableOpacity>,
      );
    });
    return elems;
  }

  renderIntro() {
    return (
      <View style={[Styles.introView]}>
        <Text>True Images</Text>
        <View>
          <ScrollView horizontal>
            {this.renderImages()}
          </ScrollView>
        </View>
        <View style={[{flex: 1, padding: 5, marginBottom: '10%'}]}>
          <Text>About Me</Text>
          <View style={[Styles.aboutMeView]}>
            <ScrollView
              contentContainerStyle={{flexGrow: 1}}
              nestedScrollEnabled>
              <Text>{this.state.bio}</Text>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }

  parentCallback(data) {
    this.setState({
      popUpBoxMode: popUpBoxMode.service,
      dialogVisible: true,
      dialogTitle: '',
    });
    this.setState({selectedService: data, serviceId: data.id});
  }

  async bookNowCallback(data) {
    this.setState({description: data});

    let res = await sendOffer({
      glam_id: this.props.navigation.getParam('glamId', 0),
      emptor_id: getId(),
      glam_rate_id: this.state.serviceId,
      real_amount: this.state.selectedService.amount,
      emptor_amount: data.emptorAmount,
      description: data.description,
      venue: data.venue,
      starting_at: data.startDate,
      ending_at: data.endDate,
    });

    if (res != undefined) {
      this.setState({dialogVisible: false});
    }
  }

  updateServices = (id, isCategory=true, service=undefined) => {
    let services = this.state.services;
    if (isCategory) {
      services = services.filter(x => x.id != id);
    }
    else if(!isCategory && service != undefined) {
      let index = -1;
      let currentService = services.filter((x, i) => {
        
        if (x.fields.indexOf(service) != -1) {
          index = i;
          return x;
        }
      })[0];
      
      let fields = currentService.fields;
      // fields = services[services.indexOf(service)].fields;
      fields = fields.filter(x => x.id != id);
      currentService.fields = fields;
      if (fields.length > 0) {
        services[index] = currentService;
      }
      else {
        services = services.filter(x => x.id != currentService.id);
      }
      
    }

    this.setState({services: services})
  }

  renderBookingComplete() {
    return (
      <View style={[{padding: 20, alignItems: 'center'}]}>
        <Text style={[Styles.bookingCompleteText]}>
          {this.state.selectedService.glamServiceTitle}
        </Text>
        <Text style={[Styles.bookingCompleteText, {fontSize: 28}]}>
          {this.state.selectedService.title}
        </Text>
        <Text style={[Styles.bookingCompleteText, {color: 'lightblue'}]}>
          2:30pm
        </Text>
        <View
          style={[
            {flexDirection: 'row', justifyContent: 'space-around', padding: 7},
          ]}>
          <Icon
            name="ios-checkmark-circle"
            style={{color: Colours.green, marginRight: 5}}
          />
          <Text style={{textAlignVertical: 'center'}}>Booking Complete</Text>
        </View>
        <Button
          block
          onPress={() =>
            this.setState({
              dialogVisible: false,
              popUpBoxMode: popUpBoxMode.service,
            })
          }>
          <Text>Dismiss</Text>
        </Button>
      </View>
    );
  }

  onTrueImageDelete = async (imageId) => {
    this.setState({
      trueImageId: imageId,
      confirmDialogVisible: true,
    });
  }

  onGlamVideoPress = (type) => {
    let videoId = getYoutubeVideoId(this.state[type]);
    console.log("VideoId", videoId, type, this.state[type]);

    if (videoId == null) {
      Toast.show({
        text: 'No Video to show.',
        duration: 3000,
        type: 'danger',
      });
      
      return;
    }
    
    if (videoId !== "") {
      this.setState({videoType: 'youtube'});
    }
    else {
      this.setState({videoType: 'local'});
      videoId = this.state[type];
    }

    if (type == 'speechVideo') {
      this.setState({dialogTitle: 'Speech Video'});
    }
    else {
      this.setState({dialogTitle: 'Body Check Video'});
    }

    this.setState({dialogVisible: true, popUpBoxMode: popUpBoxMode.speechVideo, video: videoId});

  }

  onProgress = (e) => {
    console.log("progress", e);
  }
  onEnded = (e) => {
    console.log("ended", e);
  }
  
  onBuffering = (e) => {
    console.log("buffering", e);
  }
  
  _onError = (e) => {
    console.log("error", e);
  }
  
  onStopped = (e) => {
    console.log("Stopped", e);
  }
  
  onPlaying = (e) => {
    console.log("Playing", e);
  }
  
  onPaused = (e) => {
    console.log("Paused", e);
  }

  

  render() {
    const animatedStyle = {
      height: this.state.animationValue,
    };
    return (
      // <ScrollView contentContainerStyle={{flexGrow: 1, flex: 1, }}>
      <View
        style={[
          {
            height: this.state.height - 200,
            flex: 1,
            width: '100%',
            marginBottom: 40,
          },
        ]}>
        <View
          style={[
            {
              flex: 1,
              position: 'absolute',
              height: this.state.height,
              width: '100%',
            },
          ]}>
          <View
            style={[
              {
                position: 'absolute',
                height: this.state.topViewHeightPercent * this.state.height,
                width: '100%',
              },
            ]}>
            <Image
              source={this.state.glamDefaultImage}
              style={[Styles.backgroundGlamImage]}
            />
            {/* background black shade */}
            <View
              style={[
                {
                  backgroundColor: 'black',
                  opacity: 0.5,
                  width: '100%',
                  position: 'absolute',
                  height: this.shadeViewHeight,
                  top: this.shadeViewTop,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                },
              ]}
            />
            {/* overllaping view with content */}
            <View
              style={[
                {
                  width: '100%',
                  position: 'absolute',
                  height: this.shadeViewHeight,
                  top: this.shadeViewTop,
                },
              ]}>
              <View style={[{flex: 1, paddingLeft: 10}]}>
                <View>
                  {/* username */}
                  <Text style={[Styles.whiteText, Styles.userNameText]}>
                    {this.state.username}
                  </Text>
                  {/* fullName */}
                  <Text style={[Styles.whiteText, Styles.fullNameText]}>
                    {this.state.fullName}
                  </Text>
                </View>
                <View
                  style={[{width: '100%', flexDirection: 'row', padding: 5}]}>
                  <View
                    style={[
                      {
                        alignSelf: 'flex-start',
                        alignItems: 'flex-start',
                        flex: 0.4,
                        height: '100%',
                      },
                    ]}>
                    {/* render stars */}
                    <View style={[{flexDirection: 'row', flex: 0.5}]}>
                      {this.renderStars(5, this.state.average_rating)}
                    </View>
                    <View
                      style={[
                        {
                          flex: 0.5,
                          alignSelf: 'stretch',
                          alignContent: 'flex-end',
                        },
                      ]}>
                      {/* ratings */}
                      <Text style={[Styles.whiteText]}>
                        {this.state.ratingsText}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      {
                        alignSelf: 'flex-end',
                        alignItems: 'flex-end',
                        flex: 0.6,
                        paddingRight: 5,
                      },
                    ]}>
                    {/* gender */}
                    <Text
                      style={[
                        Styles.whiteText,
                        {marginBottom: 5, textTransform: 'capitalize'},
                      ]}>
                      {this.state.gender}
                    </Text>
                    {/* address */}
                    <Text style={[Styles.whiteText, {textAlign: 'right'}]}>
                      {this.state.address}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    {
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-evenly',
                      paddingRight: 5,
                    },
                  ]}>
                  <TouchableOpacity style={[Styles.speechBodyButton]} onPress={() => this.onGlamVideoPress('speechVideo')}>
                    <Icon name="ios-film" />
                    <Text style={[Styles.speechBodyText]}>
                      {strings.speechVideo}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[Styles.speechBodyButton]} onPress={() => this.onGlamVideoPress('bodyCheck')}>
                    <Icon name="ios-film" />
                    <Text style={[Styles.speechBodyText]}>
                      {strings.bodyVideo}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <Animated.View
            style={[
              {
                position: 'absolute',
                height: this.state.bottomViewHeightPercent,
                width: '100%',
                top: this.state.topMarginPercent,
              },
            ]}>
            {/* <Container>
                                <Content> */}
            {/* <ScrollView></ScrollView> */}
            <Tabs onChangeTab={({i}) => this.onServiceTabSelected(i)} locked>
              <Tab
                heading={
                  <TabHeading style={{backgroundColor: '#000'}}>
                    <Text>{strings.introTabHeading}</Text>
                  </TabHeading>
                }>
                {this.renderIntro()}
              </Tab>
              <Tab
                heading={
                  <TabHeading style={{backgroundColor: '#000'}}>
                    <Text>{strings.servicesTabHeading}</Text>
                  </TabHeading>
                }>
                <ScrollView
                  nestedScrollEnabled
                  style={{
                    height: '100%',
                    flex: 1,
                    maxHeight: '100%',
                    alignSelf: 'stretch',
                  }}
                  contentContainerStyle={{flexGrow: 1}}>
                  <View
                    style={{
                      backgroundColor: Colours.gray,
                      height: '100%',
                      maxHeight: '100%',
                      padding: 10,
                      flex: 1,
                      alignSelf: 'stretch',
                    }}>
                    {this.state.services.map(service => {
                      return (
                        <GlamService
                          key={service.id}
                          parentCallback={data => this.parentCallback(data)}
                          glamServiceTitle={service.name}
                          glamServicePrices={service.fields}
                          id={service.id}
                          updateServices={data => this.updateServices(data.id, data.isCategory, data.service)}
                        />
                      );
                    })}
                  </View>
                </ScrollView>
              </Tab>
            </Tabs>
            {/* </Content>
                            </Container> */}
          </Animated.View>
        </View>
        {/* dialog */}
        <Dialog
          visible={this.state.dialogVisible}
          title={this.state.dialogTitle}
          onTouchOutside={() => this.setState({dialogVisible: false})}
          dialogStyle={{padding: 0}}
          contentStyle={{padding: 0, width: '100%'}}>
          {this.state.popUpBoxMode == popUpBoxMode.slider && (
            
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
          )}
          {this.state.popUpBoxMode == popUpBoxMode.speechVideo && (
            <View>
              {
                this.state.videoType == 'youtube' && 
                <View style={[{width: 300, height: 260, marginRight: 10, paddingBottom: 10}]}>
                  <YoutubePlayer
                    ref={(ref) => this.playerRef = ref}
                    height={300}
                    width={'100%'}
                    webViewStyle={{marginLeft: 30}}
                    videoId={this.state.video}
                    play={this.state.playing}
                    onChangeState={event => console.log(event)}
                    onReady={() => console.log("ready")}
                    onError={e => console.log(e)}
                    onPlaybackQualityChange={q => console.log(q)}
                    volume={100}
                    playbackRate={1}
                    playerParams={{
                      cc_lang_pref: "uk",
                      showClosedCaptions: false
                    }}
                  />
                </View>
              }
              {
                this.state.videoType == 'local' && 
                <View style={[{width: 250, height: 260, marginRight: 10, paddingBottom: 10}]}>
                  <VLCPlayer
                      ref={(ref) => this.vlcPlayer = ref}
                      style={{width: '100%', height: 200, marginLeft: 30}}
                      videoAspectRatio="16:9"
                      paused={this.state.paused}
                      source={{ uri: this.state.video}}
                      onProgress={this.onProgress}
                      onEnd={this.onEnded}
                      onBuffering={this.onBuffering}
                      onError={this._onError}
                      onStopped={this.onStopped}
                      onPlaying={this.onPlaying}
                      onPaused={this.onPaused}
                  />
                </View>
              }
            </View>
          )}
          {this.state.popUpBoxMode == popUpBoxMode.service && (
            <ScrollView>
              <BookPopUp
                glamImage={this.state.glamDefaultImage}
                username={this.state.username}
                selectedService={this.state.selectedService}
                bookNowCallback={data => this.bookNowCallback(data)}
              />
            </ScrollView>
          )}
        </Dialog>
        <ProgressDialog
            visible={this.state.progressVisible}
            title="Please Wait..."
            message={this.state.progressDialogText}
        />
        <ConfirmDialog
            title="Confirm Delete"
            message={"Are you sure you want to delete this image'?"}
            visible={this.state.confirmDialogVisible}
            onTouchOutside={() => this.setState({ confirmDialogVisible: false })}
            positiveButton={{
                title: "Yes",
                onPress: async () => {
                  this.setState({confirmDialogVisible: false, progressVisible: true, progressDialogText: '' });
                  
                  await deleteTrueImage({
                    image_id: this.state.trueImageId,
                    glam_id: this.context.state.user_data.id,
                  }, this.set, this.context, this.state);

                  this.setState({progressVisible: false});
                }
            }}
            negativeButton={{
                title: "No",
                onPress: () => this.setState({ confirmDialogVisible: false })
            }}
        />
      </View>
      // </ScrollView>
    );
  }
}

export default GlamProfileScreen;
