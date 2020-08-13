import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Picker, View, Text, Input } from "native-base";
import { hours, minutes } from "./../utils";
import SegmentedPicker from 'react-native-segmented-picker';
import { TouchableOpacity } from "react-native-gesture-handler";

export default class TimePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTime: (props.time != undefined) ? props.time : '0:00 AM',
        };
        this.segmentedPicker = React.createRef();
    }

    componentDidMount() {
    }
    
    onConfirm = (selections) => {
        // console.info(selections);
        let selectedTime = selections.column1.label + ':'+ selections.column2.label + ' ' + selections.column3.label;
        this.setState({selectedTime: selectedTime});
        // => { column1: { label: 'Option 1' }, column2: { label: 'Option 3' } }
        this.props.onConfirm(selectedTime);
    }

    render() {
        return(
            <TouchableOpacity style={[Styles.backgroundView]}>
                {/* <Text onPress={() => {}}>Press</Text> */}
                <Text 
                style={{color: (this.props.style != undefined && this.props.style.textColor != undefined) ? this.props.style.textColor : '#d3d3d3'}} 
                onPress={() => this.segmentedPicker.show()}>
                    {this.state.selectedTime}
                </Text>
                {/* <Picker>
                    {
                        minutes.map(min => (<Picker.Item 
                            value={min}
                            label={min.toString()}
                        />))
                    }
                </Picker> */}
                <SegmentedPicker
                    ref={(ref) => { this.segmentedPicker = ref; }}
                    onConfirm={this.onConfirm}
                    options={{
                    column1: [{"label":"01"},
                      {"label":"02"},
                      {"label":"03"},
                      {"label":"04"},
                      {"label":"05"},
                      {"label":"06"},
                      {"label":"07"},
                      {"label":"08"},
                      {"label":"09"},
                      {"label":"10"},
                      {"label":"11"},
                      {"label":"12"},]
                    ,
                    column2: [{"label":"00"},{"label":"01"},{"label":"02"},{"label":"03"},{"label":"04"},{"label":"05"},{"label":"06"},{"label":"07"},{"label":"08"},{"label":"09"},{"label":"10"},
                      {"label":"11"},{"label":"12"},{"label":"13"},{"label":"14"},{"label":"15"},{"label":"16"},{"label":"17"},{"label":"18"},{"label":"19"},{"label":"20"},{"label":"21"},{"label":"22"},
                      {"label":"23"},{"label":"24"},{"label":"25"},{"label":"26"},{"label":"27"},{"label":"28"},{"label":"29"},{"label":"30"},{"label":"31"},{"label":"32"},{"label":"33"},{"label":"34"},
                      {"label":"35"},
                      {"label":"36"},
                      {"label":"37"},
                      {"label":"38"},
                      {"label":"39"},
                      {"label":"40"},
                      {"label":"41"},
                      {"label":"42"},
                      {"label":"43"},
                      {"label":"44"},
                      {"label":"45"},
                      {"label":"46"},
                      {"label":"47"},
                      {"label":"48"},
                      {"label":"49"},
                      {"label":"50"},
                      {"label":"51"},
                      {"label":"52"},
                      {"label":"53"},
                      {"label":"54"},
                      {"label":"55"},
                      {"label":"56"},
                      {"label":"57"},
                      {"label":"58"},
                      {"label":"59"},],
                    column3: [{label: 'AM'}, {label: 'PM'}],
                    }}
                />
            </TouchableOpacity>
        );
    }

    
}

const Styles = StyleSheet.create({
    backgroundView: {
        justifyContent: 'center'
    }
})