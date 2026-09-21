import { get, apiEndpoints } from "../../../shared/api.js";
import { fetchInvoiceDetail } from "./invoice.data.js";

document.addEventListener('DOMContentLoaded', () => {
    const getInvoiceIdFromUrl = () => {
        const path = window.location.pathname;
        const parts = path.split("/");
        return parts[parts.length - 1];
    };

    async function renderInvoice(){
        const invoiceId = getInvoiceIdFromUrl();
        const response = await fetchInvoiceDetail(invoiceId);
        const invoiceData = response.invoiceData;
        const invoiceItems = response.invoiceItems;
        const invoiceTermin = response.invoiceTermin;
        console.log(response);

        const invoiceNumber = document.getElementById('invoice-number');
        const revisionNumber = document.getElementById('revision-number');
        const invoiceDate = document.getElementById('invoice-date');

        const senderName = document.getElementById('sender-name');
        const senderAddress = document.getElementById('sender-address');
        const senderPhone = document.getElementById('sender-phone');
        const senderEmail = document.getElementById('sender-email');

        const receiverName = document.getElementById('receiver-name');
        const receiverAddress = document.getElementById('receiver-address');
        const receiverPhone = document.getElementById('receiver-phone');

        const itemDisplay = document.getElementById('item-display');

        invoiceNumber.textContent = invoiceData.invoice_number;
        revisionNumber.textContent = invoiceData.revisoion_number ?? '-';
        invoiceDate.textContent = new Date(invoiceData.issue_date).toLocaleDateString('id-ID');

        senderName.textContent = invoiceData.sender_name;
        senderAddress.textContent = invoiceData.sender_address;
        senderPhone.textContent = invoiceData.sender_phone;
        senderEmail.textContent = invoiceData.sender_email;

        receiverName.textContent = invoiceData.receiver_name;
        receiverAddress.textContent = invoiceData.receiver_address;
        receiverPhone.textContent = invoiceData.receiver_phone;

        let tableRowHTML = '';
        let no = 1;
        invoiceItems.forEach(item => {
            tableRowHTML += `
                <tr class="border-bottom">
                    <td>${no++}</td>
                    <td>${item.item_description}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unit}</td>
                    <td>${item.unit_price}</td>
                    <td>${item.total_price}</td>
                </tr>
            `;
        })

        itemDisplay.innerHTML = `
            ${tableRowHTML}
            <tr>
                <td colspan="4"></td>
                <td class="border fw-bold">SubTotal:</td>
                <td class="border">${invoiceData.subtotal}</td>
            </tr>
            <tr>
                <td colspan="4"></td>
                <td class="border fw-bold ">Termin-${invoiceTermin.termin_number}</td>
                <td class="border text-success">${invoiceTermin.termin_payment}</td>
            </tr>
            <tr>
                <td colspan="4"></td>
                <td class="border fw-bold">Grand Total</td>
                <td class="border">${invoiceData.grand_total}</td>
            </tr>
            <tr>
                <td colspan="4"></td>
                <td class="border fw-bold">Remain Payment</td>
                <td class="border fw-bold text-danger">${invoiceTermin.remain_payment}</td>
            </tr>
        `;
    }

    renderInvoice();
})