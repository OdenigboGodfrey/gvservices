import { Request, urls, setToken, getSubBase, GetRequest } from "../utils";
import { Toast } from "native-base";
import { strings } from "../strings";

export async function getStates(context=undefined, action=undefined ) {
    if (action != undefined) {
        action({
            states: [{name: 'Loading states...', id: 0}]
        });
    }

    let res = await GetRequest(urls.base, urls.get + urls.states);
    if (res.status != undefined && res.status) {
        if (action != undefined) {
            action({
                states: res.data,
                citySelected: (res.data.length > 0) ? res.data[0].id : '',
            });
        }
        if (context != undefined) context.set({'states': res.data});
        
        return res;
    }
    else {
        Toast.show({
            text: (res.messages[0]),
            type: 'danger',
            buttonText: strings.genericStrings.dismiss
        });
    }
}

export async function getServiceCategories(context=undefined, action=undefined ) {
    let res = await GetRequest(urls.base, urls.get + urls.categories);
    if (res.status != undefined && res.status) {
        if (action != undefined) {
            action({
                services: res.data.categories,
                serviceSelected: res.data.categories[0].name,
                serviceLoading: false,
            });
        }
        if (context != undefined) context.set({'services': res.data.categories});
        
        return res;
    }
    else {
        Toast.show({
            text: (res.messages[0]),
            type: 'danger',
            buttonText: strings.genericStrings.dismiss
        });
    }
}

export async function getServiceCategoriesFields(id, context=undefined, action=undefined ) {
    let res = await GetRequest(urls.base, urls.get + urls.categories + urls.get + "?category_id=" + id);
    if (res.status != undefined && res.status) {
        if (action != undefined) {
            action({
                serviceFields: res.data.category_fields,
                serviceFieldSelected: res.data.category_fields[0].title
            });
        }
        // if (context != undefined) context.set({'states': res.data});
        
        return res;
    }
    else {
        Toast.show({
            text: (res.messages[0]),
            type: 'danger',
            buttonText: strings.genericStrings.dismiss
        });
    }
}
