import { get, apiEndpoints } from "../../../shared/api.js";

export async function fetchAllRfqs(){
    const response = await get(apiEndpoints.rfqs);
    return response;
}

export async function fetchClientRfqs(id){
    const response = await get(apiEndpoints.rfqsClient(id));
    return response;
}