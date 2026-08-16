import { apiEndpoints } from "../../../shared/api.js";
import { fetchAllClientsData, fetchIndustriesData } from "./client.data.js";

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('table-body');
    let storeData = [];

    function renderTableClients(data){
        let tableRowHTML = '';

        if(data.length === 0){
            tableRowHTML = `<tr><td colspan="9">No Data Yet</td></tr>`
        }else{
            let no = 1;
            data.forEach(item => {
                tableRowHTML += `
                    <tr data-id="${item.id}" class="client-row">
                        <td>${no++}</td>
                        <td>${item.client_code}</td>
                        <td>${item.company_name}</td>
                        <td>${item.industry_name}</td>
                        <td>${item.pic_name}</td>
                        <td>${item.email}</td>
                        <td>${item.telephone_number}</td>
                        <td>${item.address}</td>
                        <td>${item.status}</td>
                    </tr>
                `
            })
        }
        tableBody.innerHTML = tableRowHTML;
    }

    async function initialRender(){
        const response = await fetchAllClientsData();
        storeData = response.clients;
        renderTableClients(storeData);
    }

    tableBody.addEventListener('click', (e) => {
        const row = e.target.closest('tr.client-row');
        if(!row) return;

        if(e.target.closest('button')){
            return;
        }

        const clientId = row.dataset.id;
        if(clientId){
            window.location.href = `/pages/clients/client-detail/${clientId}`;
        }
    })

    initialRender();
})