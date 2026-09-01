import { fetchQuotbyId } from "./quotation.data.js";

document.addEventListener('DOMContentLoaded', () => {

    // --- UTILITY FUNCTIONS ---
    const formatCurrency = (val) => {
        return 'Rp ' + new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(val || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const getQuotIdFromUrl = () => {
        const path = window.location.pathname;
        const parts = path.split('/');
        return parts[parts.length - 1];
    };

    // --- RENDER FUNCTION ---
    async function renderData() {
        const quotId = getQuotIdFromUrl();

        try {
            // Fetch data using our mock function
            const data = await fetchQuotbyId(quotId);

            const quotDetail = data.quotation;
            const quotItems = data.quotItem;

            // 1. Render Quotation Header Info
            document.getElementById('quot-title').innerText = quotDetail.title || 'QUOTATION';
            document.getElementById('quot-number').innerText = quotDetail.quotation_number || '-';
            document.getElementById('quot-date-place').innerText = `Jakarta, ${formatDate(quotDetail.quotation_date)}`;

            // 2. Render Client Data
            const clientName = quotDetail.client || 'Valued Client';
            document.getElementById('client-name').innerText = clientName;
            document.getElementById('client-name-body').innerText = clientName;
            document.getElementById('client-address').innerText = quotDetail.client_address || '';

            // 3. Render Calculation Summary
            document.getElementById('quot-subtotal').innerText = formatCurrency(quotDetail.subtotal);

            // Show discount with minus sign if it exists
            const discountText = quotDetail.discount_amount > 0 ?
                `- ${formatCurrency(quotDetail.discount_amount)}` :
                formatCurrency(0);
            document.getElementById('quot-discount').innerText = discountText;

            document.getElementById('quot-tax').innerText = formatCurrency(quotDetail.tax_amount);
            document.getElementById('quot-shipping').innerText = formatCurrency(quotDetail.shipping_cost);
            document.getElementById('quot-grand-total').innerText = formatCurrency(quotDetail.grand_total);

            // 4. Render Terms & Conditions
            if (quotDetail.payment_terms) {
                document.getElementById('payment-terms-text').innerText = quotDetail.payment_terms;
            }
            if (quotDetail.delivery_terms) {
                document.getElementById('delivery-terms-text').innerText = quotDetail.delivery_terms;
            }

            // 5. Render Table Items & Specifications
            const itemsContainer = document.getElementById('quotation-items-body');
            const specsContainer = document.getElementById('item-specifications');

            itemsContainer.innerHTML = '';
            specsContainer.innerHTML = '';

            if (quotItems && quotItems.length > 0) {
                quotItems.forEach((item, index) => {
                    // Build Table Row
                    const row = document.createElement('tr');
                    row.innerHTML = `
                                <td class="text-center">${index + 1}</td>
                                <td class="fw-medium">${item.item_description}</td>
                                <td class="text-center">${parseFloat(item.quantity)}</td>
                                <td class="text-center">${item.unit}</td>
                                <td class="text-end">${formatCurrency(item.unit_price)}</td>
                                <td class="text-end fw-medium">${formatCurrency(item.total_price)}</td>
                            `;
                    itemsContainer.appendChild(row);

                    // Build Specification List
                    if (item.specification) {
                        const specItem = document.createElement('div');
                        specItem.classList.add('mb-2');
                        specItem.innerHTML = `<span class="fw-bold text-dark">${item.item_description}:</span> <br> ${item.specification}`;
                        specsContainer.appendChild(specItem);
                    }
                });
            } else {
                // Empty state handling
                itemsContainer.innerHTML = `<tr><td colspan="6" class="text-center py-3">No items found for this quotation.</td></tr>`;
                specsContainer.innerHTML = '<i>No specific details provided.</i>';
            }
        } catch (error) {
            console.error("Failed to load quotation data:", error);
            // Minimal error handling instead of alert()
            document.getElementById('quot-title').innerText = "ERROR LOADING DATA";
        }
    }

    // Execute render
    renderData();

    document.getElementById('btn-print').addEventListener('click', () => {
        const element = document.querySelector('.a4-paper');
        const quotNumber = document.getElementById('quot-number').innerText || 'quotation';

        const opt = {
            margin:       10,
            filename:     `Quotation_${quotNumber}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Eksekusi pembuatan PDF dan auto download
        html2pdf().set(opt).from(element).save();
    });
});