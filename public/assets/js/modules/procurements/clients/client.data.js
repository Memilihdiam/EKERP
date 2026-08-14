import { get, apiEndpoints } from "../../../shared/api.js";

export async function fetchClientsData(){
    const response = await get(apiEndpoints.clients);
    return response;
}

export async function fetchIndustriesData(){
    const response = await get(apiEndpoints.industries);
    return response;
}