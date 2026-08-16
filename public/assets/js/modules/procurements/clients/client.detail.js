import { fetchClientData } from "./client.data.js";
import { fetchClientRfqs } from "../client_rfqs/rfq.data.js";

document.addEventListener('DOMContentLoaded', () => {
    const clientDetail = document.getElementById('client-detail-content');
    const loadingSpinner = document.getElementById('loading-spinner');

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
            console.log(clientData);
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
        
        renderAdditionalDetails('pic-details', rfqClientData, 'This Client Still Not Send RFQ')
    }

    function renderAdditionalDetails(elementId, data, emptyMessage){
        const container = document.getElementById(elementId);
        if (data && data.length > 0) {
            container.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        } else {
            container.innerHTML = `<p class="text-muted">${emptyMessage}</p>`;
        }
    };

    renderClientData();
    renderClientRfq();
})