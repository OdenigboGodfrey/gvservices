import { StyleSheet } from "react-native";
import { Colours } from "../../utils";

export const Styles = StyleSheet.create({
    serviceView: { 
        flex: 1,
        flexDirection: 'row', 
        alignItems: 'flex-start', 
        flexWrap: 'wrap', 
        width: '100%'
    },
    locationView: {
        flexDirection: 'row', 
        flex: 1, 
        alignSelf: 'stretch', 
        borderBottomColor: Colours.gray, 
        borderBottomWidth: 1, 
        padding: 5 
    },
    titleViewLeft: {
        flexDirection: 'row', 
        alignSelf: 'flex-start', 
        alignItems: 'center', 
        flex: 1
    },
    titleViewRight: {
        flexDirection: 'row', 
        alignSelf: 'flex-end', 
        alignItems: 'center', 
        flex: 1, 
        justifyContent: 'flex-end'
    },
    iconLeft: {
        color: Colours.gray, 
        marginRight: 10
    },
    iconRight: {
        color: Colours.gray, 
        marginLeft: 10
    },
    textRight: {
        textAlign: 'center', 
        justifyContent: 'center'
    },
    textLeft: {
        textAlign: 'center', 
        justifyContent: 'center'
    },
    genderText: {
        fontSize: 18,
        textTransform: 'capitalize',
        textAlign: 'center',
    },
    genderButton: {
        padding: 2,
        borderRadius: 20,
        borderColor: Colours.darkmagenta,
        borderWidth: 2, 
        flex: 1, 
        marginLeft: 4,

    },
    genderView: {
        borderBottomColor: Colours.gray, 
        borderBottomWidth: 1, 
        padding: 15, 
        justifyContent: 'center', 
        alignSelf: 'stretch', 
        justifyContent: 'space-evenly'
    },
    borderBottom: {
        borderBottomColor: Colours.gray, 
        borderBottomWidth: 1,
        alignSelf: 'stretch', 
        padding: 15
    },
    transparent: {
        backgroundColor: 'transparent'
    },
    backgroundView: {
        padding: 1, 
        borderRadius: 20, 
        borderColor: Colours.green, 
        borderWidth: 2, 
        flexDirection: 'row', 
        margin: 3,
        
    },
    checkmarkIcon: {
        alignSelf: 'flex-end', 
        marginRight: 2,
        marginLeft: 2, 
        color: Colours.green, 
        fontSize: 18
    },
    serviceText: {
        alignSelf: 'center', 
        marginLeft: 3,
        paddingRight: 3,
        paddingLeft: 2
    }
});