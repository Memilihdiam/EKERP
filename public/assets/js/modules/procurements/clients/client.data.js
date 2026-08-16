import { get, apiEndpoints } from "../../../shared/api.js";

export async function fetchAllClientsData(){
    const response = await get(apiEndpoints.clients);
    return response;
}

export async function fetchClientData(id){
    const response = await get(apiEndpoints.detailClient(id));
    return response.client.client;
}

export async function fetchIndustriesData(){
    const response = await get(apiEndpoints.industries);
    return response;
}
