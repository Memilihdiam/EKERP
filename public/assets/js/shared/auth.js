import { get, apiEndpoints } from "./api.js";

async function checkAuthentication() {
    try{
        const response = await get(apiEndpoints.session);
        console.log(response);
    }catch(err){
        window.location.href = '/';
    }
}

checkAuthentication();