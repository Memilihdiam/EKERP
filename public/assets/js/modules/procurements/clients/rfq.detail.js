import { fetchClientRfqDetail } from "./rfq.data.js";

document.addEventListener('DOMContentLoaded', () => {

    const tableInfo = document.getElementById('table-info');
    const tableItems = document.getElementById('table-items');
    
    const getRfqIdFromUrl = () => {
        const path = window.location.pathname;
        const parts = path.split('/');
        return parts[parts.length - 1];
    };

    async function renderRfqDetail(){
        const rfqId = getRfqIdFromUrl();
        const data = await fetchClientRfqDetail(rfqId);
        const rfqData = data.rfq;
        const rfqItem = data.rfqItems;
        console.log(data);

        document.getElementById('rfq-number').textContent = rfqData.rfq_number;
        tableInfo.innerHTML = `
            <tr>
                <td><strong>Title</strong></td>
                <td>${rfqData.title}</td>
            </tr>
            <tr>
                <td><strong>Client</strong></td>
                <td>${rfqData.client_name}</td>
            </tr>
            <tr>
                <td><strong>PIC (Internal)</strong></td>
                <td>${rfqData.person_responsible}</td>
            </tr>
            <tr>
                <td><strong>Description</strong></td>
                <td>${rfqData.description}</td>
            </tr>
            <tr>
                <td><strong>Submission Deadline</strong></td>
                <td>${new Date(rfqData.submission_deadline).toDateString('id-ID')}</td>
            </tr>
            <tr>
                <td><strong>Status</strong></td>
                <td>${rfqData.status}</td>
            </tr>
        `;

        let rowHTML = '';
        if(rfqItem.length === 0){
            rowHTML = '<tr><td colspan="6">No Have Item Requestedd</td></tr>'
        }else{
            rfqItem.forEach(item => {
                rowHTML += `
                    <tr>
                        <td>${item.item_id || '-'}</td>
                        <td>${item.item_description}</td>
                        <td>${item.specification}</td>
                        <td>${item.quantity} ${item.unit}</td>
                        <td>${new Date(item.requested_delivery_date).toLocaleDateString('id-ID')}</td>
                        <td>${item.notes}</td>
                    </tr>
                `;
            })
        }
        tableItems.innerHTML = rowHTML;
    }

    renderRfqDetail();
})