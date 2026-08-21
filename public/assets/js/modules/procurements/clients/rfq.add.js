import { get, post, apiEndpoints } from "../../../shared/api.js";

document.addEventListener('DOMContentLoaded', () => {
    const rfqAdding = document.getElementById("rfq-adding");
    const closeTab = document.getElementById("closeTab");
    const overlay = document.getElementById("pageOverlay");
    const tab = document.getElementById("adding-tab");
    const tabContent = document.getElementById('tab-content');

    const getClientIdFromUrl = () => {
        const path = window.location.pathname;
        const parts = path.split('/');
        return parts[parts.length - 1];
    };

    rfqAdding.addEventListener('click', function (){
        overlay.classList.add('show');
        tab.classList.add('show');
        const today = new Date().toLocaleDateString('en-CA');
        tabContent.innerHTML = `
            <div class="m-1">
                <button class="btn btn-primary" id="add-items">Add Items</button>
            </div>
            <form class="form-group" id="rfq-form">
                <div class="row m-2">
                    <div class="col-md-6">
                        <input type="text" class="form-control" id="rfq-title" placeholder="RFQ Title" required>
                    </div>
                    <div class="col-md-6">
                        <textarea class="form-control" id="rfq-description" placeholder="RFQ Description"></textarea>
                    </div>
                </div>
                <div class="row m-2">
                    <div class="col-md-6">
                        <input type="date" class="form-control" id="rfq-date" placeholder="RFQ Date" value="${today}" required>
                    </div>
                    <div class="col-md-6">
                        <input type="date" class="form-control" id="rfq-deadline" placeholder="RFQ Deadline" required>
                    </div>
                </div>
                <div class="row m-2">
                    <div class="col-md-12">
                        <select class="form-control" id="rfq-status">
                            <option value="">Choose RFQ Status</option>
                            <option value="DRAFT">Draft</option>
                            <option value="SUBMITTED">Submitted</option>
                            <option value="UNDER_REVIEW">Under Review</option>
                            <option value="QUOTED">Quoted</option>
                            <option value="CLOSED">Closed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                </div>
                <div class="row m-2">
                    <div class="col-md-12">
                        <div id="item-form" style="max-height:400px;overflow-y:auto;"></div>
                    </div>
                </div>
                <div class="row m-2">
                    <div class="col-md-12 d-flex justify-content-center">
                        <button type="submit" class="btn btn-primary">Save</button>
                    </div>
                </div>
            </form>
        `;

        const addItems = document.getElementById('add-items');
        const itemForm = document.getElementById('item-form');
        let no = 1;
        
        addItems.addEventListener('click', () => {
            const div = document.createElement('div');
            div.classList.add('m-2', 'border-top', 'rfq-row');
            div.innerHTML = `
                <label>Item ${no++}</label>
                <div class="row">
                    <div class="col-md-12">
                        <select class="item-id form-control">
                            <option value="">Select Item</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <input type="text" class="item-description form-control" placeholder="item Description" required>
                    </div>
                    <div class="col-md-6">
                        <textarea class="item-specification form-control" placeholder="Item Specification"></textarea>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <input type="number" class="item-quantity form-control" placeholder="Item Quantity" required>
                    </div>
                    <div class="col-md-6">
                        <select class="item-unit form-control" required>
                            <option value="">Select Item Measure Unit</option>
                            <option value="box">Box</option>
                            <option value="pcs">pcs</option>
                            <option value="kg">kg</option>
                            <option value="l">Liter</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <input type="date" class="request-delivery-date form-control" placeholder="Request Delivery" required>
                    </div>
                    <div class="col-md-6">
                        <textarea class="note form-control" placeholder="Note"></textarea>
                    </div>
                </div>
            `;
            itemForm.append(div);
        });

        const rfqForm = document.getElementById('rfq-form');

        rfqForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const rfqData = {
                client_id: getClientIdFromUrl(),
                rfq_date: document.getElementById('rfq-date').value,
                submission_deadline: document.getElementById('rfq-deadline').value,
                title: document.getElementById('rfq-title').value,
                description: document.getElementById('rfq-description').value,
                status: document.getElementById('rfq-status').value
            };

            const items = [];
            const itemRows = itemForm.querySelectorAll('.rfq-row');
            itemRows.forEach(row => {
                const item = {
                    item_id: row.querySelector('.item-id').value,
                    item_description: row.querySelector('.item-description').value,
                    specification: row.querySelector('.item-specification').value,
                    quantity: row.querySelector('.item-quantity').value,
                    unit: row.querySelector('.item-unit').value,
                    requested_delivery_date: row.querySelector('.request-delivery-date').value,
                    notes: row.querySelector('.note').value
                };
                items.push(item);
            });

            const payload = { rfq: rfqData, items };

            try{
                const response = await post(apiEndpoints.rfqsClients, payload);
                if(response.success){
                    window.location.reload();
                }
            }catch(err){
                console.log(err);
                alert(err);
            }
        })
    })
})