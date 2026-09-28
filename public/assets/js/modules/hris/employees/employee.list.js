import { get, apiEndpoints } from "../../../shared/api.js";
import { fetchEmployeeList } from "./employee.data.js";

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('table-body');

    async function renderTable(){
        const empData = await fetchEmployeeList();
        let tableRowHTML = '';

        if(empData.length === 0){
            tableRowHTML = '<tr><td colspan="5">No Data Yet</td></tr>'
        }else{
            empData.forEach(item => {
                tableRowHTML += `
                    <tr data-id="${item.id}" class="employee-row">
                        <td>${item.employee_code}</td>
                        <td>${item.name}</td>
                        <td>${item.department_name}</td>
                        <td>${item.position_name}</td>
                        <td>${item.status_name}</td>    
                    </tr>
                `;
            })
        }
        tableBody.innerHTML = tableRowHTML;
    }

    renderTable();
})