import { GetRequest, urls, Request, getImage, getId } from "../utils";
import { Toast } from "native-base";
import { strings } from "../strings";

export async function getGlamRates(data, action, context) {
    /**get all rates for a glam */
    let res = await Request(urls.base + urls.glam,  urls.glam_rate + urls.all, data);
    if (res.status != undefined && res.status) {
        action({
            glam_rates: res.data.glam.rates,
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

export async function getGlamRate(data, action, context) {
    /**get single rates for a glam */
    let res = await Request(urls.base + urls.glam,  urls.glam_rate + urls.get, data);
    if (res.status != undefined && res.status) {
        action({
            glam_rate: res.data.glam.rate,
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

export async function saveGlamRate(data, action, context) {
    /**get single rates for a glam */
    let res = await Request(urls.base + urls.glam,  urls.glam_rate + urls.save, data);
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

export async function deleteGlamRate(data, action, context) {
    /**get single rates for a glam */
    let res = await Request(urls.base + urls.glam,  urls.glam_rate + urls.delete, data);
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

export async function deleteGlamRatesByCategory(data, action, context) {
    /**get single rates for a glam */
    let res = await Request(urls.base + urls.glam,  urls.glam_rate + urls.deleteGlamRateByCategory, data);
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