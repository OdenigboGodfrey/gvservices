import React, { Component } from "react";
import { Container, Content, Textarea, Header, Text, Item, CardItem, Card, Left, Button, Icon, Body } from "native-base";
import { getEmptorMode, Colours, getId } from "../../utils";
import { SpinnerButton } from "../../components/SpinnerButton";
import { Styles } from "./GlamBioStyle";
import { AppContext } from "./../../../AppProvider";
import { edit } from "../../api/EditAPI";
import LinearGradient from "react-native-linear-gradient";


export default class GlamBioScreen extends Component {
    static contextType = AppContext;

    constructor(props) {
        super (props);
        this.state = {
            btnClicked: false,
            
        }
    }

    componentDidMount() {
        this.set({bio: this.context.state.user_data.bio});
    }

    set = (v) => {
        this.setState(v);
    }

    onSubmitPress = async () => {
        this.setState({btnClicked: true});

        let data = {
            id: getId(),
            bio: this.state.bio,
        }

        await edit(data, this.set, this.context, this.props.navigation, this.context, {next: undefined, enforce: undefined});
        
        this.setState({btnClicked: false});
    }

    render() {
        return (
            <Container>
                <Header 
                    style={{backgroundColor: Colours.secondaryBlack}} 
                    androidStatusBarColor={Colours.secondaryBlack}
                    >
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={{textAlign: 'center', textAlignVertical: 'center', color: Colours.white, fontWeight: 'bold'}}>Bio</Text>
                    </Body>
                </Header>
                <Content contentContainerStyle={{flexGrow: 1}}>
                    <LinearGradient
                            colors={[Colours.secondaryBlack, Colours.black]}
                            style={{
                            flex: 1,
                            height: '100%',
                            paddingRight: 10,
                            paddingLeft: 10,
                        }}>
                        <Card style={[Styles.transparent]}>
                            <CardItem style={[Styles.transparent, {borderWidth: 0}]}>
                                <Item style={[Styles.item, {}]}>
                                    <Textarea 
                                        rowSpan={15}
                                        placeholder={'Enter Bio Details'}
                                        placeholderTextColor={Colours.white}
                                        style={{borderColor: Colours.white, width: '100%', color: Colours.white}}
                                        onChangeText={(text) => this.setState({bio: text})}
                                        value={this.state.bio}
                                    />
                                </Item>
                            </CardItem>
                            <SpinnerButton
                                block
                                label={"Submit"}
                                style={{backgroundColor: Colours.darkmagenta, width: '80%', alignSelf: 'center', borderRadius: 10, marginBottom: 20}}
                                onPress={this.onSubmitPress}
                                btnClicked={this.state.btnClicked}
                            />
                        </Card>
                    </LinearGradient>
                </Content>
            </Container>
        );
    }
}