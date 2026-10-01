import { apiEndpoints, put } from "../../../shared/api.js";

export async function changePassword(){
    const tabContent = document.getElementById('tab-content');
    const tabTitle = document.getElementById('tab-title');

    tabTitle.textContent = 'Change Password';
    tabContent.innerHTML = `
        <form id="change-password-form">
            <div class="row m-2">
                <div class="col-12">
                    <label>Old Password</label>
                    <input type="password" class="form-control" id="old-password-input" required>
                </div>
            </div>
            <div class="row m-2">
                <div class="col-12">
                    <label>New Password</label>
                    <input type="password" class="form-control" id="new-password-input" required>
                </div>
            </div>
            <div class="row m-2">
                <div class="col-12 d-flex justify-content-center">
                    <button type="submit" class="btn btn-primary">Save</button>
                </div>
            </div>
        </form>
    `;

    const changePassForm = document.getElementById('change-password-form');
    const oldPassInput = document.getElementById('old-password-input');
    const newPassInput = document.getElementById('new-password-input');

    changePassForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const payload = {
            oldPassword: oldPassInput.value,
            password: newPassInput.value
        }

        console.log(payload);

        try{
            const response = await put(apiEndpoints.password, payload);
            if(response.success){
                alert(response.message);
            }
        }catch(err){
            console.log(err);
            alert(err);
        }
    })
}