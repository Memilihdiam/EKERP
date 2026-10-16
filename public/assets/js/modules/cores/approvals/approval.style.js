import { apiEndpoints } from "../../../shared/api.js";
import { fetchClientProcurements } from "./approvals.data.js";
import { updateStatus } from "./approval.procurements.js";


document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('table-status');

    const statusList = [
        {name: 'Draft', value: 'DRAFT', level: 1, modul: ['REQUEST OF QUOTATION', 'QUOTATION', 'PURCHASE ORDERS', 'PURCHASE REQUESTS']},
        {name: 'Submitted', value: 'SUBMITTED', level: 2, modul: ['REQUEST OF QUOTATION', 'QUOTATION', 'PURCHASE REQUESTS']},
        {name: 'Under Review', value: 'UNDER_REVIEW', level: 3, modul: ['REQUEST OF QUOTATION']},
        {name: 'Quoted', value: 'QUOTED', level: 4, modul: ['REQUEST OF QUOTATION']},
        {name: 'Closed', value: 'CLOSED', level: 5, modul: ['REQUEST OF QUOTATION']},
        {name: 'Cancelled', value: 'CANCELLED', level: 99, modul: ['REQUEST OF QUOTATION', 'QUOTATION', 'PURCHASE ORDERS']},
        {name: 'Sent', value: 'SENT', level: 3, modul: ['QUOTATION']},
        {name: 'Negotiation', value: 'NEGOTIATION', level: 4, modul: ['QUOTATION']},
        {name: 'Accepted', value: 'ACCEPTED', level: 5, modul: ['QUOTATION']},
        {name: 'Expired', value: 'EXPIRED', level: 99, modul: ['QUOTATION']},
        {name: 'Send To Vendor', value: 'SEND_TO_VENDOR', level: 2, modul: ['PURCHASE ORDERS']},
        {name: 'On Delivery', value: 'ON_DELIVERY', level: 3, modul: ['PURCHASE ORDERS']},
        {name: 'Completed', value: 'COMPLETED', level: 5, modul: ['PURCHASE ORDERS']},
        {name: 'Manager Approved', value: 'MANAGER_APPROVED', level: 3, modul: ['PURCHASE REQUESTS']},
        {name: 'Finance Approved', value: 'FINANCE_APPROVED', level: 4, modul: ['PURCHASE REQUESTS']},
        {name: 'Rejected', value: 'REJECTED', level: 99, modul: ['QUOTATION', 'PURCHASE REQUESTS']},
        {name: 'Processed', value: 'PROCESSED', level: 5, modul: ['PURCHASE ORDERS']},
    ]

    const apiByType = {
        'REQUEST OF QUOTATION': apiEndpoints.updateRFQStatus,
        'QUOTATION': apiEndpoints.updateQuotStatus,
        'PURCHASE ORDERS': apiEndpoints.updatePOStatus,
        'PURCHASE REQUESTS': apiEndpoints.updatePRStatus,
    };


    function getStatusOptions(type, currentStatus) {
        const current = statusList.find(
            status =>
                status.value === currentStatus &&
                status.modul.includes(type)
        )
        return statusList
            .filter(status => status.modul.includes(type))
            .map(status => {
                const disabled = current && status.level < current.level
                return `
                <option value="${status.value}" ${status.value === currentStatus ? 'selected' : ''} ${disabled ? 'disabled' : ''}>
                    ${status.name}
                </option>`
            }).join('');
    }

    async function renderClientProcurement() {
        try {
            const procurementData = await fetchClientProcurements();

            let tableRowHTML = "";

            procurementData.forEach(item => {

                const statusOptions = getStatusOptions(item.type, item.status);

                tableRowHTML += `
                    <tr>
                        <td>${item.number}</td>
                        <td>${item.title}</td>
                        <td>${item.type}</td>
                        <td>${item.status}</td>
                        <td>
                            ${new Date(item.deadline).toLocaleDateString('id-ID')}
                        </td>

                        <td>
                            <form class="edit-status-form d-flex" data-id="${item.id}" data-type="${item.type}">
                                <select class="form-control status-select">
                                    ${statusOptions}
                                </select>

                                <button type="submit" class="btn btn-success ms-2">Save</button>
                            </form>
                        </td>
                    </tr>
                `;
            });

            tableBody.innerHTML = tableRowHTML;

        } catch (error) {
            console.error(error);

            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-danger">
                        Gagal mengambil data procurement
                    </td>
                </tr>
            `;
        }
    }

    /*
     * Submit status
     * Event delegation karena form dibuat secara dinamis
     */
    tableBody.addEventListener('submit', async (event) => {
        const form = event.target.closest('.edit-status-form');

        if (!form) return;

        event.preventDefault();

        const id = form.dataset.id;
        const type = form.dataset.type;
        const url = apiByType[type];
        const select = form.querySelector('.status-select');
        const status = select.value;
        const button = form.querySelector('button');

        try {
            button.disabled = true;
            button.textContent = 'Saving...';

            const item = {
                id: id,
                type: type,
                status: status
            };

            const response = await updateStatus(url, item);

            if(response.success){
                alert('Status berhasil diubah');
            }
            await renderClientProcurement();

        } catch (error) {
            console.error(error);
            alert(error.message || 'Gagal mengubah status');

        } finally {
            button.disabled = false;
            button.textContent = 'Save';
        }
    });


    renderClientProcurement();
});