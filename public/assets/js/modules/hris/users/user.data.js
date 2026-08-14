import { get, apiEndpoints } from "../../../shared/api.js";

export async function fetchUserData(){
    const response = await get(apiEndpoints.user);
    return response;
}