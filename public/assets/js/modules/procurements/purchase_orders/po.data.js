import { get, apiEndpoints } from "../../../shared/api.js";

export async function fetchPoClient(id){
    const response = await get(apiEndpoints.poClient(id));
    return response.poData;
}

export async function fetchPoDetail(id){
    const response = await get(apiEndpoints.poDetail(id));
    return response;
}