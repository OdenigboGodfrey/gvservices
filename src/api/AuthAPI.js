import React from 'react';
import {
  Request,
  urls,
  setToken,
  getSubBase,
  setId,
  isEmptorMode,
  POSITIVE,
  setEmptorMode,
  setContext,
  getEmptorMode,
} from '../utils';
import {Toast} from 'native-base';
import {strings} from '../strings';
import {storeData, getData} from '../storage/MainStorage';
import {getStates} from './GetApiFactorsAPI';

export async function register(data, navigation, context) {
  let res = await Request(urls.base + getSubBase(), urls.register, data);

  if (res.status != undefined && res.status) {
    Toast.show({
      text: res.messages[0],
      type: 'success',
      buttonText: strings.genericStrings.dismiss,
    });

    await handleNavigation(res.data, navigation, context);

    return res;
  } else {
    Toast.show({
      text: res.messages[0],
      type: 'danger',
      buttonText: strings.genericStrings.dismiss,
    });
  }
}

export async function login(data, navigation, context) {
  let res = await Request(urls.base + getSubBase(), urls.login, data);
  if (res.status != undefined && res.status) {
    await handleNavigation(res.data, navigation, context);

    return res;
  } else {
    Toast.show({
      text: res.messages[0],
      type: 'danger',
      buttonText: strings.genericStrings.dismiss,
    });
  }
}

export async function changePassword(data, navigation, context) {
  let res = await Request(urls.base + getSubBase(), urls.password + urls.change, data);
  if (res.status != undefined && res.status) {
    Toast.show({
      text: res.messages[0],
      type: 'success',
      buttonText: strings.genericStrings.dismiss,
    });
    return res;
  } else {
    Toast.show({
      text: res.messages[0],
      type: 'danger',
      buttonText: strings.genericStrings.dismiss,
    });
  }
}

export async function initReset(data, navigation, context, userType) {
  let res = await Request(urls.base + getSubBase(), urls.password + urls.initReset, data);
  if (res.status != undefined && res.status) {
    
    if (data.resend == undefined) {
      navigation.navigate('Validate', {email: data.email, message: res.messages[0]});
    }
    else {
      Toast.show({
        text: 'Code resent',
        type: 'success',
        buttonText: strings.genericStrings.dismiss,
      });
    }
    
  } else {
    Toast.show({
      text: res.messages[0],
      type: 'danger',
      buttonText: strings.genericStrings.dismiss,
    });
  }
}

export async function validate(data, navigation, context) {
  let res = await Request(urls.base + getSubBase(), urls.password + urls.validate, data);
  if (res.status != undefined && res.status) {
    // Toast.show({
    //   text: res.messages[0],
    //   type: 'success',
    //   buttonText: strings.genericStrings.dismiss,
    // });
    navigation.navigate('ResetPassword', {email: data.email, message: res.messages[0]});
  } else {
    Toast.show({
      text: res.messages[0],
      type: 'danger',
      buttonText: strings.genericStrings.dismiss,
    });
  }
}

export async function reset(data, navigation, context) {
  let res = await Request(urls.base + getSubBase(), urls.password + urls.reset, data);
  if (res.status != undefined && res.status) {
    Toast.show({
      text: res.messages[0],
      type: 'success',
      buttonText: strings.genericStrings.dismiss,
    });
    navigation.navigate('Login');
  } else {
    Toast.show({
      text: res.messages[0],
      type: 'danger',
      buttonText: strings.genericStrings.dismiss,
    });
  }
}

export async function handleNavigation(
  data,
  navigation,
  context,
  isFromLocal = false,
) {
  console.log(
    'auth api',
    data.username == null && !getEmptorMode(),
    data.username,
    getEmptorMode(),
  );
  /** load neccessary info from local */
  let mode = undefined;
  setContext(context);

  setToken(data.token);
  setId(data.id);
  // save locally as 'session'
  if (!isFromLocal) {
    let statesRes = await getStates();

    await storeData('isEmptorMode', isEmptorMode);
    await storeData('user_data', data);
    if (statesRes.status != undefined && statesRes.status) {
      await storeData('states', statesRes.data);
    }
  } else {
    // set context

    /** load states info */
    let statesRes = await getData('states');
    let EmptorMode = await getData('isEmptorMode');
    if (statesRes.status == POSITIVE) {
      context.set({states: JSON.parse(statesRes.data)});
    }
    if (EmptorMode.status == POSITIVE) {
      mode = EmptorMode.data;
      setEmptorMode(EmptorMode.data);
    }
  }

  /** set context data */
  context.set({user_data: data, token: data.token});

  setTimeout(() => {
    if (data.gender == null || data.phone == null || data.birthday === null || (!getEmptorMode() && data.height == null) ) {
      navigation.navigate('PostSignupGeneral', {enforce: true, data: data});
    } else if (data.latitude == 0 || data.city_id == null|| data.my_location == null) {
      navigation.navigate('PostSignupLocation', {enforce: true, data: data});
    } else if (data.username == null && getEmptorMode() == false) {
      navigation.navigate('PostSignupUsername', {enforce: true, data: data});
    } else if (data.avatar == null) {
      navigation.navigate('PostSignupAvatar', {enforce: true, data: data});
    } else {
      navigation.navigate('Home', {isEmptorMode: mode});
    }
  }, 1500);
}
