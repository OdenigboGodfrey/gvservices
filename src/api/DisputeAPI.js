import { Request, urls, getSubBase } from "../utils";
import { Toast } from "native-base";
import { strings } from "../strings";


export async function openDispute(data, action, context, navigation) {
    
    let res = await Request(urls.base + getSubBase(),  urls.dispute + urls.open, data);
    if (res.status != undefined && res.status) {
        Toast.show({
            text: (res.messages[0]),
            type: 'success',
            buttonText: strings.genericStrings.dismiss
        });
        // return res.data;
        navigation.goBack();
    }
    else {
        Toast.show({
            text: (res.messages[0]),
            type: 'danger',
            buttonText: strings.genericStrings.dismiss
        });
    }
}

export async function closeDispute(data, action, context) {
    
    let res = await Request(urls.base + getSubBase(),  urls.dispute + urls.close, data);
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