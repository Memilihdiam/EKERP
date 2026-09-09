import { fetchClientData } from "./client.data.js";
import { fetchClientRfqs } from "./rfq.data.js";
import { apiEndpoints, post } from "../../../shared/api.js";
import { handleAuthError } from "../../../shared/handleError.js";
import { fetchQuotClient } from "../client.quotations/quotation.data.js";
import { fetchPoClient } from "../purchase_orders/po.data.js";
import { initRowClickNavigation } from "../../../shared/handleRoute.js";
import { fetchInvoicesClient } from "../../finances/invoices/invoice.data.js";

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
                        <td><strong>RFQ Title: </strong>${item.title}</td>
                        <td><strong>RFQ Description: </strong>${item.description}</td>
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

    async function renderClientQuot(){
        const clientId = getClientIdFromUrl();
        const quotClientData = await fetchQuotClient(clientId);
        let rawHTML = '';
        quotClientData.forEach(item => {
            rawHTML += `
                <tbody>
                    <tr data-id="${item.id}" class="quot-row shadow-sm">
                        <td><strong>Quot Title: </strong>${item.title}</td>
                        <td><strong>Quot Description: </strong>${item.description}</td>
                        <td><strong>Quot Valid:</strong>${new Date(item.valid_until).toLocaleDateString('id-ID')}</td>
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
        
        renderAdditionalDetails('quot-details', quotClientData, table, 'This Client Stil Not Have Quotations');
        detailsTab.style.display = 'block';
    }

    async function renderClientPo(){
        const clientId = getClientIdFromUrl();
        const poClientData = await fetchPoClient(clientId);
        let rawHTML = '';

        poClientData.forEach(item => {
            rawHTML += `
                <tbody>
                    <tr data-id="${item.id}" class="po-row shadow-sm">
                        <td><strong>Purchase Order Number: </strong>${item.po_number}</td>
                        <td><strong>Status: </strong>${item.status}</td>
                        <td><strong>Expected Delivery Date: </strong>${new Date(item.expected_delivery_date).toLocaleDateString('id-ID')}</td>
                    </tr>
                </tbody>
            `;
        })

        const table = `
            <table class="table">
                ${rawHTML}
            </table>
        `

        renderAdditionalDetails('po-details', poClientData, table, 'This Client Still Not Have PO')
    }

    async function renderClientInvoice(){
        const clientId = getClientIdFromUrl();
        const invClientData = await fetchInvoicesClient(clientId);
        let rawHTML = '';

        invClientData.forEach(item => {
            rawHTML += `
                <tbody>
                    <tr data-id="${item.id}" class="inv-row shadow-sm">
                        <td><strong>Invoice Number: </strong>${item.invoice_number}</td>
                        <td><strong>Status Paid: </strong>${item.payment_status}</td>
                        <td>
                            <p><strong>Due Date: </strong>${item.due_date}</p>
                            <p><strong>Issue Date: </strong>${item.issue_date}</p>
                        </td>
                    </tr>
                </tbody>
            `;
        })

        const table = `
            <table>
                ${rawHTML}
            </table>
        `

        renderAdditionalDetails('invoice-details', invClientData, table, 'This Client Still Not Have Invoice')
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
    const tabTitle = document.getElementById('tab-title');
    const tabContent = document.getElementById('tab-content');

    // Membuka tab
    picAdding.addEventListener("click", function () {
        overlay.classList.add("show");
        tab.classList.add("show");
        tabTitle.textContent = "Adding Client PIC"
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
        renderClientQuot();
        renderClientPo();
        renderClientInvoice();
    }

    initialRender();
    initRowClickNavigation({container: '#rfq-details', rowSelector: 'tr.rfq-row', getUrl: (rfqId) => `/pages/clients/rfq-detail/${rfqId}`});
    initRowClickNavigation({container: '#quot-details', rowSelector: 'tr.quot-row', getUrl: (quotId) => `/pages/clients/quotation-detail/${quotId}`});
    initRowClickNavigation({container: '#po-details', rowSelector: 'tr.po-row', getUrl: (poId) => `/pages/clients/po-detail/${poId}`});
})