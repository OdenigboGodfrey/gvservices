import { GetRequest, urls, Request, getState, getImage, getId } from "../utils";
import { Toast } from "native-base";
import { strings } from "../strings";

export async function getGlams(set, onlyFeatured=false) {
    let endPoint = urls.allGlams ;
    endPoint += (onlyFeatured) ? '?only_featured=true' : '';
    
    let res = await GetRequest(urls.base + urls.glam,  endPoint);
    
    if (res.status != undefined && res.status) {
        set({
            glams: res.data.glams,
            noToRender: res.data.glams.length
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

export async function getGlam(data, set, context) {
    let res = await Request(urls.base + urls.glam,  urls.singleGlam, data);
    
    if (res.status != undefined && res.status) {
        res.data = res.data;
        set({
            username: res.data.username,
            gender: res.data.gender,
            fullName: res.data.first_name + " " + res.data.last_name,
            address: getState(context.state.states, res.data.city_id).name,
            glamDefaultImage: getImage('glams', res.data.code, res.data.avatar),
            bio: res.data.bio,
            trueImages: res.data.true_images,
            code: res.data.code,
            glamRates: res.data.rates,
            average_rating: res.data.rating.average_rating,
            ratingsText: (res.data.rating.total_ratings) + " ratings",
            bodyCheck: res.data.body_check,
            speechVideo: res.data.speech_video,
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

export async function getGlamServices(data, set, context) {
    let res = await Request(urls.base + urls.glam,  urls.services, data);
    if (res.status != undefined && res.status) {
        set({
            services: res.data.services,
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

export async function uploadTrueImages(data, context, navigation, set) {
    /*** not used, used RNBlob instead */
    data.append("glam_id", context.state.user_data.id);
    let res = await Request(urls.base + urls.glam,  urls.trueImages + urls.save, data, true);
    if (res.status != undefined && res.status) {
        Toast.show({
            text: (res.messages[0]),
            type: 'success',
            buttonText: strings.genericStrings.dismiss
        });

        set({
            btnClicked: false
        });
        
        navigation.goBack();
    }
    else {
        Toast.show({
            text: (res.messages[0]),
            type: 'danger',
            buttonText: strings.genericStrings.dismiss
        });
        set({
            btnClicked: false
        });
    }
}

export async function uploadVerificationVideo(data, context) {
    /*** not used, used RNBlob instead */
    data.append('glam_id', context.state.user_data.id);
    let res = await Request(urls.base + urls.glam,  urls.verificationVideo + urls.save, data, true);
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

export async function getGlamBadgeCounter(data, set, context) {
    let res = await Request(urls.base + urls.glam,  urls.badges, data);
    if (res.status != undefined && res.status) {
        set({
            badges: res.data.badges,
        });
        context.set({badges: res.data.badges});
        return res.data;
    }
    else {
        // Toast.show({
        //     text: (res.messages[0]),
        //     type: 'danger',
        //     buttonText: strings.genericStrings.dismiss
        // });
    }
}

export async function filterGlam(data, set, context) {
    // console.log("glamapi", data);
    let res = await Request(urls.base + urls.glam,  urls.filter, data);
    if (res.status != undefined && res.status) {
        set({
            glams: res.data.glams,
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

export async function deleteTrueImage(data, set, context, get) {
    let res = await Request(urls.base + urls.glam,  urls.trueImages + urls.delete, data);
    if (res.status != undefined && res.status) {
        set({
            trueImages: get.trueImages.filter(x => x.id != res.data.image_id),
        });

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