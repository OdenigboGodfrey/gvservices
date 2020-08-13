import { StyleSheet } from "react-native";
import { Colours } from "../../utils";

export const Styles = StyleSheet.create({
    listItemBorderBottom: {
        borderBottomWidth: 1,
    },
    listItem: {
        backgroundColor: "#50505f", 
        padding: 10, 
        borderBottomWidth: 0, 
        borderRadius: 5,
        marginBottom: 10,
    },
    colorWhite: {
        color: Colours.white,
    },
});