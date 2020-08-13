import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
    image: {
        width: 120, 
        height: 120, 
        resizeMode: 'contain', 
        marginLeft: 2, 
        borderRadius: 5
    },
    imageBackgroundView: {
        flex: 1, 
        width: '100%', 
        height: '100%', 
        flexDirection: 'row', 
        flexWrap: 'wrap',
        marginTop:10,
    }
});