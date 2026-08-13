import { get, apiEndpoints } from "../../../shared/api.js";

export async function fetchAllProjects(){
    const response = await get(apiEndpoints.allProject);
    return response;
}