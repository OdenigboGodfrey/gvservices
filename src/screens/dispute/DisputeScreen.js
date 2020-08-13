import React, { Component } from "react";
import { Container, Content, Textarea, Header, Text, Item, CardItem, Card, Left, Button, Icon, Body } from "native-base";
import { getEmptorMode, Colours } from "../../utils";
import { SpinnerButton } from "../../components/SpinnerButton";
import { Styles } from "./DisputeStyle";
import { openDispute } from "../../api/DisputeAPI";
import { AppContext } from "./../../../AppProvider";


export default class DisputeScreen extends Component {
    static contextType = AppContext;

    constructor(props) {
        super (props);
        this.state = {
            glamId: props.navigation.getParam('glamId', 0),
            emptorId: props.navigation.getParam('emptorId', 0),
            origin: props.navigation.getParam('origin', 0),
            bookingId: props.navigation.getParam('bookingId', 0),
            gigId: props.navigation.getParam('gig_id', 0),
            btnClicked: false,
            message: '',
        }
    }

    state = {
        btnClicked: false
    }

    set = (v) => {
        this.setState(v);
    }

    onSubmitPress = async () => {
        this.setState({btnClicked: true});

        let data = {
            initiator: (getEmptorMode()) ? 'emptor': 'glam',
            glam_id: this.state.glamId,
            emptor_id: this.state.emptorId,
            message: this.state.message,
            origin: this.state.origin,
        }

        if (this.state.origin == 'gig') {
            data.gig_id = this.state.gigId;
        }
        else if (this.state.origin == 'booking') {
            data.booking_id = this.state.bookingId;
        }

        await openDispute(data, this.set, this.context, this.props.navigation);
        
        this.setState({btnClicked: false});
    }

    render() {
        return (
            <Container>
                <Header style={{backgroundColor: Colours.darkmagenta, marginBottom: 10}} androidStatusBarColor={Colours.darkmagenta}>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={{textAlign: 'center', textAlignVertical: 'center', color: Colours.white}}>Open Dispute</Text>
                    </Body>
                </Header>
                <Content>
                    <Card>
                        <CardItem style={{borderWidth: 0, borderColor: 'white'}}>
                            <Item style={[Styles.item, {borderColor: 'white'}]}>
                                <Textarea 
                                    rowSpan={15}
                                    placeholder={'Explain Dispute'}
                                    style={{borderColor: Colours.white}}
                                    onChangeText={(text) => this.setState({message: text})}
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
                </Content>
            </Container>
        );
    }
}