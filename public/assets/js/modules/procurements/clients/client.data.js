import { get, apiEndpoints } from "../../../shared/api.js";

export async function fetchAllClientsData(){
    const response = await get(apiEndpoints.clients);
    return response;
}

export async function fetchClientData(id){
    const response = await get(apiEndpoints.detailClient(id));
    return response.data.client;
}

export async function fetchPicData(id){
    const response = await get(apiEndpoints.detailClient(id));
    return response.data.pic;
}

export async function fetchIndustriesData(){
    const response = await get(apiEndpoints.industries);
    return response;
}
