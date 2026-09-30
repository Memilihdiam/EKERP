import { get, apiEndpoints } from "../../../shared/api.js";

export async function fetchUrgentTask(){
    const response = await get(apiEndpoints.urgentTask);
    return response.task;
}