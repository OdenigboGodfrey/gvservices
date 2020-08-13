import { StyleSheet } from "react-native";
import { Colours } from "../../utils";

export const Styles = StyleSheet.create({
    topTextTotal: { 
        fontSize: 24,
        color: Colours.white, 
        marginBottom: 7
    },
    topTextList: {
        color: Colours.white, 
        fontSize: 18,
        marginBottom: 5
    },
    newGigText: {
        fontSize: 18, 
        color: 'white', 
        fontWeight: 'bold'
    },
    round: {
        borderRadius: 10, 
        backgroundColor: 'white',
    },
    selectServiceBtn: {
        flex: 1.3, 
        marginLeft: 5, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: Colours.gray
    },
    selectServiceText: {
        alignSelf: 'center', 
        color: Colours.white, 
        textAlignVertical: 'center'
    },
    inputSideTextLeft: {
        alignSelf: 'center', 
        backgroundColor: Colours.darkmagenta, 
        height: '70%', 
        width: 30, 
        textAlign: 'center', 
        textAlignVertical: 'center', 
        fontWeight: 'bold', 
        fontSize: 20, 
        color: 'white',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
    },
    glamFeeInput: {
        alignSelf: 'center', 
        borderRadius: 5, 
        borderColor: Colours.white, 
        borderWidth: 1, 
        borderTopLeftRadius: 0, 
        borderBottomLeftRadius: 0,
        height: '70%',
        padding: 10,
        fontSize: 15,
        backgroundColor: Colours.white
    },
    glamNoInput: {
        alignSelf: 'center', 
        borderRadius: 5, 
        backgroundColor: Colours.white,
        borderColor: Colours.white, 
        borderWidth: 1, 
        marginLeft: 3, 
        flex: 1, 
        height: '70%',
        padding: 10,
        fontSize: 15
    },
    inputSideTextRight: {
        alignSelf: 'center', 
        backgroundColor: Colours.black, 
        height: '70%', 
        width: 30, 
        textAlign: 'center', 
        textAlignVertical: 'center', 
        fontWeight: 'bold', 
        fontSize: 20, 
        color: 'white', 
        flex: 1.5
    },
    rowView: {
        flexDirection: 'row'
    },
    backgroundWhite: {
        backgroundColor: Colours.white
    }

    //not used
    ,selectServiceView: {
        flexDirection: 'row',  
        alignSelf: 'stretch', 
        marginBottom: 10,
        width: '99%',
        marginTop: 10,
        
    },
    serviceText: {
        alignSelf: 'stretch', 
        textAlign: 'center', 
        color: 'white'
    },
    
    noOfDaysText: {
        marginLeft: 5, 
        alignSelf: 'center', 
        fontWeight: 'bold', 
        marginRight: 10
    },
    noOfDaysInput: {
        borderRadius: 5, 
        borderColor: Colours.gray, 
        borderWidth: 2, 
        width: '55%', 
        textAlign: 'center', 
        alignSelf: 'center', 
        height: 30, 
        fontSize: 14, 
        padding: 0,
        marginRight: 5
    },
    dailyDuration: {
        width: 40, 
        height: 35, 
        borderColor: Colours.gray, 
        borderWidth: 2, 
        borderRadius: 5, 
        fontSize: 14, 
        padding: 0
    },
    

});