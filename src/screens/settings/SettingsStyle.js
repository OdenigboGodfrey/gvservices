import { Colours } from "../../utils";
import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
    colorWhite: {
        color: Colours.white,
    },
    listItem: {
        backgroundColor: "#50505f", 
        padding: 10, 
        borderBottomWidth: 0, 
        borderRadius: 5,
        marginBottom: 10,
    },
    left: {
        flex: 0.1
    },
    body: {
        alignItems: 'flex-start', 
        flex: 0.6,
    },
    right: {
        flex: 0.3
    }
});