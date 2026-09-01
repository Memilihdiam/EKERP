import { get, apiEndpoints } from "../../../shared/api.js";

export async function fetchQuotClient(clientId){
    const response = await get(apiEndpoints.quotationClient(clientId));
    return response.quotation;
}

export async function fetchQuotbyId(quotId){
    const response = await get(apiEndpoints.quotationDetail(quotId));
    return response;
}