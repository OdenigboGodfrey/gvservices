import React, {useRef, useState} from 'react';
import { Image, Text, Platform, ScrollView } from 'react-native';
import { MapAPIKey, PlacesAPIKey, getPaystackHTML, Colours, urls, Request, setImagePickerOptions } from './src/utils';
import { View, Icon, Button, Toast } from 'native-base';
import { GooglePlacesInput } from './src/components/PlacesInput';
import PlacesInput from 'react-native-places-input';
import ImagePicker from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { WebView } from 'react-native-webview';
import { strings } from './src/strings';
import { SpinnerButton } from './src/components/SpinnerButton';
import RNFS from "react-native-fs";
import RNFetchBlob from 'rn-fetch-blob';
// import YoutubePlayer from 'react-native-youtube-iframe';
import { VLCPlayer, VlCPlayerView } from 'react-native-vlc-media-player';
// import Video from 'react-native-video';


 
const options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
    privateDirectory: true
  },
  permissionDenied: {
    text: 'Glam needs access to your camera',
    title: 'Camera Access'
  },
  mediaType: 'video',
};

var files = [
  {
    name: 'file',
    filename: "I'm The Man",
    filepath: RNFS.DownloadDirectoryPath + "/vlc-record-2020-06-06-23h58m16s.mp4",
    filetype: 'video/mp4'
  }
];

const folderPath = '/videos/';
// const folderPath = '/images/profile-picture/';

const launchCamera = () => {
  setImagePickerOptions('mixed');
  ImagePicker.launchCamera({
      durationLimit: 5,
      title: 'Capture Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
        privateDirectory: true
      },
      permissionDenied: {
        text: 'Glam needs access to your camera',
        title: 'Camera Access'
      },
      mediaType: 'video',
    }, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        Toast.show({
            text: errorMessages.errorOccured,
            buttonText: genericStrings.dismiss,
        })
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        // this.setState({video: response, videoCaptured: true});
        // video = response;
        // video.filename ='';
        if (!RNFS.exists(RNFS.TemporaryDirectoryPath + folderPath)) {
          RNFS.mkdir(RNFS.TemporaryDirectoryPath + folderPath)
        }
        RNFS.moveFile(response.path, RNFS.TemporaryDirectoryPath + folderPath+ "I'm The Man.mp4");
      }
    });
}
let video = {
  filename: "I'm The Man",
  filepath: RNFS.TemporaryDirectoryPath + folderPath + "I'm The Man.mp4",
  filetype: 'video/mp4'
};

const onRnBlobPress = () => {
  btnClicked = true;
  let data = new FormData();
  // data.append('file',video);

  console.log("video OBJ", video);

  RNFetchBlob.fetch('POST', urls.base +  urls.test, {
    'Content-Type' : 'multipart/form-data',
  }, [
    // element with property `filename` will be transformed into `file` in form data
    { name : 'file', filename : video.filename +'.'+ video.filetype.split('/')[1], type:video.filetype, data: RNFetchBlob.wrap(video.filepath)},
    
  ]).then((resp) => {
    console.log(JSON.stringify(resp));
  }).catch((err) => {
    // ...
  })
}

const onPress = async() => {
  btnClicked = true;
  let data = new FormData();
  data.append('file',video);

  console.log("video", data);

  axios({
    method:'post',
    url: urls.base +  urls.test,
    data:data

  }).then(res=>{
    console.log(res);
    let RESI = JSON.stringify(res);
    console.log(RESI);
    alert(RESI);
  }).catch(error=>{
    let ERRR= JSON.stringify(error);
    console.log("Error", ERRR);
  })

  // let xhr = new XMLHttpRequest()
  // xhr.open('post', urls.base +  urls.test)
  // xhr.send(data)
  // xhr.onerror = function(e) {
  //   console.log('err', e)
  // }
  // xhr.onreadystatechange = function() {
  //   if(this.readyState === this.DONE) {
  //     console.log(this.response)
  //   }
  // }

  // let res  = fetch(urls.base +  urls.test, {
  //   method: 'POST',
  //   body: data,
  // })
  //   .then( response => {
  //     // alert(JSON.stringify(response));
  //     console.log('1st', JSON.stringify(response), urls.base + urls.test);
  //     // console.log("utitl", (await response.text()));
  //     return response.json();
  //   })
  //   .then(data => {
  //     // alert(JSON.stringify(data));
  //     console.log('2nd', JSON.stringify(data), urls.base + urls.test);
  //     return data;
  //   })
  //   .catch(error => {
  //     console.log('3rd', error);
  //     return error;
  //   });

}

const onFsPress = () => {
  var uploadUrl = 'http://192.168.137.1:8000/api/test';

  var uploadBegin = (response) => {
    console.log("File Name", files[0].filepath);
    var jobId = response.jobId;
    console.log('UPLOAD HAS BEGUN! JobId: ' + jobId);
  };

  var uploadProgress = (response) => {
    var percentage = Math.floor((response.totalBytesSent/response.totalBytesExpectedToSend) * 100);
    console.log('UPLOAD IS ' + percentage + '% DONE!');
  };

  RNFS.uploadFiles({
    toUrl: uploadUrl,
    files: files,
    headers: {
      'Accept': 'application/json'
    },
    method: 'POST',
    begin: uploadBegin,
    progress: uploadProgress
  }).promise.then((response) => {
      console.log('FILES!', response); 
      if (response.statusCode == 200) {
        console.log('FILES UPLOADED!'); // response.statusCode, response.headers, response.body
      } else {
        console.log('SERVER ERROR');
      }
    })
    .catch((err) => {
      if(err.description === "cancelled") {
        // cancelled by user
      }
      console.log('Error ',err);
    });

}

const videoError = (e) => {
  console.log("error", e);
}

const onBuffer = (b) => {
  console.log("buffering", b);
}

const reg = (url) => {
  var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = url.match(regExp);
  if (match && match[2].length == 11) {
    return match[2];
  } else {
    return "";
  }
}

const onProgress = (e) => {
  console.log("progress", e);
}
const onEnded = (e) => {
  console.log("ended", e);
}

const onBuffering = (e) => {
  console.log("buffering", e);
}


const _onError = (e) => {
  console.log("error", e);
}

const onStopped = (e) => {
  console.log("Stopped", e);
}

const onPlaying = (e) => {
  console.log("Playing", e);
}

const onPaused = (e) => {
  console.log("Paused", e);
}



let avatarSource = undefined;
let date= new Date();
let btnClicked = false;

export const Renderer = ()=> {
  let player;
  // let playing = true;

  let videoURL = "https://www.youtube.com/watch?v=TcGHKrh8J8I";
  videoURL = urls.hostAddress + "/uploads/glams/f90829c7-26cf-4674-8e6f-2a64cb3d/videos/body_video/101.mp4";
  let videoId = reg(videoURL);
  // let vlcPlayer = undefined;
  // let paused = false;
  let uri = videoURL;

  const vlcPlayer = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [paused, setPaused] = useState(false);
  const [isFull, setIsFull] = useState(false);
  
  console.log(uri + "-" +videoId + ".");
  
  return(
    <View style={{flex: 1, position: 'absolute', width: '100%', height: '100%'}}>
      {/* <GPlacesInput /> */}
      <View style={{position: 'absolute', width: '100%', zIndex: 3}}>
        <Text>Hello 1</Text>
        <Text>Hello 2</Text>
        <Text>Hello 3</Text>
      </View>
      
      <View style={{backgroundColor: 'white',position: 'absolute', zIndex: 100, width: '100%', top: 60, elevation: 5}}>
        <GooglePlacesInput
          top={5}
          left={3}
          width={'98%'}
        />
      </View>
      <View style={{position: 'absolute', width: '100%', zIndex: 3, top: 100}}>
        <Text>Hello 4</Text>
        <Text>Hello 5</Text>
        <Text>Hello 6</Text>
        <Text>Hello 7</Text>
      </View>
      
      
             {/* <VlCPlayerView
          ref={vlcPlayer}
           autoplay={true}
           url={uri}
           
           //BackHandle={BackHandle}
           ggUrl={uri}
           showGG={true}
           showTitle={true}
           title="video"
           showBack={true}
           onLeftPress={()=> {console.log('left press', e)}}
           isFull={isFull}
           startFullScreen={() => {
             setIsFull(true);
           }}
           closeFullScreen={() => {
            setIsFull(false);
           }}
           onReplayPress={() => {
             console.log("Replay PRess", vlcPlayer);
             vlcPlayer.current._onReplayPress();
            }}
       /> */}
      
        </View>
  );
}


 
const GPlacesInput = () => {
  return (
    <PlacesInput
        googleApiKey={MapAPIKey}
        placeHolder={"Some Place holder"}
        language={"en-US"}
        onSelect={place => console.log(JSON.stringify(place))}
        iconResult={<Icon name="ios-pin" size={25} />}
        stylesContainer={{
          position: 'relative',
          alignSelf: 'stretch',
          margin: 0,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          shadowOpacity: 0,
          borderColor: '#dedede',
          borderWidth: 1,
          marginBottom: 10
      }}
      stylesList={{
          top: 50,
          borderColor: '#dedede',
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderBottomWidth: 1,
          left: -1,
          right: -1
      }}
    />
  );
}