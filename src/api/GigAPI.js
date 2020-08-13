import { Request, urls, getEmptorMode } from "../utils";
import { Toast } from "native-base";
import { strings } from "../strings";

export async function postGig(data, action=undefined, context=undefined,navigation=undefined) {
    
    let res = await Request(urls.base,  urls.gig + urls.create, data);
    if (res.status != undefined && res.status) {
        Toast.show({
            text: (res.messages[0]),
            type: 'success',
            buttonText: strings.genericStrings.dismiss
        });

        if (navigation != undefined) {
            // navigation.goBack();
        }

        // return res.data;
    }
    else {
        Toast.show({
            text: (res.messages[0]),
            type: 'danger',
            buttonText: strings.genericStrings.dismiss
        });
    }
}

export async function getGigs(data, action=undefined, context=undefined) {
    let url = urls.gig;
    if (!getEmptorMode()) url += urls.all;
    
    let res = await Request(urls.base, url , data);
    if (res.status != undefined && res.status) {
        if (action != undefined) {
            action({
                gigs: res.data.gigs,
            });
        }
        if (res.data.gigs.length == 0) {
            Toast.show({
                text: (res.messages[0]),
                buttonText: strings.genericStrings.dismiss
            });
        }
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

export async function closeGig(data, action=undefined, context=undefined, navigation) {
    let res = await Request(urls.base,  urls.gig + urls.close, data);
    if (res.status != undefined && res.status) {
        Toast.show({
            text: (res.messages[0]),
            type: 'success',
            buttonText: strings.genericStrings.dismiss
        });

        navigation.goBack();
        
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

export async function sendInterest(data, action=undefined, context=undefined,navigation=undefined) {
    let res = await Request(urls.base,  urls.gig + urls.interest + urls.save, data);
    
    if (res.status != undefined && res.status) {
        Toast.show({
            text: (res.messages[0]),
            type: 'success',
            buttonText: strings.genericStrings.dismiss
        });
        
        if (navigation != undefined) {
            navigation.goBack();
        }
        
        
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

export async function markInterest(data, action=undefined, context=undefined,) {
    let res = await Request(urls.base,  urls.gig + urls.interest + urls.mark, data);
    
    if (res.status != undefined && res.status) {
        // Toast.show({
        //     text: (res.messages[0]),
        //     type: 'success',
        //     buttonText: strings.genericStrings.dismiss
        // });

        
        
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

export async function actionOnInterest(data, action=undefined, context=undefined,) {
    let res = await Request(urls.base,  urls.gig + urls.interest + urls.action, data);
    
    if (res.status != undefined && res.status) {
        Toast.show({
            text: (res.messages[0]),
            type: 'success',
            buttonText: strings.genericStrings.dismiss
        });

        navigation.goBack();
        
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