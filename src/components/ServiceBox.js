import React ,{ Component  } from "react";
import { ImageBackground, StyleSheet, TouchableOpacity} from "react-native";
import { Container, Content, Text, View, Icon } from "native-base";
import {  Colours } from "../utils";

export default class ImageBox extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        iconVisible: false
    }

    onReset = () => {
        this.setState({iconVisible: false});
    }

    // () => {
    //     this.props.onPress();
    //     this.setState({iconVisible: !this.state.iconVisible})}

    render() {
        return(
            <TouchableOpacity 
                onPress={() => {
                    this.setState({iconVisible: !this.state.iconVisible});
                    this.props.parentCallback(this.props.id);
                }}
            style={[Styles.backgroundView]} >
                <Text style={[Styles.serviceText]}>{this.props.serviceType}</Text>
                {
                    this.state.iconVisible && 
                    <Icon name='checkmark' color={Colours.green} style={[Styles.checkmarkIcon]} />
                }
                
            </TouchableOpacity>
            
        );
    }
}

const Styles = StyleSheet.create({
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