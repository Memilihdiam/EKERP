import { get, post, apiEndpoints } from "../../../shared/api.js";
import { fetchJobs } from "../jobs/job.data.js";
import { fetchDataForAddEmp } from "./employee.data.js";

document.addEventListener('DOMContentLoaded', () => {
    const addEmployeeForm = document.getElementById('add-employee');
    const nameInput = document.getElementById('name-input');
    const genderInput = document.getElementById('gender-input');
    const dateBirthInput = document.getElementById('date-birth-input');
    const addressInput = document.getElementById('address-input');
    const emailInput = document.getElementById('email-input');
    const phoneInput = document.getElementById('phone-input');
    const bankInput = document.getElementById('bank-name-input');
    const accountNumberInput = document.getElementById('account-number-input');
    const ptkpInput = document.getElementById('ptkp-input');
    const roleInput = document.getElementById('role-input');
    const joinDateInput = document.getElementById('join-date-input');
    const employementStatusInput = document.getElementById('status-id');
    const startWorkInput = document.getElementById('start-work-input');
    const endWorkInput = document.getElementById('end-work-input');
    const jobInput = document.getElementById('job-input');
    const passwordInput = document.getElementById('password-input');

    function renderBankName(){
        const bankData = [
            {bank_name: "Mandiri", value: "Mandiri"},
            {bank_name: "BCA", value: "BCA"},
            {bank_name: "BRI", value: "BRI"},
            {bank_name: "BNI", value: "BNI"},
            {bank_name: "Bank Jago", value: "Bank Jago"}
        ]

        let bankOption;
        bankData.forEach(item => {
            bankOption += `<option value="${item.value}">${item.bank_name}</option>`
        })

        bankInput.innerHTML = `
            <option value="">Select Bank</option>
            ${bankOption}
        `;
    }

    async function renderPTKP(ptkpData){
        let ptkpOption;
        ptkpData.forEach(item => {
            ptkpOption += `<option value="${item.id}">${item.name}</option>`
        })

        ptkpInput.innerHTML = `
            <option value="">Select PTKP</option>
            ${ptkpOption}
        `
    }

    async function renderRoles(roleData){
        let roleOption;
        roleData.forEach(item => {
            roleOption += `<option value="${item.id}">${item.role_name}</option>`
        })

        roleInput.innerHTML = `
            <option value="">Select Role</option>
            ${roleOption}
        `
    }

    async function renderEmployementStatus(employementStatus){
        let statusOption;
        employementStatus.forEach(item => {
            statusOption += `<option value="${item.id}">${item.status_name}</option>`
        })

        employementStatusInput.innerHTML = `
            <option value="">Select Employement Status</option>
            ${statusOption}
        `;
    }

    async function renderJob(){
        const jobData = await fetchJobs();

        let jobOption;
        jobData.forEach(item => {
            jobOption += `<option value="${item.id}">${item.position_name}</option>`
        })

        jobInput.innerHTML = `
            <option value="">Select Job</option>
            ${jobOption}
        `
    }

    async function renderData(){
        const response = await fetchDataForAddEmp();
        const ptkp = response.ptkp_status;
        const role = response.roles;
        const employementStatus = response.employement_status;
        console.log(response);

        renderPTKP(ptkp);
        renderRoles(role);
        renderEmployementStatus(employementStatus);
    }

    addEmployeeForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const employeeData = {
            name: nameInput.value,
            gender: genderInput.value,
            address: addressInput.value,
            date_of_birth: dateBirthInput.value,
            email: emailInput.value,
            telephone_number: phoneInput.value,
            bank_name: bankInput.value,
            account_number: accountNumberInput.value,
            ptkp_id: ptkpInput.value,
            role_id: roleInput.value,
            join_date: joinDateInput.value,
            status_id: employementStatusInput.value,
            start_work: startWorkInput.value,
            end_work: endWorkInput.value,
            position_id: jobInput.value,
            password: passwordInput.value
        }
        
        try{
            console.log(employeeData);
            const response = await post(apiEndpoints.employee, employeeData);
            if(response.success){
                alert(response.message);
                window.location.href = '/pages/hris/employees/employees-list.html';
            }
        }catch(err){
            alert(err);
            console.log(err);
        }
    })

    renderData();
    renderBankName();
    renderJob();
})