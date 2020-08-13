import { StyleSheet } from "react-native";
import { Colours } from "../../utils";

export const Styles = StyleSheet.create({
    spinner: {
        height: 30, 
        width: 30,
        color: Colours.white
    },
    spinnerButton: {
        width: '80%', 
        marginTop: 10, 
        alignSelf: 'center'
    }
});