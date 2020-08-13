import { StyleSheet } from "react-native";
import { Colours } from "../../utils";

export const Styles = StyleSheet.create({
    item: {
        marginBottom:10,
    },
    input: {
        borderWidth: 1, 
        borderColor: Colours.gray,  
        borderRadius: 10,
        paddingLeft: 20,
        height: 50
    },
});