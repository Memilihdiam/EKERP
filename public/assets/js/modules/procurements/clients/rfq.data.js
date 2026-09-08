import { get, apiEndpoints } from "../../../shared/api.js";

export async function fetchAllRfqs(){
    const response = await get(apiEndpoints.rfqsClients);
    return response.client_rfq;
}

export async function fetchClientRfqDetail(id){
    const response = await get(apiEndpoints.rfqsClientDetail(id));
    return response;
}

export async function fetchClientRfqs(id){
    const response = await get(apiEndpoints.rfqsClient(id));
    return response.rfqs;
}