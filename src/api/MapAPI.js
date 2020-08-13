import { GetRequest, urls, MapAPIKey, GeocodingAPIKey } from "../utils";

export async function getLocationInfo(Latitude, Longitude) {
    let url = urls.googleMapApi + Latitude + ',' + Longitude + '&key=' + GeocodingAPIKey;
    let res = await GetRequest(url, '');
    console.log(JSON.stringify(res));
}