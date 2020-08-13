import React ,{ Component  } from "react";
import { ImageBackground, StyleSheet, TouchableOpacity, TouchableHighlight } from "react-native";
import { Container, Content, Text, View } from "native-base";
import { Colours } from "../utils";

export default class ImageBox extends Component {
    constructor(props) {
        super(props);
    }

    state = {}
    onBoxPress() {

    }

    render() {
        return(
            <TouchableHighlight style={[Styles.backgroundView]} onPress={() => {
                this.props.onPress();
                // console.log(JSON.stringify(this.props))?
                // this.props.navigation.navigate('Login');
                this.props.parentCallback('sent back');
                }} >
                <ImageBackground
                source={this.props.source} style={[Styles.backgroundImage]}
                imageStyle={{ borderRadius: 7 }}
                >
                    <View style={[Styles.containingView]}>
                        <View style={[{flex: 0.5, width: '100%', position: 'absolute'}]}>
                            <View style={[Styles.shadeView]}></View>
                            <View style={[Styles.transparent, {flex: 0.5, width: '100%', position: 'relative', zIndex: 2}]}>
                                <View style={[{flexDirection: 'row'}]}>
                                    <Text style={[Styles.glamNameText]}>{this.props.glamName}</Text>
                                    <Text style={[Styles.glamAgeText]}>{this.props.glamAge}</Text>
                                </View>
                                <Text style={[Styles.glamStateText]}>{this.props.glamState}</Text>
                                
                            </View>
                        </View>
                        

                    </View>
                </ImageBackground>
            </TouchableHighlight>
            
        );
    }
}

const marginValue = 7;
const Styles = StyleSheet.create({
containingView: {
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,  
        alignItems: 'center', 
        // padding: 20
        justifyContent: 'flex-end'
    },
backgroundImage: {
        alignSelf: 'stretch',
        flex: 1,
        paddingRight: 0,
        marginLeft: 0,
        flexDirection: 'row',
        width: 150,
        height: 150,
        resizeMode: 'contain',
        borderRadius: 50,

    },
transparent: {
    backgroundColor: 'transparent'
},
backgroundView: {
    width: 150,
    height: 150,
    marginLeft: 5,
    marginBottom: 5,
    borderRadius: 100,
    },
glamNameText: {
    margin: marginValue,
    textAlign: 'left',
    fontWeight: 'bold',
    color: Colours.white
    },
glamAgeText: {
    marginTop: marginValue + 2,
    textAlign: 'left',
    fontWeight: '300',
    fontSize: 14,
    color: Colours.white
    },
glamStateText: {
    marginLeft: marginValue,
    marginBottom: 5,
    color: Colours.white,
    fontSize: 14
    },
shadeView: { 
    flex: 1, 
    flexDirection: 'row', 
    position:'absolute', 
    width: '100%', 
    backgroundColor: Colours.black,  
    zIndex: 1, 
    alignSelf: 'stretch', 
    height: 50, 
    opacity: 0.2
    }
});