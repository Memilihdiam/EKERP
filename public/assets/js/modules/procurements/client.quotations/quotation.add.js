import { get, post, apiEndpoints } from "../../../shared/api.js";
import { fetchClientRfqs, fetchClientRfqDetail } from "../clients/rfq.data.js";

document.addEventListener("DOMContentLoaded", () => {
    const quotAdding = document.getElementById("quot-adding");
    const closeTab = document.getElementById("closeTab");
    const overlay = document.getElementById("pageOverlay");
    const tab = document.getElementById("adding-tab");
    const tabTitle = document.getElementById("tab-title");
    const tabContent = document.getElementById("tab-content");

    let rfq = [];
    let no = 1;

    const getClientIdFromUrl = () => {
        const path = window.location.pathname;
        const parts = path.split("/");
        return parts[parts.length - 1];
    };

    async function renderRfqId() {
        try {
            const clientId = getClientIdFromUrl();
            const data = await fetchClientRfqs(clientId);
            rfq = data || [];
        } catch (err) {
            console.error("Failed to load RFQ:", err);
            rfq = [];
        }
    }

    renderRfqId();

    function calculateDeliveryDays(date) {
        if (!date) return "";

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const deliveryDate = new Date(date);
        deliveryDate.setHours(0, 0, 0, 0);

        const diffTime = deliveryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return Math.max(0, diffDays);
    }

    function escapeHtml(value = "") {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function CreateElementHTML(
        itemId = "",
        rfqItemId = "",
        desc = "",
        spec = "",
        quantity = "",
        unit = "",
        deliveryDays = "",
        unitPrice = 0,
        discountAmount = 0,
        taxAmount = 0,
        note = ""
    ) {
        const div = document.createElement("div");
        div.classList.add("m-2", "border-top", "quotation-row");

        div.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mt-2">
                <label>Item ${no++}</label>
                <button type="button" class="btn btn-sm btn-danger remove-item">
                    Remove
                </button>
            </div>

            <input type="hidden"
                   class="rfq-item-id"
                   value="${escapeHtml(rfqItemId)}">

            <div class="row">
                <div class="col-md-12">
                    <label>Item</label>
                    <select class="item-id form-control">
                        <option value="">Select Item</option>
                    </select>
                </div>
            </div>

            <div class="row mt-2">
                <div class="col-md-6">
                    <label>Description</label>
                    <input
                        type="text"
                        class="item-description form-control"
                        placeholder="Item Description"
                        required
                        value="${escapeHtml(desc)}">
                </div>

                <div class="col-md-6">
                    <label>Specification</label>
                    <textarea
                        class="item-specification form-control"
                        placeholder="Item Specification"
                    >${escapeHtml(spec)}</textarea>
                </div>
            </div>

            <div class="row mt-2">
                <div class="col-md-6">
                    <label>Quantity</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        class="item-quantity form-control"
                        placeholder="Item Quantity"
                        required
                        value="${escapeHtml(quantity)}">
                </div>

                <div class="col-md-6">
                    <label>Unit</label>
                    <select class="item-unit form-control" required>
                        <option value="">Select Item Measure Unit</option>

                        <option value="pcs">Pieces (pcs)</option>
                        <option value="unit">Unit</option>
                        <option value="set">Set</option>
                        <option value="pair">Pair</option>
                        <option value="dozen">Dozen</option>

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

                        <option value="mg">Milligram (mg)</option>
                        <option value="g">Gram (g)</option>
                        <option value="kg">Kilogram (kg)</option>
                        <option value="ton">Metric Ton (ton)</option>

                        <option value="ml">Milliliter (ml)</option>
                        <option value="l">Liter (L)</option>
                        <option value="m3">Cubic Meter (m³)</option>

                        <option value="mm">Millimeter (mm)</option>
                        <option value="cm">Centimeter (cm)</option>
                        <option value="m">Meter (m)</option>
                        <option value="km">Kilometer (km)</option>

                        <option value="m2">Square Meter (m²)</option>

                        <option value="sheet">Sheet</option>
                        <option value="ream">Ream</option>
                        <option value="lot">Lot</option>
                        <option value="job">Job</option>
                        <option value="service">Service</option>
                    </select>
                </div>
            </div>

            <div class="row mt-2">
                <div class="col-md-3">
                    <label>Unit Price</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        class="unit-price form-control"
                        value="${escapeHtml(unitPrice)}">
                </div>

                <div class="col-md-3">
                    <label>Discount</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        class="item-discount form-control"
                        value="${escapeHtml(discountAmount)}">
                </div>

                <div class="col-md-3">
                    <label>Tax</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        class="item-tax form-control"
                        value="${escapeHtml(taxAmount)}">
                </div>

                <div class="col-md-3">
                    <label>Total Price</label>
                    <input
                        type="number"
                        step="0.01"
                        class="item-total-price form-control"
                        value="0"
                        readonly>
                </div>
            </div>

            <div class="row mt-2">
                <div class="col-md-6">
                    <label>Delivery Days</label>
                    <input
                        type="number"
                        min="0"
                        class="delivery-days form-control"
                        placeholder="Delivery Days"
                        value="${escapeHtml(deliveryDays)}">
                </div>

                <div class="col-md-6">
                    <label>Notes</label>
                    <textarea
                        class="note form-control"
                        placeholder="Note"
                    >${escapeHtml(note)}</textarea>
                </div>
            </div>
        `;

        const itemUnit = div.querySelector(".item-unit");
        itemUnit.value = unit;

        const unitPriceInput = div.querySelector(".unit-price");
        const quantityInput = div.querySelector(".item-quantity");
        const discountInput = div.querySelector(".item-discount");
        const taxInput = div.querySelector(".item-tax");
        const totalPriceInput = div.querySelector(".item-total-price");

        function calculateItemTotal() {
            const quantity = parseFloat(quantityInput.value) || 0;
            const unitPrice = parseFloat(unitPriceInput.value) || 0;
            const discount = parseFloat(discountInput.value) || 0;
            const tax = parseFloat(taxInput.value) || 0;

            const subtotal = quantity * unitPrice;

            const total = subtotal - discount + tax;

            totalPriceInput.value = Math.max(0, total).toFixed(2);

            calculateQuotationSummary();
        }

        [
            unitPriceInput,
            quantityInput,
            discountInput,
            taxInput
        ].forEach(input => {
            input.addEventListener("input", calculateItemTotal);
        });

        div.querySelector(".remove-item").addEventListener("click", () => {
            div.remove();
            calculateQuotationSummary();
        });

        calculateItemTotal();

        return div;
    }

    function calculateQuotationSummary() {
        const itemRows = document.querySelectorAll(".quotation-row");

        let subtotal = 0;
        let discountAmount = 0;
        let taxAmount = 0;

        itemRows.forEach(row => {
            const quantity =
                parseFloat(row.querySelector(".item-quantity")?.value) || 0;

            const unitPrice =
                parseFloat(row.querySelector(".unit-price")?.value) || 0;

            const discount =
                parseFloat(row.querySelector(".item-discount")?.value) || 0;

            const tax =
                parseFloat(row.querySelector(".item-tax")?.value) || 0;

            subtotal += quantity * unitPrice;
            discountAmount += discount;
            taxAmount += tax;
        });

        const shippingCost =
            parseFloat(
                document.getElementById("shipping-cost")?.value
            ) || 0;

        const grandTotal =
            subtotal -
            discountAmount +
            taxAmount +
            shippingCost;

        const subtotalElement =
            document.getElementById("quotation-subtotal");

        const discountElement =
            document.getElementById("quotation-discount");

        const taxElement =
            document.getElementById("quotation-tax");

        const grandTotalElement =
            document.getElementById("quotation-grand-total");

        if (subtotalElement) {
            subtotalElement.value = subtotal.toFixed(2);
        }

        if (discountElement) {
            discountElement.value = discountAmount.toFixed(2);
        }

        if (taxElement) {
            taxElement.value = taxAmount.toFixed(2);
        }

        if (grandTotalElement) {
            grandTotalElement.value = Math.max(0, grandTotal).toFixed(2);
        }
    }

    quotAdding.addEventListener("click", function () {
        overlay.classList.add("show");
        tab.classList.add("show");
        tab.style.maxWidth = '1000px';

        tabTitle.textContent = "Adding Quotation Client";

        no = 1;

        const today = new Date().toLocaleDateString("en-CA");

        tabContent.innerHTML = `
            <div class="m-1">
                <button type="button"
                        class="btn btn-primary"
                        id="add-items">
                    Add Items
                </button>
            </div>

            <form class="form-group" id="quotation-form">

                <div class="d-flex">
                    <div>
                        <!-- RFQ -->
                        <div class="row m-2">
                            <div class="col-md-12">
                                <label>RFQ</label>
                                <select class="form-control" id="rfq-id" required>
                                    <option value="">SELECT RFQ</option>
                                </select>
                            </div>
                        </div>

                        <!-- Project -->
                        <div class="row m-2">
                            <div class="col-md-12">
                                <label>Project ID</label>
                                <input
                                    type="number"
                                    class="form-control"
                                    id="project-id"
                                    placeholder="Project ID">
                            </div>
                        </div>

                        <!-- Title / Description -->
                        <div class="row m-2">
                            <div class="col-md-6">
                                <label>Quotation Title</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="quotation-title"
                                    placeholder="Quotation Title"
                                    required>
                            </div>

                            <div class="col-md-6">
                                <label>Description</label>
                                <textarea
                                    class="form-control"
                                    id="quotation-description"
                                    placeholder="Quotation Description"
                                ></textarea>
                            </div>
                        </div>

                        <!-- Date -->
                        <div class="row m-2">
                            <div class="col-md-6">
                                <label>Quotation Date</label>
                                <input
                                    type="date"
                                    class="form-control"
                                    id="quotation-date"
                                    value="${today}"
                                    required>
                            </div>

                            <div class="col-md-6">
                                <label>Valid Until</label>
                                <input
                                    type="date"
                                    class="form-control"
                                    id="quotation-deadline">
                            </div>
                        </div>

                        <!-- Status -->
                        <div class="row m-2">
                            <div class="col-md-12">
                                <label>Status</label>
                                <select class="form-control" id="quotation-status">
                                    <option value="DRAFT">Draft</option>
                                    <option value="SUBMITTED">Submitted</option>
                                    <option value="SENT">Sent</option>
                                    <option value="NEGOTIATION">Negotiation</option>
                                    <option value="ACCEPTED">Accepted</option>
                                    <option value="REJECTED">Rejected</option>
                                    <option value="EXPIRED">Expired</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div>
                        <!-- Summary -->
                        <div class="row m-2 border-top pt-3">
                            <div class="col-md-6">
                                <label>Subtotal</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    class="form-control"
                                    id="quotation-subtotal"
                                    value="0"
                                    readonly>
                            </div>

                            <div class="col-md-6">
                                <label>Discount Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    class="form-control"
                                    id="quotation-discount"
                                    value="0"
                                    readonly>
                            </div>
                        </div>

                        <div class="row m-2">
                            <div class="col-md-6">
                                <label>Tax Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    class="form-control"
                                    id="quotation-tax"
                                    value="0"
                                    readonly>
                            </div>

                            <div class="col-md-6">
                                <label>Shipping Cost</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    class="form-control"
                                    id="shipping-cost"
                                    value="0">
                            </div>
                        </div>

                        <div class="row m-2">
                            <div class="col-md-12">
                                <label>Grand Total</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    class="form-control"
                                    id="quotation-grand-total"
                                    value="0"
                                    readonly>
                            </div>
                        </div>

                        <!-- Terms -->
                        <div class="row m-2">
                            <div class="col-md-12">
                                <label>Payment Terms</label>
                                <textarea
                                    class="form-control"
                                    id="payment-terms"
                                    placeholder="Payment Terms"
                                ></textarea>
                            </div>
                        </div>

                        <div class="row m-2">
                            <div class="col-md-12">
                                <label>Delivery Terms</label>
                                <textarea
                                    class="form-control"
                                    id="delivery-terms"
                                    placeholder="Delivery Terms"
                                ></textarea>
                            </div>
                        </div>

                        <div class="row m-2">
                            <div class="col-md-12">
                                <label>Warranty Terms</label>
                                <textarea
                                    class="form-control"
                                    id="warranty-terms"
                                    placeholder="Warranty Terms"
                                ></textarea>
                            </div>
                        </div>

                        <div class="row m-2">
                            <div class="col-md-12">
                                <label>Notes</label>
                                <textarea
                                    class="form-control"
                                    id="quotation-notes"
                                    placeholder="Quotation Notes"
                                ></textarea>
                            </div>
                        </div>

                        
                    </div>
                </div>

                <!-- Items -->
                <div class="row m-2">
                    <div class="col-md-12">
                        <div id="item-form"
                             style="max-height:400px;overflow-y:auto;">
                        </div>
                    </div>
                </div>

                <!-- Submit -->
                <div class="row m-2">
                    <div class="col-md-12 d-flex justify-content-center">
                        <button
                            type="submit"
                            class="btn btn-primary">
                            Save
                        </button>
                    </div>
                </div>
            </form>
        `;

        // Populate RFQ
        const rfqSelect = document.getElementById("rfq-id");

        rfq.forEach(element => {
            const option = document.createElement("option");
            option.value = element.id;
            option.textContent = element.title;
            rfqSelect.appendChild(option);
        });

        const addItems = document.getElementById("add-items");
        const itemForm = document.getElementById("item-form");

        // Shipping cost affects grand total
        document
            .getElementById("shipping-cost")
            .addEventListener("input", calculateQuotationSummary);

        // RFQ selected
        rfqSelect.addEventListener("change", async () => {
            if (!rfqSelect.value) {
                return;
            }

            try {
                const detail = await fetchClientRfqDetail(
                    rfqSelect.value
                );

                const rfqDetail = detail.rfq;
                const rfqItems = detail.rfqItems || [];

                document.getElementById("quotation-title").value =
                    rfqDetail.title || "";

                document.getElementById("quotation-description").value =
                    rfqDetail.description || "";

                if (rfqDetail.submission_deadline) {
                    const date = new Date(
                        rfqDetail.submission_deadline
                    ).toLocaleDateString("en-CA");

                    document.getElementById(
                        "quotation-deadline"
                    ).value = date;
                }

                // Project dari RFQ jika tersedia
                if (rfqDetail.project_id) {
                    document.getElementById("project-id").value =
                        rfqDetail.project_id;
                }

                // Clear existing items
                itemForm.innerHTML = "";
                no = 1;

                for (const item of rfqItems) {
                    const deliveryDays =
                        calculateDeliveryDays(
                            item.requested_delivery_date
                        );

                    const element = CreateElementHTML(
                        item.item_id ?? "",
                        item.id ?? "",
                        item.item_description ?? "",
                        item.specification ?? "",
                        item.quantity ?? "",
                        item.unit ?? "",
                        deliveryDays,
                        0,
                        0,
                        0,
                        item.notes ?? ""
                    );

                    itemForm.append(element);
                }

                calculateQuotationSummary();

            } catch (err) {
                console.error("Failed to load RFQ detail:", err);
                alert("Failed to load RFQ detail.");
            }
        });

        // Add manual item
        addItems.addEventListener("click", () => {
            const div = CreateElementHTML();
            itemForm.append(div);

            calculateQuotationSummary();
        });

        // Submit quotation
        const quotationForm =
            document.getElementById("quotation-form");

        quotationForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const quotationData = {
                client_id: getClientIdFromUrl(),

                client_rfq_id:
                    document.getElementById("rfq-id").value || null,

                project_id:
                    document.getElementById("project-id").value || null,

                quotation_date:
                    document.getElementById("quotation-date").value,

                valid_until:
                    document.getElementById("quotation-deadline").value ||
                    null,

                title:
                    document.getElementById("quotation-title").value,

                description:
                    document.getElementById("quotation-description").value,

                subtotal:
                    parseFloat(
                        document.getElementById("quotation-subtotal").value
                    ) || 0,

                discount_amount:
                    parseFloat(
                        document.getElementById("quotation-discount").value
                    ) || 0,

                tax_amount:
                    parseFloat(
                        document.getElementById("quotation-tax").value
                    ) || 0,

                shipping_cost:
                    parseFloat(
                        document.getElementById("shipping-cost").value
                    ) || 0,

                grand_total:
                    parseFloat(
                        document.getElementById(
                            "quotation-grand-total"
                        ).value
                    ) || 0,

                payment_terms:
                    document.getElementById("payment-terms").value,

                delivery_terms:
                    document.getElementById("delivery-terms").value,

                warranty_terms:
                    document.getElementById("warranty-terms").value,

                notes:
                    document.getElementById("quotation-notes").value,

                status:
                    document.getElementById("quotation-status").value
            };

            const quotItem = [];

            const itemRows =
                itemForm.querySelectorAll(".quotation-row");

            itemRows.forEach(row => {
                const quantity =
                    parseFloat(
                        row.querySelector(".item-quantity").value
                    ) || 0;

                const unitPrice =
                    parseFloat(
                        row.querySelector(".unit-price").value
                    ) || 0;

                const discountAmount =
                    parseFloat(
                        row.querySelector(".item-discount").value
                    ) || 0;

                const taxAmount =
                    parseFloat(
                        row.querySelector(".item-tax").value
                    ) || 0;

                const totalPrice =
                    parseFloat(
                        row.querySelector(".item-total-price").value
                    ) || 0;

                const item = {
                    rfq_item_id:
                        row.querySelector(".rfq-item-id").value || null,

                    item_id:
                        row.querySelector(".item-id").value || null,

                    item_description:
                        row.querySelector(".item-description").value,

                    specification:
                        row.querySelector(".item-specification").value,

                    quantity,

                    unit:
                        row.querySelector(".item-unit").value,

                    unit_price: unitPrice,

                    discount_amount: discountAmount,

                    tax_amount: taxAmount,

                    total_price: totalPrice,

                    delivery_days:
                        parseInt(
                            row.querySelector(".delivery-days").value
                        ) || null,

                    notes:
                        row.querySelector(".note").value
                };

                quotItem.push(item);
            });

            const payload = {
                quotData: quotationData,
                quotItem
            };

            console.log("Quotation payload:", payload);

            try {
                const response = await post(
                    apiEndpoints.quotation,
                    payload
                );

                if (response.success) {
                    window.location.reload();
                } else {
                    alert(
                        response.message ||
                        "Failed to create quotation."
                    );
                }

            } catch (err) {
                console.error(err);
                alert(
                    err?.message ||
                    "Failed to create quotation."
                );
            }
        });
    });

    // Optional close tab
    if (closeTab) {
        closeTab.addEventListener("click", () => {
            overlay.classList.remove("show");
            tab.classList.remove("show");
        });
    }
});
