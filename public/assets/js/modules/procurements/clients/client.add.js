import { get, post, apiEndpoints } from "../../../shared/api.js";
import { fetchIndustriesData } from "./client.data.js";
import { handleAuthError } from "../../../shared/auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const addForm = document.getElementById('add-form');
    const industrySelect = document.getElementById('industry-name');
    const statusSelect = document.getElementById('status');
    const backBtn = document.getElementById('back-btn');
    const addPicBtn = document.getElementById('add-pic');
    const addPicForm = document.getElementById('pic-form');

    async function renderIndustryOptions() {
        try {
            const data = await fetchIndustriesData();
            const industries = data.industries;

            let industryHTML = '<option value="">Select Industry</option>';
            if (industries && industries.length > 0) {
                industries.forEach(item => {
                    industryHTML += `<option value="${item.id}">${item.name}</option>`;
                });
            } else {
                industrySelect.disabled = true;
                industryHTML = '<option value="">No industries available</option>';
            }
            industrySelect.innerHTML = industryHTML;
        } catch (error) {
            handleAuthError(error);
            console.error('Failed to load industries:', error);
            alert('Failed to load industry data. Please try again.');
        }
    }

    function renderStatusOptions() {
        const statuses = ['Active', 'Inactive', 'Prospect'];
        let statusHTML = '<option value="">Select Status</option>';
        statuses.forEach(status => {
            statusHTML += `<option value="${status}">${status}</option>`;
        });
        statusSelect.innerHTML = statusHTML;
    }

    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const clientData = {
            client_code: document.getElementById('client-code').value,
            company_name: document.getElementById('company-name').value,
            industry_id: industrySelect.value,
            email: document.getElementById('email').value,
            telephone_number: document.getElementById('telephone-number').value,
            address: document.getElementById('address').value,
            status: statusSelect.value
        }

        const pics = [];
        const picRows = addPicForm.querySelectorAll('.pic-row');
        picRows.forEach(row => {
            const pic = {
                name: row.querySelector('.pic-name').value,
                email: row.querySelector('.pic-email').value,
                phone: row.querySelector('.pic-phone').value,
                whatsapp_number: row.querySelector('.pic-whatsapp').value,
                status: row.querySelector('.pic-status').value
            };

            // Validasi sederhana untuk PIC
            if (pic.name && pic.email) { // Minimal nama dan email harus ada
                pics.push(pic);
            }
        });

        const payload = { ...clientData, pics };

        for (const key in clientData) {
            if (!clientData[key]) {
                alert(`Error: Field "${key.replace(/_/g, ' ')}" cannot be empty.`);
                return;
            }
        }

        try {
            const response = await post(apiEndpoints.clients, payload);
            if (response.success) {
                alert(response.message);
                window.location.href = './client-list.html';
            }
        } catch (err) {
            handleAuthError(err);
            console.error('Error adding client:', err);
            alert(`Failed to add client: ${err.message || 'Unknown error'}`);
        }
    });

    backBtn.addEventListener('click', () => window.location.href = '/pages/clients/client-list.html');

    addPicBtn.addEventListener('click', () => {
        const div = document.createElement('div');
        div.classList.add('row', 'g-2', 'mb-2', 'align-items-center', 'pic-row', 'p-2', 'shadow-sm', 'rounded');
        div.innerHTML = `
            <div class="col-md-2">
                <input class="form-control pic-name" type="text" placeholder="PIC Name">
            </div>
            <div class="col-md-2">
                <input class="form-control pic-email" type="email" placeholder="PIC Email">
            </div>
            <div class="col-md-2">
                <input class="form-control pic-phone" type="text" placeholder="PIC Phone">
            </div>
            <div class="col-md-2">
                <input class="form-control pic-whatsapp" type="text" placeholder="PIC Whatsapp">
            </div>
            <div class="col-md-2">
                <select class="form-select pic-status">
                    <option value="">Select Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                </select>
            </div>
            <div class="col-md-1">
                <button type="button" class="btn btn-danger remove-pic-btn w-100">-</button>
            </div>
        `;
        addPicForm.append(div);
    });

    addPicForm.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-pic-btn')) {
            e.target.closest('.pic-row').remove();
        }
    });

    renderIndustryOptions();
    renderStatusOptions();
});
