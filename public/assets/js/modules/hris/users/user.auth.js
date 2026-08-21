import { post, apiEndpoints } from "../../../shared/api.js";

const logForm = document.getElementById('login-form');
const passwordInput = document.getElementById('password');
const showPass = document.getElementById('show-pass');

showPass.addEventListener('click', function(){
    const icon = this.querySelector('i');

    if(passwordInput.type === 'password'){
        passwordInput.type = "text";
        icon.classList.replace("bi-eye", "bi-eye-slash");
    } else {
        passwordInput.type = "password";
        icon.classList.replace("bi-eye-slash", "bi-eye");
    }
})

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