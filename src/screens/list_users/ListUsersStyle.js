import {StyleSheet} from 'react-native';
import {Colours} from '../../utils';

export const Styles = StyleSheet.create({
  iconStyle: {
    fontSize: 18,
    marginTop: 2,
    color: Colours.white,
  },
  textStyle: {
    marginLeft: 5,
    marginRight: 5,
    color: Colours.white,
  },
  bodyView: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 20,
    borderRadius: 5,
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  userImage: {
    height: 90,
    width: 90,
    resizeMode: 'stretch',
    marginTop: 2,
  },
});
