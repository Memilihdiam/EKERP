import { fetchClientData } from "./client.data.js";
import { fetchClientRfqs } from "./rfq.data.js";
import { apiEndpoints, post } from "../../../shared/api.js";

document.addEventListener('DOMContentLoaded', () => {
    const clientDetail = document.getElementById('client-detail-content');
    const loadingSpinner = document.getElementById('loading-spinner');
    const detailsTab = document.getElementById('details-tab');

    const statusColor = {
        ACTIVE: "badge text-bg-success",
        INACTIVE: "badge text-bg-secondary"
    }

    const getClientIdFromUrl = () => {
        const path = window.location.pathname;
        const parts = path.split('/');
        return parts[parts.length - 1];
    };
    
    async function renderClientData(){
        try{
            const clientId = getClientIdFromUrl();
            const data = await fetchClientData(clientId);
            
            const clientData = data.client;
            let clientContent = '';
    
            if(!clientData){
                clientContent = `
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-12"><p>No Have Data</p></div>
                            </div>
                        </div>
                    </div>
                `;
            }else{
                const badgeClass = statusColor[clientData.status] || 'badge text-bg-light';
                clientContent = `
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <p><strong>Client Code: </strong>${clientData.client_code}</p>
                                    <p><strong>Client Name: </strong>${clientData.company_name}</p>
                                    <p><strong>Client Address: </strong>${clientData.address}</p>
                                </div>
                                <div class="col-md-6">
                                    <p><strong>Official Email : </strong>${clientData.company_email}</p>
                                    <p><strong>Official Number: </strong>${clientData.company_number}</p>
                                    <p><strong>Status: </strong><span class="${badgeClass}">${clientData.status}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            clientDetail.innerHTML = clientContent;
        }catch (error) {
            handleAuthError(error);
            projectDetailContent.innerHTML = `<div class="alert alert-danger">Failed to load project details: ${error.message}</div>`;
        } finally {
            loadingSpinner.style.display = 'none';
        }
    }

    async function renderClientRfq(){
        const clientId = getClientIdFromUrl();
        const rfqClientData = await fetchClientRfqs(clientId);
        let rawHTML = '';
        rfqClientData.forEach(item => {
            rawHTML += `
                <tbody>
                    <tr data-id="${item.id}" class="rfq-row shadow-sm">
                        <td><strong>RFQ Code: </strong>${item.title}</td>
                        <td><strong>RFQ Date: </strong>${item.title}</td>
                        <td><strong>RFQ Deadline:</strong>${new Date(item.submission_deadline).toLocaleDateString('id-ID')}</td>
                        <td><strong>Status: </strong>${item.status}</td>
                    </tr>
                </tbody>
            `;
        })
        
        const table = `
            <table class="table">
                ${rawHTML}
            </table>
        `
        
        renderAdditionalDetails('rfq-details', rfqClientData, table, 'This Client Still Not Send RFQ');
        detailsTab.style.display = 'block';
    }
    
    document.getElementById('rfq-details').addEventListener('click', (e) => {
        const row = e.target.closest('tr.rfq-row');
        if(!row) return;
        const rfqId = row.dataset.id;
        if(rfqId){
            window.location.href = `/pages/clients/rfq-detail/${rfqId}`;
        }
    })

    async function renderClientPIC(){
        const clientId = getClientIdFromUrl();
        const data = await fetchClientData(clientId);

        const picClientData = data.pic;
        let rawHTML = '';
        picClientData.forEach(item => {
            rawHTML += `
                <tbody>
                    <tr class="shadow-sm">
                        <td><strong>Name PIC: </strong>${item.name}</td>
                        <td><strong>PIC Email: </strong><a class="nav-link" href="mailto:${item.email}">${item.email}</a></td>
                        <td><strong>PIC Phone: </strong>${item.phone}</td>
                        <td><strong>PIC Whatsapp: </strong>${item.whatsapp_number}</td>
                    </tr>
                </tbody>
            `;
        });

        const table = `
            <table class="table">
                ${rawHTML}
            </table>
        `;

        renderAdditionalDetails('pic-details', picClientData, table, 'This Client Still not have PIC');
        detailsTab.style.display = 'block';
    }

    function renderAdditionalDetails(elementId, data, rawHTML, emptyMessage){
        const container = document.getElementById(elementId);
        if (data && data.length > 0) {
            container.innerHTML = rawHTML;
        } else {
            container.innerHTML = `<p class="text-muted">${emptyMessage}</p>`;
        }
    };

    const picAdding = document.getElementById("pic-adding");
    const rfqAdding = document.getElementById("rfq-adding");
    const closeTab = document.getElementById("closeTab");
    const overlay = document.getElementById("pageOverlay");
    const tab = document.getElementById("adding-tab");
    const tabContent = document.getElementById('tab-content');

    // Membuka tab
    picAdding.addEventListener("click", function () {
        overlay.classList.add("show");
        tab.classList.add("show");
        tabContent.innerHTML = `
            <form class="form-group" id="adding-pic">
                <div class="row m-2">
                    <div class="col-md-6">
                        <input type="text" class="form-control" placeholder="PIC Name" id="pic-name">
                    </div>
                    <div class="col-md-6">
                        <input type="email" class="form-control" placeholder="PIC Email" id="pic-email">
                    </div>
                </div>
                <div class="row m-2">
                    <div class="col-md-6">
                        <input type="number" class="form-control" placeholder="PIC Phone" id="pic-phone">
                    </div>
                    <div class="col-md-6">
                        <input type="number" class="form-control" placeholder="PIC Whatsapp Number" id="pic-wa">
                    </div>
                </div>
                <div class="row m-2">
                    <div class="col-md-12">
                        <select class="form-control" id="pic-status">
                            <option>Select Status</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </div>
                </div>
                <span id="rfq-items"></span>
                <div class="row m-3">
                    <div class="col-md-12 d-flex justify-content-center">
                        <button type="submit" class="btn btn-primary">Save</button>
                    </div>
                </div>
            </form>
        `;

        const addingPicForm = document.getElementById('adding-pic');
        addingPicForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const picData = {
                clientId: getClientIdFromUrl(),
                name: document.getElementById('pic-name').value,
                email: document.getElementById('pic-email').value,
                phone: document.getElementById('pic-phone').value,
                whatsapp_number: document.getElementById('pic-wa').value,
                status: document.getElementById('pic-status').value
            };
            console.log(picData);

            try{
                const response = await post(apiEndpoints.addPic, picData);
    
                if(response.success){
                    alert(response.message);
                    window.location.reload();
                }
            }catch(err){
                console.error('Error adding PIC:', err);
                alert(`Failed to add PIC: ${err.message || 'Unknown error'}`);
            }
        });
    });

    function closeCenterTab() {
        overlay.classList.remove("show");
        tab.classList.remove("show");
    }

    closeTab.addEventListener("click", closeCenterTab);
    overlay.addEventListener("click", closeCenterTab);

    function initialRender(){
        renderClientData();
        renderClientRfq();
        renderClientPIC();
    }

    initialRender();
})