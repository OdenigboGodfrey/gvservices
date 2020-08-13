import AsyncStorage from '@react-native-community/async-storage';
import { POSITIVE, NEUTRAL, NEGATIVE } from '../utils';

function result(status, message='', extra={}) {
    return {status: status, message: message, data: extra};
}
export const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return result(NEUTRAL);
    } catch (e) {
      // saving error
      console.warn("Storage Error", e)
      return result(NEGATIVE, e);
    }
}

export const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key)
      if(value !== null) {
        // value previously stored
        return result(POSITIVE, '', value);
      }
      else {
        return result(NEUTRAL, '', value);
      }
    } catch(e) {
      // error reading value
      console.warn("Storage Error", e)
      return result(NEGATIVE, e);
    }
}

export const updateData = async(key, value) => {
    try {
        await AsyncStorage.removeItem(key);
        let res = await storeData(key, value);
        return res;
    }
    catch(e) {
        return result(NEGATIVE, e);
    }
}

export const deleteData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return result(POSITIVE, e);
  }
  catch(e) {
    return result(NEGATIVE, e);
  }
}

export const getAllKeys = async () => {
  let keys = []
  try {
    keys = await AsyncStorage.getAllKeys();
    return result(POSITIVE, '', keys);
  } catch(e) {
    // read key error
    return result(NEGATIVE, e);
  }
}
