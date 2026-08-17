import { fetchClientData, fetchPicData } from "./client.data.js";
import { fetchClientRfqs } from "../client_rfqs/rfq.data.js";

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
            const clientData = await fetchClientData(clientId);
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
        
        renderAdditionalDetails('rfq-details', rfqClientData, rawHTML, 'This Client Still Not Send RFQ');
        detailsTab.style.display = 'block';
    }

    async function renderClientPIC(){
        const clientId = getClientIdFromUrl();
        const picClientData = await fetchPicData(clientId);
        console.log(picClientData);
        let rawHTML = '';
        picClientData.forEach(item => {
            rawHTML += `
                <tbody>
                    <tr class="shadow-sm">
                        <td><strong>Name PIC: </strong>${item.name}</td>
                        <td><strong>PIC Email: </strong><a class="nav-link" href="https://gmail.com">${item.email}</a></td>
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

    function initialRender(){
        renderClientData();
        renderClientRfq();
        renderClientPIC();
    }

    initialRender();
})