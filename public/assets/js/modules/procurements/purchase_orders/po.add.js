import { get, post, apiEndpoints } from "../../../shared/api.js";
import { fetchQuotbyId, fetchQuotClient } from "../client.quotations/quotation.data.js";

document.addEventListener('DOMContentLoaded', () => {
    const poAdding = document.getElementById('po-adding');
    const tab = document.getElementById('adding-tab');
    const tabContent = document.getElementById('tab-content');
    const tabTitle = document.getElementById('tab-title');
    const overlay = document.getElementById('pageOverlay');

    let no = 1;

    const getClientIdFromUrl = () => {
        const path = window.location.pathname;
        const parts = path.split("/");
        return parts[parts.length - 1];
    };

    function renderItemInput(itemId = '', itemDescription = '', quantity = 0, unitPrice = 0, totalPrice = 0) {
        const div = document.createElement('div');

        div.classList.add("m-2", "border-top", "po-row");

        div.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mt-2">
                <label>Item ${no++}</label>
                <button type="button" class="btn btn-sm btn-danger remove-item"> Remove</button>
            </div>

            <div class="row m-2">
                <div class="col-12">
                    <label class="form-label">Item Id</label>
                    <select class="form-control item-id">
                        <option value="${itemId}" selected>${itemId}</option>
                    </select>
                </div>
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
                    <label class="form-label">Unit Price</label>
                    <input type="number" class="form-control unit-price" min="0" step="any" required value="${unitPrice}">
                </div>
            </div>

            <div class="row m-2">
                <div class="col-12">
                    <label class="form-label">Total Price</label>
                    <input type="number" class="form-control total-price" min="0" step="any" readonly value="${totalPrice}">
                </div>
            </div>
        `;

        return div;
    }

    function calculateItemTotal(row) {
        const quantityInput = row.querySelector('.quantity');
        const unitPriceInput = row.querySelector('.unit-price');
        const totalPriceInput = row.querySelector('.total-price');

        const quantity = parseFloat(quantityInput.value) || 0;
        const unitPrice = parseFloat(unitPriceInput.value) || 0;
        const totalPrice = quantity * unitPrice;

        totalPriceInput.value = totalPrice.toFixed(2);
    }

    /*
     * Calculate subtotal
     */
    function calculateSubtotal() {
        const itemRows = document.querySelectorAll('.po-row');

        let subtotal = 0;

        itemRows.forEach(row => {
            calculateItemTotal(row);

            const totalPriceInput = row.querySelector('.total-price');

            subtotal += parseFloat(totalPriceInput.value) || 0;
        });

        return subtotal;
    }

    /*
     * Calculate grand total
     *
     * Grand Total =
     * Subtotal + Shipping Cost + Tax Amount
     */
    function calculateGrandTotal() {
        const subtotalInput = document.getElementById('subtotal');
        const shippingCostInput = document.getElementById('shipping-cost');
        const taxAmountInput = document.getElementById('tax-amount');
        const grandTotalInput = document.getElementById('grand-total');

        if (!subtotalInput || !shippingCostInput || !taxAmountInput || !grandTotalInput) {
            return;
        }

        const subtotal = parseFloat(subtotalInput.value) || 0;
        const shippingCost = parseFloat(shippingCostInput.value) || 0;
        const taxAmount = parseFloat(taxAmountInput.value) || 0;

        const grandTotal =
            subtotal +
            shippingCost +
            taxAmount;

        grandTotalInput.value = grandTotal.toFixed(2);
    }

    /*
     * Calculate semua total
     */
    function calculateTotals() {
        const subtotalInput = document.getElementById('subtotal');

        if (!subtotalInput) {
            return;
        }

        const subtotal = calculateSubtotal();

        subtotalInput.value = subtotal.toFixed(2);

        calculateGrandTotal();
    }

    /*
     * Event listener renddering input item dinamis
     */
    function setupItemCalculation(itemContent) {
        itemContent.addEventListener('input', function (e) {
            if (
                e.target.classList.contains('quantity') ||
                e.target.classList.contains('unit-price')
            ) {
                const row = e.target.closest('.po-row');

                if (row) {
                    calculateItemTotal(row);
                }

                calculateTotals();
            }
        });

        /*
         * Remove item
         */
        itemContent.addEventListener('click', function (e) {
            if (e.target.classList.contains('remove-item')) {
                const row = e.target.closest('.po-row');
                
                if (row) {
                    row.remove();
                }
                calculateTotals();
            }
        });
    }

    /*
     * Add Purchase Order
     */
    poAdding.addEventListener('click', async function () {

        overlay.classList.add('show');
        tab.classList.add('show');

        tabTitle.textContent = 'Add Purchase Orders Clients';

        tabContent.innerHTML = `
            <div class="m-1">
                <button type="button" class="btn btn-primary" id="add-items"> Add Items</button>
            </div>

            <form class="form-group" id="po-form">
                <div class="row m-2">
                    <div class="col-12">
                        <select class="form-control" id="quot-id"></select>
                    </div>
                </div>

                <div class="row m-2">
                    <div class="col-6">
                        <label>Purchase Order Date</label>
                        <input type="date" class="form-control" id="po-date" required>
                    </div>

                    <div class="col-6">
                        <label>Expected Delivery Date</label>
                        <input type="date" class="form-control" id="expected-date" required>
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
                        <label>Shipping Cost</label>
                        <input type="number" class="form-control" id="shipping-cost" placeholder="Shipping Cost" min="0" step="any" value="0" required>
                    </div>

                    <div class="col-6">
                        <label>Grand Total</label>
                        <input type="number" class="form-control" id="grand-total" placeholder="Grand Total" readonly required>
                    </div>
                </div>

                <div class="row m-2">
                    <div class="col-6">
                        <select class="form-control" id="status">
                            <option value="">Status</option>
                            <option value="Draft">Draft</option>
                            <option value="Sent">Sent</option>
                            <option value="On_Delivery">On Delivery</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div class="col-6">
                        <select class="form-control" id="payment-status">
                            <option value="">Payment Status</option>
                            <option value="Unpaid">Unpaid</option>
                            <option value="Partial">Partial</option>
                            <option value="Paid">Paid</option>
                        </select>
                    </div>
                </div>

                <div class="row m-2">
                    <div class="col-12">
                        <textarea class="form-control" id="terms-and-conditions" placeholder="Terms & Conditions" required></textarea>
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

        const poForm = document.getElementById('po-form');
        const quotIdSelect = document.getElementById('quot-id');
        const poDate = document.getElementById('po-date');
        const expectedDeliveryDate = document.getElementById('expected-date');
        const status = document.getElementById('status');
        const paymentStatus = document.getElementById('payment-status');
        const subTotal = document.getElementById('subtotal');
        const taxAmount = document.getElementById('tax-amount');
        const shippingCost = document.getElementById('shipping-cost');
        const grandTotal = document.getElementById('grand-total');
        const itemContent = document.getElementById('item-form');
        const termsConditions = document.getElementById('terms-and-conditions');

        /*
         * Setup event listener item
         */
        setupItemCalculation(itemContent);

        /*
         * Tax & Shipping berubah
         * => Grand Total langsung berubah
         */
        taxAmount.addEventListener('input', function () {
            calculateGrandTotal();
        });

        shippingCost.addEventListener('input', function () {
            calculateGrandTotal();
        });

        /*
         * Ambil quotation berdasarkan client
         */
        const clientId = getClientIdFromUrl();
        const quotData = await fetchQuotClient(clientId);

        let quotOption = '';
        console.log(quotData);
        quotData.forEach(item => {
            quotOption += `<option value="${item.id}">${item.title}</option>`;
        });

        quotIdSelect.innerHTML = `
            <option value="">SELECT Quotation</option>
            ${quotOption}
        `;

        quotIdSelect.addEventListener('change', async function (e) {
            e.preventDefault();

            itemContent.innerHTML = '';
            no = 1;
            
            if (!quotIdSelect.value) {
                calculateTotals();
                return;
            }

            try {
                const response = await fetchQuotbyId(quotIdSelect.value);
                const quotItem = response.quotItem || [];

                console.log(quotItem);

                for (const item of quotItem) {
                    const element = renderItemInput(item.item_id ?? "", item.item_description ?? "", item.quantity ?? 0, item.unit_price ?? 0, item.total_price ?? 0 );
                    itemContent.append(element);
                }

                /*
                 * Hitung ulang:
                 * item total
                 * subtotal
                 * grand total
                 */
                calculateTotals();

            } catch (err) {
                console.error(err);
            }
        });

        /*
         * Add item manual
         */
        const addItems = document.getElementById('add-items');
        addItems.addEventListener('click', function () {
            const element = renderItemInput();
            itemContent.append(element);
            calculateTotals();
        });

        poForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const poData = {
                client_id: getClientIdFromUrl(),
                source_id: quotIdSelect.value,
                po_date: poDate.value,
                expected_delivery_date: expectedDeliveryDate.value,
                subtotal: subTotal.value,
                tax_amount: taxAmount.value,
                shipping_cost: shippingCost.value,
                grand_total: grandTotal.value,
                status: status.value,
                payment_status: paymentStatus.value,
                terms_and_conditions: termsConditions.value
            }

            const poItems = [];

            const row = document.querySelectorAll('.po-row');
            row.forEach(row => {
                const itemId = row.querySelector('.item-id').value || null;
                const itemDescription = row.querySelector('.item-description').value;
                const quantity = parseFloat(row.querySelector('.quantity').value) || 0;
                const unitPrice = parseFloat(row.querySelector('.unit-price').value) || 0;
                const totalPrice = parseFloat(row.querySelector('.total-price').value) || 0;
                const item = {
                    item_id: itemId,
                    item_description: itemDescription,
                    quantity: quantity,
                    unit_price: unitPrice,
                    total_price: totalPrice,
                }

                poItems.push(item);
            })

            const payload = {
                poData,
                poItems
            }
            try{
                const response = await post(apiEndpoints.purchaseOrders, payload);
                if(response.ok){
                    alert(response.message);
                }
            }catch(err){
                alert(err);
                console.log(err);
            }
        })

    });

    if (closeTab) {
        closeTab.addEventListener("click", () => {
            overlay.classList.remove("show");
            tab.classList.remove("show");
        });
    }
});
