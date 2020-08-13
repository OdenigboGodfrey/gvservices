import {Request, urls, getEmptorMode} from '../utils';
import {Toast} from 'native-base';
import {strings} from '../strings';

export async function saveRating(
  data,
  get = undefined,
  set = undefined,
  context = undefined,
) {
  console.log('ratingapi', data);
  let res = await Request(urls.base, urls.rating + urls.save, data);
  if (res.status != undefined && res.status) {
    Toast.show({
      text: res.messages[0],
      type: 'success',
      buttonText: strings.genericStrings.dismiss,
    });

    let users = get().users;
    users[users.indexOf(get().user)].rated = true;
    set({users: users});

    return res.data;
  } else {
    Toast.show({
      text: res.messages[0],
      type: 'danger',
      buttonText: strings.genericStrings.dismiss,
    });
  }
}
