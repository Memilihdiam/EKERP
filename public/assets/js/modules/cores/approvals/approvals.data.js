import { get, apiEndpoints } from "../../../shared/api.js";

export async function fetchClientProcurements(){
    const response = await get(apiEndpoints.clientProcurementsApproval);
    return response.client_procurements;
}