import { get, apiEndpoints } from "../../shared/api.js";

export async function fetchReviewData(){
    const response = await get(apiEndpoints.procurementsReview);
    return response;
}

export async function fetchValueProject(){
    const response = await get(apiEndpoints.valueProject);
    return response;
}