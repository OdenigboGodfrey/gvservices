import { Request, urls } from "../utils";
import { Toast } from "native-base";
import { strings } from "../strings";


export async function getBookings(data, action, context) {
    
    let res = await Request(urls.base,  urls.booking + urls.get, data);
    console.log("data", data);
    if (res.status != undefined && res.status) {
        if (action != undefined) {
            action({
                bookings: res.data.bookings
            });
        }

        if (res.data.bookings.length == 0) {
            Toast.show({
                text: (res.messages[0]),
                buttonText: strings.genericStrings.dismiss
            });
        }
        /*** update badges only for un-accepted bookings */
        // if (data.accepted == -1) {
        //     let badges = (context.state.badges != undefined) ? context.state.badges : {badges: {bookings: 0}};
        //     badges.bookings = res.data.bookings.length;
            
        //     context.set({...context.state, ...{badges: badges}});
        // }
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

export async function closeBooking(data, action, context) {
    let res = await Request(urls.base + urls.glam,  urls.booking + urls.close, data);
    if (res.status != undefined && res.status) {
        /** update badges */
        let badges = (context.state.badges != undefined) ? context.state.badges : {badges: {bookings: 0}};
        badges.bookings = (badges.bookings > 0) ? badges.bookings - 1 : 0;
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

export async function actionOnBooking(data, action, context) {
    let res = await Request(urls.base,  urls.booking + urls.action, data);
    if (res.status != undefined && res.status) {
        Toast.show({
            text: (res.messages[0]),
            type: 'success',
            buttonText: strings.genericStrings.dismiss,
            duration: 3000,
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

