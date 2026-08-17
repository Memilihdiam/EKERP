import { get, post, apiEndpoints } from "../../../shared/api.js";
import { fetchIndustriesData } from "./client.data.js";
import { handleAuthError } from "../../../shared/auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const addForm = document.getElementById('add-form');
    const industrySelect = document.getElementById('industry-name');
    const statusSelect = document.getElementById('status');
    const backBtn = document.getElementById('back-btn');

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
            pic_name: document.getElementById('pic-name').value,
            email: document.getElementById('email').value,
            telephone_number: document.getElementById('telephone-number').value,
            address: document.getElementById('address').value,
            status: statusSelect.value
        };

        for (const key in clientData) {
            if (!clientData[key]) {
                alert(`Error: Field "${key.replace(/_/g, ' ')}" cannot be empty.`);
                return;
            }
        }

        try {
            const response = await post(apiEndpoints.clients, clientData);
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

    renderIndustryOptions();
    renderStatusOptions();
});
