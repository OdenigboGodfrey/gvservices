import { StyleSheet, Dimensions } from "react-native"
import { Colours } from "./../../utils";


let ScreenHeight = Dimensions.get("window").height - 22;
export const Styles = StyleSheet.create({
topImage:{
    height: 150,
    width: 150,
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    resizeMode: 'contain'
    },
welcomeText: {
        flex: 1,
        fontSize: 24,
        alignSelf: 'stretch',
        textAlign: 'center',
        color: Colours.white
    },
loginText: {
        flex: 1,
        fontSize: 16,
        color: Colours.white
    },
forgotPasswordText: {
        flex: 1,
        alignSelf: 'stretch',
        textAlign: 'right',
        color: Colours.white, 
        marginTop: 5
    },
backgroundView: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0,  
    alignItems: 'center', 
    padding: 20
    },
backgroundImage: {
    alignSelf: 'stretch',
    flex: 1,
    paddingRight: 0,
    marginLeft: 0,
    height: ScreenHeight,
    flexDirection: 'row',
    width: '100%',
    resizeMode: 'contain'
    },
inputItem: {
    marginTop: 30
    },
whiteText: {
    color: Colours.white
},
speechBodyButton: {
    backgroundColor: 'white', 
    borderRadius: 10, 
    width: 150, 
    flexDirection: 'row', 
    padding: 7,
    justifyContent: 'space-evenly'
},
speechBodyText: {
    textAlignVertical: 'center'
},
starActive: {
    color: Colours.primaryTextColor, 
    fontSize:24
},
starInactive: { 
    fontSize:24, 
    color: Colours.gray
},
trueImage: {
    width: 70, 
    height: 70, 
    marginRight: 5
},
introView: {
    width: '100%', 
    height: '100%', 
    backgroundColor: Colours.gray, 
    paddingTop: 5, 
    paddingLeft: 5,
    marginBottom: 10
},
aboutMeView: {
    backgroundColor: 'white', 
    borderRadius: 10, 
    height: '80%', 
    padding: 5
},
backgroundGlamImage: {
    flex: 1, 
    height: '100%',
    width: '100%', 
},
userNameText: {
    fontSize: 26, 
    fontWeight: '500', 
    textTransform: 'capitalize'
},
fullNameText: {
    fontSize: 16,
},
bookingCompleteText: {
    fontWeight: 'bold', 
    fontSize: 24
}
})
