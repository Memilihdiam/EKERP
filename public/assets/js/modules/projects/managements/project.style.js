import { fetchAllProjects } from "./project.data.js";

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('table-body');
    const searchInput = document.getElementById('search-input');
    let storeData = [];

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredData = storeData.filter(data => {
            return (
                data.project_code.toLowerCase().includes(searchTerm) ||
                data.project_name.toLowerCase().includes(searchTerm) ||
                data.company_name.toLowerCase().includes(searchTerm) ||
                data.pic_name.toLowerCase().includes(searchTerm) ||
                data.email.toLowerCase().includes(searchTerm) ||
                data.telephone_number.toLowerCase().includes(searchTerm) ||
                data.contract_value.toLowerCase().includes(searchTerm) ||
                data.status.toLowerCase().includes(searchTerm)
            );
        });
        renderTableProjects(filteredData);
    })

    function renderTableProjects(data){
        let tableRowHTML = '';
        
        if(data.length === 0){
            tableRowHTML = `<tr><td col-span="11 text-center">No Data Yet</td></tr>`
        }else{
            let no = 1;
            data.forEach(item => {
                tableRowHTML += `
                    <tr>
                        <td>${no++}</td>
                        <td>${item.project_code}</td>
                        <td>${item.project_name}</td>
                        <td>${item.company_name}</td>
                        <td>${item.pic_name}</td>
                        <td>${item.email}</td>
                        <td>${item.telephone_number}</td>
                        <td>${new Date(item.start_date).toLocaleDateString('id-ID')}</td>
                        <td>${new Date(item.end_date).toLocaleDateString('id-ID')}</td>
                        <td>${item.contract_value}</td>
                        <td>${item.status}</td>
                    </tr>
                `;
            })
        }

        tableBody.innerHTML = tableRowHTML;
    }

    async function initialRender(){
        const data = await fetchAllProjects();
        storeData = data.projects;
        renderTableProjects(storeData);
    }

    initialRender();
})