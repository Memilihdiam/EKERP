import { get, apiEndpoints } from "./api.js";

async function checkAuthentication() {
    try{
        const response = await get(apiEndpoints.session);
    }catch(err){
        window.location.href = '/';
    }
}

checkAuthentication();