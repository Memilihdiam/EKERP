import { apiEndpoints } from "../../../shared/api.js";
import { fetchClientsData, fetchIndustriesData } from "./client.data.js";

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
                    <tr>
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
        const response = await fetchClientsData();
        storeData = response.clients;
        renderTableClients(storeData);
    }

    initialRender();
})