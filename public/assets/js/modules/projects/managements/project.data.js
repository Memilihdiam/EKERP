import { get, apiEndpoints } from "../../../shared/api.js";

export async function fetchAllProjects(){
    const response = await get(apiEndpoints.allProject);
    return response;
}

export async function fetchProjectId(id){
    const response = await get(apiEndpoints.detailProject(id));
    return response;
}