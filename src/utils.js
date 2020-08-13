import ConnectivityTracker from 'react-native-connectivity-tracker';
// import {useNetInfo} from "@react-native-community/netinfo";
import {Toast} from 'native-base';
import {deleteData, getAllKeys, getData} from './storage/MainStorage';
import moment from 'moment';
import { deposit } from './api/WalletAPI';

export const Colours = {
  primaryTextColor: 'orange',
  white: 'white',
  black: 'black',
  gray: '#ccc',
  firebrick: '#B22222',
  green: 'green',
  darkmagenta: '#8B008B',
  grey: '#808080',
  TapestryBlue: '#01382C',
  red: 'red',
  secondaryBlack: "#212129",
};

//../assets/images/glam-logo-pruple.png

export const backgroundImage01 = require('../assets/images/glam-3.jpg');
export const glamIcon01 = require('../assets/images/glam-logo-pruple.png');
export const igIcon01 = require('../assets/images/ig-icon.png');
export const fbIcon01 = require('../assets/images/fb-icon.png');
export const googleIcon01 = require('../assets/images/google-icon.png');

export const modelMale01 = require('../assets/images/1563354319.png');
export const modelFemale01 = require('../assets/images/1563354463.png');
export const modelFemale02 = require('../assets/images/1563354377.png');
export const modelFemale03 = require('../assets/images/1562651452.png');

export const MapAPIKey = 'AIzaSyDYxTpLt5d5xrzK-pywt2gThQOMK8K8iWw';

export const PlacesAPIKey = 'AIzaSyAM1PKFq5cRaPYKfxGLe_1bieAjzvb29UY';

export const GeocodingAPIKey = 'AIzaSyD33IbjqYSl4ZnvZncpQs5Gyg8Ovi0BGdY';

const payStackKey = 'sk_test_f9834df4ac267fdf7ebb3630bb29f4da35b73965';

let api_token = '';
let id;
let context;
export let isEmptorMode =
  context != undefined ? context.state.isEmptorMode : undefined;

export const POSITIVE = 1;
export const NEGATIVE = 0;
export const NEUTRAL = -1;

export let toastDuration = 5000;

//test data
export let testData = [
  {
    id: 1,
    image: modelFemale02,
    username: 'amanda24',
    fullName: 'Amanda Emene',
    star: 4,
    ratings: '402',
    gender: 'female',
    address: 'Emene Enugu',
    services: [
      {
        name: 'Usher',
        fields: [
          {title: 'Days (5hrs max)', amount: 'N15,000'},
          {title: 'Night', amount: 'Custom Offer'},
          {title: 'Hourly', amount: 'N5,200'},
        ],
      },
      {
        name: 'Glam Date',
        fields: [
          {title: 'Night out', amount: 'N15,000'},
          {title: 'By the hour', amount: 'N5,100'},
          {title: 'Weekend', amount: 'N25,000'},
        ],
      },
      {
        name: 'Club Girl',
        fields: [
          {title: 'Night out', amount: 'N5,000'},
          {title: 'Weekend', amount: 'N25,000'},
        ],
      },
      {
        name: 'Product Activation',
        fields: [
          {title: 'Daily', amount: 'N3,000'},
          {title: 'Weekendly', amount: 'N15,000'},
        ],
      },
      {
        name: 'Model/Adverts',
        fields: [
          {title: 'Run Way', amount: 'Custom Offer'},
          {title: 'Photo Shoot', amount: 'Custom Offer'},
        ],
      },
    ],
  },
  {
    id: 2,
    image: modelFemale03,
    username: 'evelyn22',
    fullName: 'Evelyn Independence',
    star: 5,
    ratings: '202',
    gender: 'female',
    address: 'Independence Layout, Enugu',
    services: [
      {
        name: 'Usher',
        fields: [
          {title: 'Days (5hrs max)', amount: 'N14,000'},
          {title: 'Night', amount: 'N8000'},
          {title: 'Hourly', amount: 'N2,500'},
        ],
      },
      {
        name: 'Glam Date',
        fields: [
          {title: 'Night out', amount: 'N15,000'},
          {title: 'By the hour', amount: 'N5,100'},
          {title: 'Weekend', amount: 'N21,000'},
        ],
      },
    ],
  },
  {
    id: 3,
    image: modelFemale01,
    username: 'Leila21',
    fullName: 'Leila Okpara',
    star: 2,
    ratings: '521',
    gender: 'female',
    address: 'Okpara Avenue Enugu',
    services: [
      {
        name: 'Glam Date',
        fields: [
          {title: 'Night out', amount: 'N20,000'},
          {title: 'By the hour', amount: 'N6,500'},
          {title: 'Weekend', amount: 'N30,000'},
        ],
      },
      {
        name: 'Club Girl',
        fields: [
          {title: 'Night out', amount: 'N7,000'},
          {title: 'Weekend(Fri,Sat)', amount: 'N15,000'},
        ],
      },
    ],
  },
  {
    id: 4,
    image: modelMale01,
    username: 'james26',
    fullName: 'James Maryland',
    star: 4,
    ratings: '122',
    gender: 'male',
    address: 'Marland, Enugu',
    services: [
      {
        name: 'Model/Adverts',
        fields: [
          {title: 'Run Way', amount: 'N20,000'},
          {title: 'Photo Shoot', amount: 'N12,000'},
        ],
      },
      {
        name: 'Usher',
        fields: [
          {title: 'Days (5hrs max)', amount: 'N15,000'},
          {title: 'Night', amount: 'Custom Offer'},
          {title: 'Hourly', amount: 'N5,200'},
        ],
      },
      {
        name: 'Product Activation',
        fields: [
          {title: 'Daily', amount: 'N1,00'},
          {title: 'Weekendly', amount: 'N5,000'},
        ],
      },
    ],
  },
];

// http://192.168.137.196
// http://192.168.1.102
// http://192.168.43.171
// http://192.168.43.19
// http://192.168.137.1
// http://localhost
// http://192.168.43.171:8000
// http://192.168.43.111:8000
// http://the-glams.herokuapp.com/
//https://gvservices.goveratech.com

let base = 'https://gvservices.goveratech.com';
export const urls = {
  googleMapApi: 'https://maps.googleapis.com/maps/api/geocode/json?address=',
  hostAddress: base,
  base: base + '/api',
  glam: '/glam',
  emptor: '/emptor',
  register: '/register',
  login: '/login',
  edit: '/edit',
  get: '/get',
  save: '/save',
  action: '/action',
  send: '/send',
  all: '/all',
  create: '/create',
  states: '/states',
  allGlams: '/all',
  singleGlam: '/single',
  mark: '/mark',
  trueImages: '/true_images',
  verificationVideo: '/verification_video',
  categories: '/categories',
  glam_rate: '/rate',
  services: '/services',
  offer: '/offer',
  counterAmount: '/counter_amount',
  close: '/close',
  badges: '/badges',
  gig: '/gig',
  interest: '/interest',
  filter: '/filter',
  booking: '/booking',
  rating: '/rating',
  delete: '/delete',
  deleteGlamRateByCategory: '/delete_category',
  wallet: '/wallet',
  deposit: '/deposit',
  paystack: 'https://api.paystack.co',
  charge: '/charge',
  submitOTP: '/submit_otp',
  submitPin: '/submit_pin',
  submitPhone: '/submit_phone',
  submitBirthday: '/submit_birthday',
  reference: '/reference',
  requestPaystackKey: '/paystack_key',
  paystackBank: '/bank',
  pay: '/pay',
  password: '/password',
  change: '/change',
  initReset: '/init_reset',
  validate: '/validate',
  reset: '/reset',
  dispute: '/dispute',
  open: '/open',
  test: '/test',
};

let options = {
  title: 'Capture Image',
  storageOptions: {
    skipBackup: true,
    path: 'images',
    privateDirectory: false,
  },
  permissionDenied: {
    text: 'GV Services needs access to your camera',
    title: 'Camera Access',
  },
  mediaType: 'video',
};

export function setEmptorMode(isEmptorModeValue) {
  context.set({isEmptorMode: isEmptorModeValue});
  setTimeout(() => {
    console.log('set emptor', context.state.isEmptorMode);
  }, 1000);

  isEmptorMode = isEmptorModeValue;
}

export function getEmptorMode() {
  return context != undefined ? JSON.parse(context.state.isEmptorMode) : true;
}

export function setContext(appContext) {
  if (context === undefined) {
    context = appContext;
  }
  else {
    context.state = appContext.state;
  }
  
  console.log('setting cpntext');
  try {
    console.log("cont", context.reloadState2());
  }
  catch{
    console.log("reloadState2 failed");
  }
}

export function getImagePickerOptions() {
  return options;
}

export function setImagePickerOptions(mediaType) {
  options.mediaType = mediaType;
}

export function getSubBase() {
  return getEmptorMode() == true ? urls.emptor : urls.glam;
}

export function setToken(value) {
  api_token = value;
}

export function getToken() {
  if (api_token == '' || api_token == undefined) {
    return api_token;
  }
  return context.state.token;
}

export function setId(value) {
  id = value;
}

export function getId() {
  // if (id == undefined) id = 4;
  return id;
}

export function prepareMedia(data) {
  // console.log("Media", JSON.stringify({name: data.fileName,type: data.type,uri: data.uri,size: data.fileSize,}));
  return {
    name: data.fileName,
    type: data.type,
    uri: data.uri,
    size: data.fileSize,
  };
  // return {
  //   name: data.name,
  //   type: data.type,
  //   uri: data.uri,
  //   size: data.size
  // };
}

function getIsLocal() {
  return true;
}

export const getCurrency = () => {
  return getIsLocal() ? ' NGN' : ' $';
};

export const getYoutubeVideoId = (url) => {
  if (url == null) return null;
  
  var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = url.match(regExp);
  if (match && match[2].length == 11) {
    return match[2];
  } else {
    return "";
  }
}

/* POST Request fetch function **/
export async function Request(Base, Url, Data, PreparedData = false) {
  console.log('base', Base, ' url', Url);

  // let Connection = await ConnectionStatus();
  // if (!Connection.isConnected) {
  //   Connection.showMessage();
  //   return;"application/octet-stream"
  // } Accept: 'application/json',
  //
  let headers = {};
  // console.log("HEaders", headers, "data", Data, context);
  if (context != undefined && !Base.toString().includes('paystack')) {
    headers.Authorization = 'Bearer ' + context.state.token;
    // headers['Authorization'] = 'Bearer ' + t;
    // console.log("Auth", headers['Authorization']);
  }
  else if (context != undefined && Base.toString().includes('paystack')) {
    headers['Content-Type'] = "application/json"; 
    headers.Authorization = 'Bearer ' + payStackKey;
  }

  console.log("HEaders", headers, "data", Data);
  return fetch(Base + Url, {
    method: 'POST',
    headers: headers,
    body: !PreparedData ? PrepareData(Data) : Data,
  })
    .then(response => {
      // alert(JSON.stringify(response));
      console.log('1st', JSON.stringify(response), Base + Url);
      // console.log("utitl", (await response.text()));
      return response.json();
    })
    .then(data => {
      // alert(JSON.stringify(data));
      console.log('2nd', JSON.stringify(data), Base + Url);
      return PrepareResult(data, '');
    })
    .catch(error => {
      console.log('3rd', error);
      return PrepareResult({}, error, true);
    });

  // .catch(error => {
  //   console.log("3rd", error)
  //   return PrepareResult(failed, error, FailedMessageKey);
  // });
}

export async function GetRequest(Base, Url, FailedMessageKey) {
  // let Connection = await ConnectionStatus();
  // if (!Connection.isConnected) {
  //   Connection.showMessage();
  //   return;
  // }
  console.log('base', Base, ' url', Url);
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
    'Access-Control-Allow-Origin': '*',
  };

  if (context != undefined && !Base.toString().includes('paystack')) {
    headers.Authorization = 'Bearer ' + context.state.token;
  }

  return fetch(Base + Url, {
    method: 'GET',
    headers: headers,
  })
    .then(response => {
      console.log("1st", JSON.stringify(response), Base + Url);
      return response.json();
    })
    .then(data => {
      console.log("2nd", JSON.stringify(data), Base + Url);
      // return PrepareResult(success, data);
      return data;
    })
    .catch(error => {
      console.log(JSON.stringify(error));
      return error;
      // return PrepareResult(failed, error, FailedMessageKey);
    });
}

export function PrepareResult(api_data, message, isError = false) {
  const {status, data} = api_data;
  //if isError return the error message in an array
  //else return the message from the api
  // console.log("preparingResult", JSON.stringify(api_data), message.toString(), "isError", isError);
  // if (data.message != undefined) {
  //   data.messages = data.message;
  // }
  return {
    status: status != undefined ? status : false,
    data: data != undefined ? data : {},
    messages: isError
      ? [message.toString()]
      : (data != undefined && data.messages != undefined)
        ? data.messages
        : [api_data.message],
    isError: isError,
  };
}

export async function ConnectionStatus() {
  onConnectivityChange = async (isConnected, timestamp, connectionInfo) => {
    ConnectionStatus = isConnected;
    // console.log("iscon", isConnected);
    // connectionInfo is only available if attachConnectionInfo is set to true
  };

  ConnectivityTracker.init({
    onConnectivityChange,
    attachConnectionInfo: true,
    onError: msg => {
      // console.log(msg);
      Toast.show({
        type: 'danger',
        message: msg,
      });
    },
    // verifyServersAreUp: () => store.dispatch(checkOurServersAreUp()),
  });
  // const netInfo = useNetInfo();
  // NetInfo.fetch().then(state => {
  //     console.log("Connection type", state.type);
  //     console.log("Is connected?", state.isConnected);
  //   });

  let ConnectionStatus = await ConnectivityTracker.tryConnection().then(
    response => response,
  );
  //
  // console.log("ConnectStatr", ConnectionStatus)
  return {
    isConnected: ConnectionStatus,
    showMessage: () => {
      Toast.show({
        type: 'danger',
        text: 'No Internet Connection.',
        buttonText: 'Okay',
      });
    },
  };
}

export function getImage(userType, code, filename, type = 'avatars') {
  // if (userType == 'glams') code = '83c997ca-8cf0-4b58-b445-2af703f4';
  type += '/';
  if (type == 'avatars') {
    type += 'medium/';
  }
  let uri =
    urls.hostAddress +
    '/uploads/' +
    userType +
    '/' +
    code +
    '/' +
    type +
    filename;
  console.log(uri);
  // if (type == 'avatar') {
  //   baseURL =
  //   return "83c997ca-8cf0-4b58-b445-2af703f4/avatars/image-04d18833-5c28-4386-b323-1a9f37026f32.jpg
  // }
  if (filename === null || filename === '' || filename == undefined) {
    return modelMale01;
  }
  return {uri: uri};
}

export function getAge(dateString) {
  // split and pick only the year from the dateString
  dateString = getDate(dateString);
  dateString = Date.parse(dateString);
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  // console.log(dateString, birthDate);
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function getDate(dateString) {
  return dateString.split(' ')[0];
}

export function getTime(dateString) {
  let date = new Date(dateString);
  console.log(dateString, date);
  return (
    ('0' + date.getHours()).slice(-2) +
    ':' +
    ('0' + date.getMinutes()).slice(-2)
  );
}

export async function logout() {
  // let allKeys = await getAllKeys();
  // if (allKeys.status == POSITIVE) {
  //   allKeys.data.forEach(async key => {
  //     if (key != 'states') await deleteData(key);

  //   });
  // }
  await deleteData('user_data');
  await deleteData('isEmptorMode');
  console.log("Restting ", context, context.set);
  if (context != undefined && context.reset != undefined) {
    context.reset();
  }
  // console.log('logout', await getData('user_data'));
  // await deleteData("states");
}

export function getState(states, id) {
  let keys = Object.keys(states);
  let state;
  keys.forEach(key => {
    let child = states[key];
    if (child.id == id) {
      state = child;
    }
  });
  return state;
}

export function parseDate(str) {
  str = str.split(' ')[0];
  var mdy = str.split('-');
  return new Date(mdy[0], mdy[1] - 1, mdy[2]);
}

export function getDateDifference(first, second) {
  // Take the difference between the dates and divide by milliseconds per day.
  // Round to nearest whole number to deal with DST.
  return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

function PrepareData(Data) {
  const formData = new FormData();
  Object.keys(Data).forEach(e => {
    formData.append(e, Data[e]);
  });
  return formData;
}

export function toFeet(n) {
  if (n == undefined || n == null) {
    return;
  }
  if (n.toString().includes('.')) {
    n = n * 100;
  }

  var realFeet = (n * 0.3937) / 12;
  var feet = Math.floor(realFeet);
  var inches = Math.round((realFeet - feet) * 12);
  return feet + 'ft ' + inches + 'in';
}

export function ParseDateTime(datetime, type='moment') {
  // convert datetime to date
  try {
    if (type == 'date-fns') {
      return format(new Date(datetime), 'MMMM d, YYYY');
    }
    else if (type='moment') {
      return moment(datetime).format('MMMM d, YYYY');
    }
    
  }
  catch(error) {
    if (type == 'date-fns') {
      return format(new Date(), 'MMMM d, YYYY');
    }
    else if (type='moment') {
      return moment(new Date().toDateString()).format('MMMM d, YYYY');
    }
    
  }
  
}

export let hours = [...Array(12).keys()];

export let minutes = [...Array(60).keys()];
