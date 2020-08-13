import { Request, urls } from "../utils";
import { Toast } from "native-base";
import { strings } from "../strings";

export async function sendOffer(data, action=undefined, context=undefined) {
    
    let res = await Request(urls.base + urls.glam,  urls.offer + urls.send, data);
    if (res.status != undefined && res.status) {
        Toast.show({
            text: (res.messages[0]),
            type: 'success',
            buttonText: strings.genericStrings.dismiss
        });
        return res.data;
    }
    else {
        Toast.show({
            text: (res.messages[0]),
            type: 'danger',
            buttonText: strings.genericStrings.dismiss
        });
    }
}

export async function getOffers(data, action, context) {
    
    let res = await Request(urls.base + urls.glam,  urls.offer + urls.get, data);
    if (res.status != undefined && res.status) {
        if (action != undefined) {
            action({
                offers: res.data.offers
            });
        }

        if (res.data.offers.length == 0) {
            Toast.show({
                text: (res.messages[0]),
                buttonText: strings.genericStrings.dismiss
            });
        }
        /*** update badges only for un-accepted offers */
        if (data.accepted == -1) {
            let badges = (context.state.badges != undefined) ? context.state.badges : {badges: {offers: 0}};
            badges.offers = res.data.offers.length;
            
            context.set({...context.state, ...{badges: badges}});
        }
        return res.data;
    }
    else {
        Toast.show({
            text: (res.messages[0]),
            type: 'warning',
            buttonText: strings.genericStrings.dismiss
        });
    }
}

export async function actionOnOffers(data, action, context) {
    let res = await Request(urls.base + urls.glam,  urls.offer + urls.action, data);
    if (res.status != undefined && res.status) {
        /** update badges */
        context.state.badges.offers--;
        context.set({...context.state.badges});

        Toast.show({
            text: (res.messages[0]),
            type: 'success',
            buttonText: strings.genericStrings.dismiss
        });
        
        return res.data;
    }
    else {
        Toast.show({
            text: (res.messages[0]),
            type: 'danger',
            buttonText: strings.genericStrings.dismiss
        });
    }
}

export async function counterOfferAmount(data, action, context) {
    let res = await Request(urls.base + urls.glam,  urls.offer + urls.counterAmount, data);
    if (res.status != undefined && res.status) {
        Toast.show({
            text: (res.messages[0]),
            type: 'success',
            buttonText: strings.genericStrings.dismiss
        });
        
        return res.data;
    }
    else {
        Toast.show({
            text: (res.messages[0]),
            type: 'danger',
            buttonText: strings.genericStrings.dismiss
        });
    }
}

export async function closeOffer(data, action, context) {
    let res = await Request(urls.base + urls.glam,  urls.offer + urls.close, data);
    if (res.status != undefined && res.status) {
        /** update badges */
        let badges = (context.state.badges != undefined) ? context.state.badges : {badges: {offers: 0}};
        badges.offers = (badges.offers > 0) ? badges.offers - 1 : 0;
        context.set({...context.state, ...{badges: badges}});

        Toast.show({
            text: (res.messages[0]),
            type: 'success',
            buttonText: strings.genericStrings.dismiss
        });
        
        return res.data;
    }
    else {
        Toast.show({
            text: (res.messages[0]),
            type: 'danger',
            buttonText: strings.genericStrings.dismiss
        });
    }
}