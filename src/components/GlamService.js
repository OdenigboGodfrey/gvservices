import React ,{ Component  } from "react";
import { ImageBackground, StyleSheet, TouchableOpacity, TouchableHighlight } from "react-native";
import { Container, Content, Text, View, Icon, Button } from "native-base";
import { Colours, getCurrency, getEmptorMode } from "../utils";
import { ScrollView } from "react-native-gesture-handler";
import { deleteGlamRate, deleteGlamRatesByCategory } from "../api/GlamRatesAPI";
import { ProgressDialog, ConfirmDialog } from "react-native-simple-dialogs";
import { strings as AppStrings } from "./../strings";

const { genericStrings } = AppStrings;


export default class GlamService extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            progressVisible: false,
            categoryRate: undefined,
            categoryId: undefined,
            type: undefined,
            title: '',
        }
    }

    set = (v) => {
        this.setState(v);
    }

    deleteService = async (categoryRate) => {
        this.setState({dialogVisible: false, progressVisible: true});
        
        let res = await deleteGlamRate({
            category_rate_id: categoryRate.id,
            category_id: categoryRate.category_id,
        }, this.set, this.context);
        
        this.setState({progressVisible: false});

        if (res != undefined) {
            this.props.updateServices({id: categoryRate.id, isCategory: false, service: categoryRate});
        }
    }

    deleteServiceByCategory = async (categoryId) => {
        this.setState({dialogVisible: false, progressVisible: true});
        
        let res = await deleteGlamRatesByCategory({
            category_id: categoryId,
        },this.set, this.context);
        
        this.setState({progressVisible: false});

        if (res != undefined) {
            this.props.updateServices({id: categoryId, isCategory: true, service: undefined});
        }
    }

    renderPricingBox(pricingData) {
        if (pricingData.length == 0) {
            return (
                <View style={{width: '100%', height: 250, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color: Colours.darkmagenta, textAlign: 'center', textAlignVertical: 'center'}}>{genericStrings.nothingToShow}</Text>
                </View>
            );
          }
        return pricingData.map(item => {
            let textElement = (
                <Text style={[{fontSize: 12, textTransform: 'capitalize'}]}>{item.title}</Text>
            );

            let viewElement = (
                <View style={[{backgroundColor: Colours.black, paddingLeft: 30, paddingRight: 30, paddingTop: 5, paddingBottom: 5, borderRadius: 20}]}>
                    <Text style={[{color: Colours.white, textAlign: 'center', alignSelf: 'stretch'}]}>{getCurrency() + ' ' + item.amount}</Text>
                    {
                        !getEmptorMode() &&
                        <TouchableOpacity 
                            style={{position: 'absolute', height: 20, width: 20, alignSelf: 'flex-end', zIndex: 2, top: 5,right:1}}
                            onPress={() => this.setState({categoryRate: item, type: 'categoryRate', title: item.title, dialogVisible: true})}
                        >
                            <Icon name={'ios-trash'} style={{fontSize: 24, color: 'red', fontWeight: 'bold'}} />
                        </TouchableOpacity>
                    }
                </View>
            );

            let baseElement = getEmptorMode() ? 
                (
                    <TouchableOpacity 
                    key={item.id} 
                    style={[{marginRight: 3, marginLeft: 3, borderRadius: 20}]} 
                    onPress={() => {
                        if (getEmptorMode()) {
                            this.props.parentCallback({...item, glamServiceTitle: this.props.glamServiceTitle, id: this.state.id})
                        }
                    }}
                >
                    {textElement}
                    {viewElement}
                </TouchableOpacity>
                )
            :
                (
                    <View 
                    key={item.id} 
                    style={[{marginRight: 3, marginLeft: 3, borderRadius: 20}]} 
                >
                    {textElement}
                    {viewElement}
                </View>
                )
            
            return baseElement;
        });
    }

    render() {
        return(
            <View key={this.props.id} style={[{borderRadius: 20, backgroundColor: Colours.white, width: '100%', padding: 10, marginBottom: 5}]}>
                <Text style={[{color: Colours.green, marginBottom: 5, fontSize: 18, fontWeight: 'bold'}]}>{this.props.glamServiceTitle}</Text>
                {
                    !getEmptorMode() &&
                    <TouchableOpacity 
                        style={{position: 'absolute', height: 20, width: 20, alignSelf: 'flex-end', zIndex: 2, top: 5,right:1}}
                        onPress={() => {this.setState({categoryId: this.props.id, type: 'categoryId', title: this.props.glamServiceTitle, dialogVisible: true}); }}
                    >
                        <Icon name={'ios-trash'} style={{fontSize: 24, color: 'red', fontWeight: 'bold'}} />
                    </TouchableOpacity>
                }
                <ScrollView horizontal style={{padding: 5}}>
                    <View style={[{flexDirection: 'row'}]}>
                        {
                            this.renderPricingBox(this.props.glamServicePrices)
                        }
                    </View>
                    
                </ScrollView>
                <ProgressDialog
                    visible={this.state.progressVisible}
                    title=""
                    message="Please, wait..."
                />
                <ConfirmDialog
                    title="Confirm Delete"
                    message={"Are you sure you want to delete '" + this.state.title +"'?"}
                    visible={this.state.dialogVisible}
                    onTouchOutside={() => this.setState({ dialogVisible: false })}
                    positiveButton={{
                        title: "Yes",
                        onPress: () => {
                            if (this.state.type == 'categoryRate') {
                                this.deleteService(this.state.categoryRate);
                            }
                            else if (this.state.type == 'categoryId') {
                                this.deleteServiceByCategory(this.state.categoryId);
                            }
                        }
                    }}
                    negativeButton={{
                        title: "No",
                        onPress: () => this.setState({ dialogVisible: false })
                    }}
                />
            </View>
        );
    }
}

const Style = StyleSheet.create({

});