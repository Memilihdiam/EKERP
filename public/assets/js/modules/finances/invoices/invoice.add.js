import { get, post, apiEndpoints } from "../../../shared/api.js";
import { invSourceType } from "../../../shared/source_type.js";
import { fetchClientData } from "../../procurements/clients/client.data.js";
import { fetchPoClient, fetchPoDetail } from "../../procurements/purchase_orders/po.data.js";
import { fetchInvoiceDetail } from "./invoice.data.js";

document.addEventListener('DOMContentLoaded', () => {
    const invAdding = document.getElementById('invoice-adding');
    const tab = document.getElementById('adding-tab');
    const tabContent = document.getElementById('tab-content');
    const tabTitle = document.getElementById('tab-title');
    const overlay = document.getElementById('pageOverlay');
    const closeTab = document.getElementById('close-tab');

    let no = 1;

    const getClientIdFromUrl = () => {
        const path = window.location.pathname;
        const parts = path.split("/");
        return parts[parts.length - 1];
    };

    function renderItemInput(itemDescription = '', quantity = 0, unit = '', unitPrice = 0, totalPrice = 0) {
        const div = document.createElement('div');

        div.classList.add("m-2", "border-top", "purchase_order-row");

        div.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mt-2">
                <label>Item ${no++}</label>
                <button type="button" class="btn btn-sm btn-danger remove-item"> Remove</button>
            </div>

            <div class="row m-2">
                <div class="col-12">
                    <label class="form-label">Item Name</label>
                    <input type="text" class="form-control item-description" value="${itemDescription}">
                </div>
            </div>

            <div class="row m-2">
                <div class="col-6">
                    <label class="form-label">Quantity</label>
                    <input type="number" class="form-control quantity" min="0" step="any" required value="${quantity}">
                </div>
                <div class="col-6">
                    <label class="form-label">Unit of Item</label>
                    <select class="item-unit form-control" required>
                        <option value="">Select Item Measure Unit</option>

                        <!-- Count / Individual -->
                        <option value="pcs">Pieces (pcs)</option>
                        <option value="unit">Unit</option>
                        <option value="set">Set</option>
                        <option value="pair">Pair</option>
                        <option value="dozen">Dozen</option>

                        <!-- Packaging -->
                        <option value="box">Box</option>
                        <option value="pack">Pack</option>
                        <option value="bag">Bag</option>
                        <option value="bottle">Bottle</option>
                        <option value="can">Can</option>
                        <option value="carton">Carton</option>
                        <option value="case">Case</option>
                        <option value="bundle">Bundle</option>
                        <option value="roll">Roll</option>
                        <option value="reel">Reel</option>
                        <option value="tube">Tube</option>
                        <option value="sack">Sack</option>
                        <option value="pail">Pail</option>
                        <option value="drum">Drum</option>

                        <!-- Weight -->
                        <option value="mg">Milligram (mg)</option>
                        <option value="g">Gram (g)</option>
                        <option value="kg">Kilogram (kg)</option>
                        <option value="ton">Metric Ton (ton)</option>

                        <!-- Volume -->
                        <option value="ml">Milliliter (ml)</option>
                        <option value="l">Liter (L)</option>
                        <option value="m3">Cubic Meter (m³)</option>

                        <!-- Length -->
                        <option value="mm">Millimeter (mm)</option>
                        <option value="cm">Centimeter (cm)</option>
                        <option value="m">Meter (m)</option>
                        <option value="km">Kilometer (km)</option>

                        <!-- Area -->
                        <option value="m2">Square Meter (m²)</option>

                        <!-- Other -->
                        <option value="sheet">Sheet</option>
                        <option value="ream">Ream</option>
                        <option value="pair">Pair</option>
                        <option value="lot">Lot</option>
                        <option value="job">Job</option>
                        <option value="service">Service</option>
                    </select>
                </div>
            </div>
                
            <div class="row m-2">
                <div class="col-6">
                    <label class="form-label">Unit Price</label>
                    <input type="number" class="form-control unit-price" min="0" step="any" required value="${unitPrice}">
                </div>
                <div class="col-6">
                    <label class="form-label">Total Price</label>
                    <input type="number" class="form-control total-price" min="0" step="any" readonly value="${totalPrice}">
                </div>
            </div>
        `;

        const unitInput = div.querySelector('.item-unit');
        unitInput.value = unit;

        return div;
    }

    function calculateItemTotal(row) {
        const quantityInput = row.querySelector('.quantity');
        const unitPriceInput = row.querySelector('.unit-price');
        const totalPriceInput = row.querySelector('.total-price');

        if (!quantityInput || !unitPriceInput || !totalPriceInput) {
            return;
        }

        const quantity = parseFloat(quantityInput.value) || 0;
        const unitPrice = parseFloat(unitPriceInput.value) || 0;
        const totalPrice = quantity * unitPrice;

        totalPriceInput.value = totalPrice.toFixed(2);
    }

    function calculateSubtotal() {
        const itemRows = document.querySelectorAll('.purchase_order-row');
        let subtotal = 0;

        itemRows.forEach(row => {
            calculateItemTotal(row);
            const totalPriceInput = row.querySelector('.total-price');
            subtotal += parseFloat(totalPriceInput.value) || 0;
        });

        return subtotal;
    }

    function calculateGrandTotal() {
        const subtotalInput = document.getElementById('subtotal');
        const taxAmountInput = document.getElementById('tax-amount');
        const shippingCostInput = document.getElementById('shipping-cost');
        const discountAmountInput = document.getElementById('discount-amount');
        const grandTotalInput = document.getElementById('grand-total');

        if (!subtotalInput || !taxAmountInput || !shippingCostInput || !discountAmountInput || !grandTotalInput) {
            return;
        }

        const subtotal = parseFloat(subtotalInput.value) || 0;
        const taxAmount = parseFloat(taxAmountInput.value) || 0;
        const shippingCost = parseFloat(shippingCostInput.value) || 0;
        const discountAmount = parseFloat(discountAmountInput.value) || 0;

        const grandTotal = subtotal + shippingCost + taxAmount - discountAmount;

        grandTotalInput.value = grandTotal.toFixed(2);
    }

    function calculateTotals() {
        const subtotalInput = document.getElementById('subtotal');

        if (!subtotalInput) {
            return;
        }

        const subtotal = calculateSubtotal();
        subtotalInput.value = subtotal.toFixed(2);

        calculateGrandTotal();
    }

    function setupItemCalculation(itemContent) {
        itemContent.addEventListener('input', function (e) {
            if (
                e.target.classList.contains('quantity') ||
                e.target.classList.contains('unit-price')
            ) {
                const row = e.target.closest('.purchase_order-row');
                if (row) {
                    calculateItemTotal(row);
                }
                calculateTotals();
            }
        });

        itemContent.addEventListener('click', function (e) {
            if (e.target.classList.contains('remove-item')) {
                const row = e.target.closest('.purchase_order-row');
                if (row) {
                    row.remove();
                }
                calculateTotals();
            }
        });
    }

    function calculateRemainPaymentTermin() {
        const terminPaymentInput = document.getElementById('termin-payment');
        const remainPaymentInput = document.getElementById('remain-payment');

        if (!terminPaymentInput || !remainPaymentInput) {
            return;
        }

        const terminPayment = parseFloat(terminPaymentInput.value) || 0;
        const originalRemain = parseFloat(remainPaymentInput.dataset.originalRemain) || 0;

        const remain = originalRemain - terminPayment;

        remainPaymentInput.value = remain.toFixed(2);
    }

    invAdding.addEventListener('click', async function () {
        overlay.classList.add('show');
        tab.classList.add('show');
        tab.style.maxWidth = "1000px";

        tabTitle.textContent = 'Add Invoice Client';

        tabContent.innerHTML = `
            <div class="m-1">
                <button type="button" class="btn btn-primary" id="add-items">Add Item</button>
            </div>

            <form class="form-group" id="invoice-form">
                <div class="row m-2">
                    <div class="col-12">
                        <select class="form-control" id="po-id"></select>
                    </div>
                </div>

                <div class="row m-2">
                    <div class="col-12">
                        <input type="text" class="form-control" id="title" placeholder="Title" required>
                    </div>
                </div>

                <div class="row m-2">
                    <div class="col-6">
                        <label>Issue Date</label>
                        <input type="date" class="form-control" id="issue-date" required>
                    </div>
                    <div class="col-6">
                        <label>Due Date</label>
                        <input type="date" class="form-control" id="due-date" required>
                    </div>
                </div>

                <div class="row m-2">
                    <div class="col-6">
                        <label>Subtotal</label>
                        <input type="number" class="form-control" id="subtotal" placeholder="Subtotal" readonly required>
                    </div>
                    <div class="col-6">
                        <label>Tax Amount</label>
                        <input type="number" class="form-control" id="tax-amount" placeholder="Tax Amount" min="0" step="any" value="0" required>
                    </div>
                </div>

                <div class="row m-2">
                    <div class="col-6">
                        <label>Discount Amount</label>
                        <input type="number" class="form-control" id="discount-amount" placeholder="Discount Amount" min="0" step="any" value="0" required>
                    </div>
                    <div class="col-6">
                        <label>Shipping Cost</label>
                        <input type="number" class="form-control" id="shipping-cost" placeholder="Shipping Cost" min="0" step="any" value="0" required>
                    </div>
                </div>

                <div class="row m-2">
                    <div class="col-12">
                        <label>Termin Payment</label>
                        <input type="number" class="form-control" id="termin-payment" placeholder="Termin Payment" required>
                    </div>
                </div>

                <div class="row m-2">
                    <div class="col-12">
                        <label>Grand Total</label>
                        <input type="number" class="form-control" id="grand-total" placeholder="Grand Total" readonly required>
                    </div>
                </div>

                <div class="row m-2">
                    <div class="col-6">
                        <label>Payment Status</label>
                        <select class="form-control" id="payment-status" required>
                            <option value="">Payment Status</option>
                            <option value="UNPAID">Unpaid</option>
                            <option value="PARTIAL">Partial</option>
                            <option value="PAID">Paid</option>
                        </select>
                    </div>
                    <div class="col-6">
                        <label>Status</label>
                        <select class="form-control" id="status" required>
                            <option value="">Status</option>
                            <option value="DRAFT">Draft</option>
                            <option value="SENT">Sent</option>
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

        const invoiceForm = document.getElementById('invoice-form');
        const poIdSelect = document.getElementById('po-id');
        const title = document.getElementById('title');

        const issueDate = document.getElementById('issue-date');
        const dueDate = document.getElementById('due-date');

        const subtotal = document.getElementById('subtotal');
        const taxAmount = document.getElementById('tax-amount');
        const shippingCost = document.getElementById('shipping-cost');
        const discountAmount = document.getElementById('discount-amount');
        const grandTotal = document.getElementById('grand-total');

        const terminPayment = document.getElementById('termin-payment');

        const paymentStatus = document.getElementById('payment-status');
        const status = document.getElementById('status');
        const itemContent = document.getElementById('item-form');

        grandTotal.disabled = true;
        subtotal.disabled = true;

        setupItemCalculation(itemContent);

        taxAmount.addEventListener('input', function () {
            calculateGrandTotal();
        });

        discountAmount.addEventListener('input', function () {
            calculateGrandTotal();
        });

        shippingCost.addEventListener('input', function () {
            calculateGrandTotal();
        })

        const clientId = getClientIdFromUrl();
        const poData = await fetchPoClient(clientId);

        let poIdOption = '';
        poData.forEach(item => {
            poIdOption += `<option value="${item.id}">${item.po_number}</option>`;
        });

        poIdSelect.innerHTML = `
            <option value="">Select Purchase Order</option>
            ${poIdOption}
        `;

        let sender = [];

        poIdSelect.addEventListener('change', async function () {
            itemContent.innerHTML = '';
            no = 1;

            if (!poIdSelect.value) {
                calculateTotals();
                return;
            }

            try {
                if (typeof fetchPoDetail === 'function') {
                    const response = await fetchPoDetail(poIdSelect.value);
                    const poItems = response.poItems;
                    const company = response.company;
                    const poData = response.poData;

                    title.value = poData.title;
                    sender = {
                        sender_name: company.nama,
                        sender_address: `${company.alamat} ${company.kota}`,
                        sender_phone: company.nomor_telepon,
                        sender_email: company.email
                    }

                    for (const item of poItems) {
                        const element = renderItemInput(item.item_description ?? "", item.quantity ?? 0, item.unit ?? "", item.unit_price ?? 0, item.total_price ?? 0);
                        itemContent.append(element);
                    }
                }
                calculateTotals();
            } catch (err) {
                console.error(err);
            }
        });

        const addItems = document.getElementById('add-items');
        addItems.addEventListener('click', function () {
            const element = renderItemInput();
            itemContent.append(element);
            calculateTotals();
        });

        invoiceForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const clientRes = await fetchClientData(clientId);
            const client = clientRes.client;

            const invoiceData = {
                ...sender,
                client_id: clientId,
                title: title.value,
                source_id: poIdSelect.value,
                source_type: invSourceType.poClient,
                issue_date: issueDate.value,
                due_date: dueDate.value,
                tax_amount: taxAmount.value,
                shipping_cost: shippingCost.value,
                discount_amount: discountAmount.value,
                payment_status: paymentStatus.value,
                status: status.value,
                receiver_name: client.company_name,
                receiver_address: client.address,
                receiver_phone: client.company_number,
                receiver_email: client.company_email,
                termin_payment: terminPayment.value,
            };

            const invoiceItems = [];
            const rows = document.querySelectorAll('.purchase_order-row');
            rows.forEach(row => {
                const itemId = row.querySelector('.item-id')?.value || null;
                const itemDescription = row.querySelector('.item-description').value;
                const quantity = parseFloat(row.querySelector('.quantity').value) || 0;
                const unit = row.querySelector('.item-unit').value || null;
                const unitPrice = parseFloat(row.querySelector('.unit-price').value) || 0;
                const totalPrice = parseFloat(row.querySelector('.total-price').value) || 0;

                invoiceItems.push({
                    item_id: itemId,
                    item_description: itemDescription,
                    quantity: quantity,
                    unit: unit,
                    unit_price: unitPrice,
                    total_price: totalPrice
                });
            });

            const payload = {
                invoiceData,
                invoiceItems
            };

            try {
                const response = await post(apiEndpoints.invoices, payload);
                if (response.success === true) {
                    alert(response.message);
                    window.location.reload();
                }
            } catch (err) {
                alert(err);
                console.error(err);
            }
        });
    });

    const invoiceDetails = document.getElementById('invoice-details');

    invoiceDetails.addEventListener('click', async (event) => {
        const addTerminBtn = event.target.closest('.add-termin');

        if (!addTerminBtn) return;

        overlay.classList.add('show');
        tab.classList.add('show');

        tabTitle.textContent = 'Add Invoice Termin';

        const row = event.target.closest('tr.inv-row');

        const invoiceId = row.dataset.id;

        const response = await fetchInvoiceDetail(invoiceId);
        const invoice = response.invoiceData;
        const items = response.invoiceItems;
        const termin = response.invoiceTermin;
        console.log(response);

        const originalRemain = parseFloat(termin.remain_payment) || 0;

        tabContent.innerHTML = `
            <form id="invoice-add-termin">
                <div class="row m-2">
                    <div class="col-6">
                        <label>Termin Group</label>
                        <input type="number" id="termin-group-id" class="form-control" placeholder="Termin Number" value="${invoice.termin_group_id}" disabled required>
                    </div>
                    <div class="col-6">
                        <label>Termin Number</label>
                        <input type="number" id="termin-number" class="form-control" placeholder="Termin Number" value="${termin.termin_number + 1}" disabled required>
                    </div>
                </div>
                <div class="row m-2">
                    <div class="col-6">
                        <label>Termin Payment</label>
                        <input type="number" id="termin-payment" class="form-control" placeholder="Termin Payment" min="0" value=0 required>
                    </div>
                    <div class="col-6">
                        <label>Remain Payment</label>
                        <input type="number" id="remain-payment" class="form-control" placeholder="Remain Payment" value="${originalRemain.toFixed(2)}" data-original-remain="${originalRemain}" disabled required>
                    </div>
                </div>
                <div class="row m-2">
                    <div class="col-6">
                        <label>Issue Date</label>
                        <input type="date" id="issue-date" class="form-control" placeholder="Issue Date" value="${new Date().toLocaleDateString('en-CA')}" required>
                    </div>
                    <div class="col-6">
                        <label>Due Date</label>
                        <input type="date" id="due-date" class="form-control" placeholder="Due Date" required>
                    </div>
                </div>
                <div class="row m-2">
                    <div class="col-12 d-flex justify-content-center">
                        <button type="submit" class="btn btn-primary">Save</button>
                    </div>
                </div>
            </form>
        `;

        const terminAdd = document.getElementById('invoice-add-termin');
        const terminGroupId = document.getElementById('termin-group-id');
        const terminNumber = document.getElementById('termin-number');
        const terminPaymentInput = document.getElementById('termin-payment');
        const issueDate = document.getElementById('issue-date');
        const dueDate = document.getElementById('due-date');

        terminPaymentInput.addEventListener('input', function () {
            calculateRemainPaymentTermin()
        });

        terminAdd.addEventListener('submit', async (e) => {
            e.preventDefault();

            const invoiceData = {
                issue_date: issueDate.value,
                due_date: dueDate.value,
                termin_payment: terminPaymentInput.value,
                termin_group_id: invoice.termin_group_id
            }

            const payload = {
                invoiceData,
                invoiceItems: items
            }
            console.log(payload);

            try{
                const response = await post(apiEndpoints.invoices, payload);
                if(response.success){
                    alert(response.message);
                    window.location.reload();
                }
            }catch(err){
                alert(err)
                console.log(err);
            }
        })

        calculateRemainPaymentTermin();
    });

    if (closeTab) {
        closeTab.addEventListener("click", () => {
            overlay.classList.remove("show");
            tab.classList.remove("show");
        });
    }
});