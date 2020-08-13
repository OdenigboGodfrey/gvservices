import {
  Request,
  urls,
  getEmptorMode,
  toastDuration,
  GetRequest,
  setContext,
  getSubBase,
} from '../utils';
import {Toast} from 'native-base';
import {strings} from '../strings';
import {resData} from './d';

let retryCounter = 0;

export async function deposit(data, set = undefined, context = undefined) {
  let res = await Request(
    urls.base + getSubBase(),
    urls.wallet + urls.deposit,
    data,
  );
  if (res.status != undefined && res.status) {
    Toast.show({
      text: res.messages[0],
      type: 'success',
      buttonText: strings.genericStrings.dismiss,
    });
    return res.data;
  } else {
    Toast.show({
      text: res.messages[0],
      type: 'danger',
      buttonText: strings.genericStrings.dismiss,
    });
  }
}

export async function get_my_wallet(set = undefined, context = undefined) {
  let res = await GetRequest(
    urls.base + getSubBase(),
    urls.wallet
  );
  if (res.status != undefined && res.status) {
    if (set != undefined) {
      set({
        balance: res.data.wallet.balance,
        transactionHistory: res.data.wallet.transaction_history.reverse(),
      })
    }
    return res.data;
  } else {
    Toast.show({
      text: res.messages[0],
      type: 'danger',
      buttonText: strings.genericStrings.dismiss,
    });
  }
}

export async function payInterest(
  data,
  navigation,
  get = undefined,
  set = undefined,
  context = undefined,
) {
  let res = await Request(
    urls.base,
    urls.emptor  + urls.wallet + urls.pay + urls.interest,
    data,
  );
  if (res.status != undefined && res.status) {
    Toast.show({
      text: res.messages[0],
      type: 'success',
      buttonText: strings.genericStrings.dismiss,
    });
    if (get != undefined) {
      let users = get().users;
      users[users.indexOf(get().user)].payment_approved = true;
      set({users: users});
    }
  } else {
    Toast.show({
      text: res.messages[0],
      type: 'danger',
      buttonText: strings.genericStrings.dismiss,
    });
  }
}

export async function payBooking(
  data,
  navigation,
  set = undefined,
  context = undefined,
) {
  let res = await Request(
    urls.base,
    urls.emptor  + urls.wallet + urls.pay + urls.booking,
    data,
  );
  if (res.status != undefined && res.status) {
    Toast.show({
      text: res.messages[0],
      type: 'success',
      buttonText: strings.genericStrings.dismiss,
    });
  } else {
    Toast.show({
      text: res.messages[0],
      type: 'danger',
      buttonText: strings.genericStrings.dismiss,
    });
  }
}

/*** not used */
export async function getBanks_Paystack(set, context) {
  // let res = await GetRequest(urls.paystack, urls.paystackBank);
  let res = resData;
  if (res.status != undefined && res.status) {
    set({
      banks: res.data,
    });
  } else {
    Toast.show({
      text: res.messages[0],
      type: 'danger',
      buttonText: strings.genericStrings.dismiss,
    });
  }
}


export async function init_Paystack(
  data,
  navigation,
  set = undefined,
  context = undefined,
  currency = undefined,
) {
  data.amount = 1000 * 100;

  data = JSON.stringify(data);
  let res = await Request(urls.paystack, urls.charge, data, true);
  data = JSON.parse(data);
  if (res.status != undefined && res.status) {
    return await handleTransset(
      res,
      navigation,
      set,
      context,
      true,
      data.amount / 100,
    );
  } else {
    Toast.show({
      text:
        res.message != undefined
          ? res.message
          : strings.errorMessages.errorOccured,
      type: 'danger',
      buttonText: strings.genericStrings.dismiss,
    });
  }
}

async function handleTransset(
  res,
  navigation,
  set,
  context,
  fromCharge = false,
  amount = undefined,
) {
  if (res.data.status != 'success') {
    makePaystackStatusCheck(
      res,
      navigation,
      set,
      context,
      fromCharge,
      amount,
    );
  } else {
    /*** send amount to API */
    await deposit(
      {
        amount: res.data.amount / 100,
        reference_id: res.data.reference,
      },
      set,
      context,
    );
    return res.data;
  }
}

function makePaystackStatusCheck(
  res,
  navigation,
  set = undefined,
  context = undefined,
  fromCharge = false,
  amount = undefined,
) {
  let data = {
    type: '',
    displayText: res.data.display_text,
    reference: res.data.reference,
    amount: amount / 100,
  };

  if (context != undefined) {
    context.set({reference_id: res.data.reference});
  }

  switch (res.data.status) {
    case 'pending':
      Toast.show({
        text: 'An error occurred, retrying in 60 secs.',
        type: 'warning',
        buttonText: strings.genericStrings.dismiss,
        duration: toastDuration,
      });
      if (retryCounter < 2) {
        setTimeout(() => {
          checkPending_Paystack(res.data, set, context);
        }, 60000);
        retryCounter++;
      } else {
        retryCounter = 0;
        Toast.show({
          text: 'Payement Failed.',
          type: 'danger',
          buttonText: strings.genericStrings.dismiss,
          duration: toastDuration,
        });
      }
      break;
    case 'timeout':
      Toast.show({
        text:
          res.message != undefined
            ? res.message
            : strings.errorMessages.errorOccured,
        type: 'danger',
        buttonText: strings.genericStrings.dismiss,
      });
      break;
    case 'send_pin':
      data.type = 'send_pin';
      if (fromCharge) {
        navigation.navigate('PaystackRequest', data);
      } else {
        navigation.setParams(data);
        return data;
      }

      break;
    case 'send_phone':
      data.type = 'send_phone';

      if (fromCharge) {
        navigation.navigate('PaystackRequest', data);
      } else {
        navigation.setParams(data);
        return data;
      }

      break;
    case 'send_birthday':
      data.type = 'send_birthday';

      if (fromCharge) {
        navigation.navigate('PaystackRequest', data);
      } else {
        navigation.setParams(data);
        return data;
      }

      break;
    case 'send_otp':
      data.type = 'send_otp';

      if (fromCharge) {
        navigation.navigate('PaystackRequest', data);
      } else {
        navigation.setParams(data);
        return data;
      }

      break;
    default:
      Toast.show({
        text:
          res.message != undefined
            ? res.message
            : strings.errorMessages.errorOccured,
        type: 'danger',
        buttonText: strings.genericStrings.dismiss,
      });
      break;
  }
}

export async function checkPending_Paystack(
  reference,
  navigation,
  set = undefined,
  context = undefined,
) {
  let res = await GetRequest(urls.paystack, urls.charge + '/' + reference);
  if (res.status != undefined && res.status) {
    return await handleTransset(res, navigation, set, context, true);
  } else {
    Toast.show({
      text: res.messages[0],
      type: 'danger',
      buttonText: strings.genericStrings.dismiss,
    });
  }
}

export async function submitPin_Paystack(
  data,
  navigation,
  set = undefined,
  context = undefined,
) {
  data = JSON.stringify(data);
  let res = await Request(
    urls.paystack,
    urls.charge + urls.submitPin,
    data,
    true,
  );
  if (res.status != undefined && res.status) {
    return await handleTransset(res, navigation, set, context);
  } else {
    Toast.show({
      text: res.messages[0],
      type: 'danger',
      buttonText: strings.genericStrings.dismiss,
    });
  }
}

export async function submitPhone_Paystack(
  data,
  navigation,
  set = undefined,
  context = undefined,
) {
  data = JSON.stringify(data);
  let res = await Request(
    urls.paystack,
    urls.charge + urls.submitPhone,
    data,
    true,
  );
  if (res.status != undefined && res.status) {
    return await handleTransset(res, navigation, set, context);
  } else {
    Toast.show({
      text: res.messages[0],
      type: 'danger',
      buttonText: strings.genericStrings.dismiss,
    });
  }
}

export async function submitBirthday_Paystack(
  data,
  navigation,
  set = undefined,
  context = undefined,
) {
  data = JSON.stringify(data);
  let res = await Request(
    urls.paystack,
    urls.charge + urls.submitBirthday,
    data,
    true,
  );
  if (res.status != undefined && res.status) {
    return await handleTransset(res, navigation, set, context);
  } else {
    Toast.show({
      text: res.messages[0],
      type: 'danger',
      buttonText: strings.genericStrings.dismiss,
    });
  }
}

export async function submitOTP_Paystack(
  data,
  navigation,
  set = undefined,
  context = undefined,
) {
  data = JSON.stringify(data);
  let res = await Request(
    urls.paystack,
    urls.charge + urls.submitOTP,
    data,
    true,
  );
  if (res.status != undefined && res.status) {
    return await handleTransset(res, navigation, set, context);
  } else {
    Toast.show({
      text: res.messages[0],
      type: 'danger',
      buttonText: strings.genericStrings.dismiss,
    });
  }
}

