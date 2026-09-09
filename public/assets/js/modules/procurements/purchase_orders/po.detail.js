import { fetchClientData } from '../clients/client.data.js';
import { fetchPoDetail } from './po.data.js';

document.addEventListener('DOMContentLoaded', () => {
    const getPoIdFromUrl = () => {
        const path = window.location.pathname;
        const parts = path.split('/');
        return parts[parts.length - 1];
    };

    // Helper untuk memformat angka menjadi mata uang (Rupiah)
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    async function renderPoDetail() {
        try {
            const poId = getPoIdFromUrl();
            const data = await fetchPoDetail(poId);

            // Destructure data sesuai skema database
            const company = data.company;
            const po = data.poData;
            const items = data.poItems;
            const vendor = data.vendor;
            const clientData = await fetchClientData(po.client_id);
            const client = clientData.client;


            // --- 2. RENDER PO META DATA ---
            document.getElementById('po-number-display').textContent = po.po_number;
            document.getElementById('date-display').textContent = new Date(po.po_date).toLocaleDateString('en-CA');

            const statusDisplay = document.getElementById('status-display');
            statusDisplay.textContent = po.status.replace(/_/g, ' ');

            // Ubah warna badge status
            if (po.status === 'Completed') statusDisplay.className = 'badge bg-success text-white';
            else if (po.status === 'Cancelled') statusDisplay.className = 'badge bg-danger text-white';
            else statusDisplay.className = 'badge bg-warning text-dark';

            // --- 3. RENDER VENDOR (RESIPIEN PO) ---

            // --- 4. RENDER SHIP TO (KONDISIONAL BERDASARKAN SOURCE TYPE) ---
            const shipToContainer = document.getElementById('shipto-display');
            if (po.source_type === 'client_quotations' && client) {
                // Eksternal: Kirim ke Client
                // --- RENDER HEADER (COMPANY / SENDER) ---
                document.getElementById('company-name-sender').textContent = client.company_name;
                document.getElementById('company-address-display').innerHTML = `
                ${client.address}<br>`
                // ${company.kelurahan}, ${company.kecamatan}<br>
                // ${company.kota}, ${company.provinsi} ${company.kode_pos}<br>
                // ${company.negara}`
                ;

                document.getElementById('phone-display').textContent = company.nomor_telepon;
                document.getElementById('email-display').textContent = company.email;

                document.getElementById('vendor-display').innerHTML = `
                    <h5 class="fw-bold mb-1">${company.nama}</h5>
                    <p class="mb-1 text-muted">${company.alamat}, ${company.kota}</p>
                    <p class="mb-0 text-muted"><strong>Email:</strong> ${company.email}</p>
                    <p class="mb-0 text-muted"><strong>Phone:</strong> ${company.nomor_telepon}</p>
                `;
                shipToContainer.innerHTML = `
                    <h5 class="fw-bold mb-1">${client.company_name} <span class="badge bg-info text-dark ms-2">Client</span></h5>
                    <p class="mb-1 text-muted">${client.address}</p>
                    <p class="mb-0 text-muted"><strong>Email:</strong> ${client.company_email}</p>
                    <p class="mb-0 text-muted"><strong>Phone:</strong> ${client.company_number}</p>
                `;
            } else {
                // Internal (purchase_requests): Kirim ke Gudang/Perusahaan Sendiri
                // --- RENDER HEADER (COMPANY) ---
                document.getElementById('company-name-sender').textContent = company.nama;
                document.getElementById('company-address-display').innerHTML = `
                ${company.alamat}<br>
                ${company.kelurahan}, ${company.kecamatan}<br>
                ${company.kota}, ${company.provinsi} ${company.kode_pos}<br>
                ${company.negara}`;

                document.getElementById('phone-display').textContent = company.nomor_telepon;
                document.getElementById('email-display').textContent = company.email;
                
                // --- RENDER CLIENT / RECEIVER
                shipToContainer.innerHTML = `
                    <h5 class="fw-bold mb-1">${company.nama} <span class="badge bg-secondary ms-2">Internal</span></h5>
                    <p class="mb-1 text-muted">${company.alamat}, ${company.kota}</p>
                    <p class="mb-0 text-muted"><strong>Email:</strong> ${company.email}</p>
                    <p class="mb-0 text-muted"><strong>Phone:</strong> ${company.nomor_telepon}</p>
                `;
            }

            // --- 5. RENDER DETAIL PENGIRIMAN & KONDISI ---
            document.getElementById('ship-detail').innerHTML = `
                <tr>
                    <td class="text-uppercase">${po.source_type.replace('_', ' ')}</td>
                    <td>${new Date(po.expected_delivery_date).toLocaleDateString('en-CA')}</td>
                    <td class="text-truncate" style="max-width: 250px;" title="${po.terms_and_conditions || '-'}">
                        ${po.terms_and_conditions || 'N/A'}
                    </td>
                </tr>
            `;

            // --- 6. RENDER PO ITEMS ---
            const itemList = document.getElementById('item-list');
            itemList.innerHTML = ''; // Kosongkan placeholder

            items.forEach((item, index) => {
                // Asumsi `item` memiliki relasi ke tabel items sehingga kita bisa mengambil nama/deskripsinya (e.g., item.item_name)
                const itemId = item.item_id ?? '-';
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="text-center">${index + 1}</td>
                    <td>
                        <span class="fw-bold">${item.item_name || 'Item ID: ' + itemId}</span>
                    </td>
                    <td class="text-center">${item.quantity}</td>
                    <td class="text-end">${formatCurrency(item.unit_price)}</td>
                    <td class="text-end fw-medium">${formatCurrency(item.total_price)}</td>
                `;
                itemList.appendChild(tr);
            });

            // --- 7. RENDER KALKULASI HARGA ---
            document.getElementById('subtotal-display').textContent = formatCurrency(po.subtotal);
            document.getElementById('tax-display').textContent = formatCurrency(po.tax_amount);
            document.getElementById('shipping-display').textContent = formatCurrency(po.shipping_cost);
            document.getElementById('grand-total-display').textContent = formatCurrency(po.grand_total);

        } catch (error) {
            console.error("Gagal merender detail PO:", error);
            // Implementasi error state pada UI jika diperlukan
        }
    }

    renderPoDetail();
});