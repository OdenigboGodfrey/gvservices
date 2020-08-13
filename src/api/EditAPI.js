import { Request, urls, setToken, getSubBase, getId } from "../utils";
import { Toast } from "native-base";
import { strings } from "../strings";
import { updateData } from "../storage/MainStorage";

export async function edit(data, navigation, context, next_page={next: 'PostSignupGeneral', enforce: undefined}) {
    data.id = getId();
    let res = await Request(urls.base + getSubBase(), urls.edit, data);
    // console.log(JSON.stringify(data));
    if (res.status != undefined && res.status) {
        Toast.show({
            text: res.messages[0],
            type: 'success',
            buttonText: strings.genericStrings.dismiss,
            duration: 3000
        });
        /** set context */
        let user_data = context.state.user_data;
        data = res.data;
        user_data = {...user_data, ...data}
        context.set({
            user_data: user_data
        });

        // save locally
        await updateData('user_data', user_data);
        if (next_page.next != undefined) {
            navigation.navigate(next_page.next, { 'enforce': next_page.enforce, data: user_data });
        }
        
        return res;
    }
    else {
        // let messages_key = Object.keys(res.data.message);
        Toast.show({
            text: (res.messages[0]),
            type: 'danger',
            buttonText: strings.genericStrings.dismiss
        });
    }
}