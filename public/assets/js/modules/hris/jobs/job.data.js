import { get, apiEndpoints } from "../../../shared/api.js";

export async function fetchJobs(){
    const response = await get(apiEndpoints.job);
    return response.job;
}