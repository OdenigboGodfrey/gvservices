import { StyleSheet } from "react-native";
import { Colours } from "../../utils";

export const Styles = StyleSheet.create({
    iconStyle:{
        fontSize: 17,
        marginTop: 2, 
        color: Colours.white
    },
    textStyle: {
        marginLeft: 5, 
        marginRight: 5, 
        color: Colours.white,
        textAlignVertical: 'center',
        fontSize: 14
    },
    floatingView: {
        flexDirection: 'row', 
        marginRight: 5
    },
    mainView: {
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'space-around', 
        padding: 5, 
        alignItems: 'flex-start'
    },
    textArea: {
        color: Colours.white,
    },
    seperator: {
        maxHeight: 20, 
        backgroundColor: Colours.secondaryBlack, 
        height: 20,
    }
});