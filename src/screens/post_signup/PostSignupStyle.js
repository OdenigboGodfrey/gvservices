import { StyleSheet } from "react-native";
import { Colours } from "../../utils";

export const Styles = StyleSheet.create({
    inputText: {
        borderWidth: 1, 
        borderRadius: 5,
        marginBottom: 10,
        borderColor: Colours.gray
    },
    heightInput: {
        borderRightWidth: 0, 
        marginRight: 0, 
        borderTopRightRadius: 0, 
        borderBottomRightRadius: 0
    },
    heightText: {
        textAlign: 'center', 
        textAlignVertical: 'center', 
        borderLeftWidth:0, 
        marginLeft: 0, 
        borderTopLeftRadius: 0, 
        borderBottomLeftRadius: 0, 
        paddingRight: 10
    },
});