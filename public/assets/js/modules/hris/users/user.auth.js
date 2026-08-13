import { post, apiEndpoints } from "../../../shared/api.js";

const logForm = document.getElementById('login-form');
console.log('Di load')

logForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        userCode: document.getElementById('user-code').value,
        password: document.getElementById('password').value
    }
    try{
        const response = await post(apiEndpoints.login, data);
        if(response.success){
            window.location.href = '/pages/dashboards/dashboard.html';
        }else{
            message.textContent = response.message;
        }
    }catch(err){
        message.textContent = err.message;
    }
})