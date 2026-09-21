const pool = require('../../../config/db');

exports.getAllInvoices = async () => {
    const [rows] = await pool.execute('SELECT * FROM invoices');
    return rows;
}

exports.getInvoicesClients = async (clientId) => {
    const query = `
        SELECT
            i.*,
            c.company_name AS client_name,
            e.name
        FROM invoices i
        LEFT JOIN clients c ON i.client_id = c.id
        LEFT JOIN employees e ON i.created_by = e.id
        WHERE c.id = ? AND NOT i.status = 'DORMANT'
    `;
    const [rows] = await pool.execute(query, [clientId]);
    return rows;
}

exports.getInvoicesDetail = async (invoiceId) => {
    const query = `
        SELECT
            i.*,
            c.id AS client_id_ref,
            c.company_name AS client_name,
            e.name
        FROM invoices i
        LEFT JOIN clients c ON i.client_id = c.id
        LEFT JOIN employees e ON i.created_by = e.id
        WHERE i.id = ?
    `;
    const [rows] = await pool.execute(query, [invoiceId]);
    return rows[0];
}

exports.getInvoiceItems = async (invoiceId) => {
    const [rows] = await pool.execute('SELECT * FROM invoice_items WHERE invoice_id = ?', [invoiceId]);
    return rows;
}

// Ambil item berdasarkan Root Invoice ID (termin_group_id)
exports.getInvoiceItemsByGroup = async (terminGroupId) => {
    const [rows] = await pool.execute(
        'SELECT * FROM invoice_items WHERE invoice_id = ?', 
        [terminGroupId]
    );
    return rows;
}   

/**
 * Kunci baris root invoice untuk mencegah race condition pada termin_group_id yang sama.
 */
exports.lockRootInvoice = async (terminGroupId, connection) => {
    const query = `
        SELECT * 
        FROM invoices 
        WHERE id = ? 
        FOR UPDATE
    `;
    const [rows] = await connection.execute(query, [terminGroupId]);
    return rows[0];
}

/**
 * Ambil termin terakhir dari kelompok termin ini secara locked.
 */
exports.getLastTerminByGroup = async (terminGroupId, connection = pool) => {
    const query = `
        SELECT 
            t.id,
            t.invoice_id,
            t.termin_number,
            t.termin_payment,
            t.remain_payment,
            i.status AS invoice_status
        FROM invoice_termins t
        INNER JOIN invoices i ON t.invoice_id = i.id
        WHERE i.termin_group_id = ? AND i.status != 'CANCELLED'
        ORDER BY t.termin_number DESC
        LIMIT 1
        FOR UPDATE
    `;
    const [rows] = await connection.execute(query, [terminGroupId]);
    return rows[0];
}

/**
 * Ubah status invoice lama menjadi DORMANT jika diperlukan.
 */
exports.updateInvoiceStatus = async (invoiceId, status, connection) => {
    await connection.execute('UPDATE invoices SET status = ? WHERE id = ?', [status, invoiceId]);
}

exports.addInvoices = async (invoiceData, connection = pool) => {
    const { 
        created_by, title, invoice_number, source_id, source_type, client_id, vendor_id, 
        receiver_name, receiver_address, receiver_phone, receiver_email, sender_name, 
        sender_address, sender_phone, sender_email, issue_date, due_date, subtotal, 
        tax_amount, shipping_cost, discount_amount, grand_total, payment_status, status, termin_group_id, 
        origin_id, previous_id 
    } = invoiceData;

    const query = `
        INSERT INTO invoices (
            created_by, title, invoice_number, source_id, source_type, client_id, vendor_id, 
            receiver_name, receiver_address, receiver_phone, receiver_email, sender_name, 
            sender_address, sender_phone, sender_email, issue_date, due_date, subtotal, 
            tax_amount, shipping_cost, discount_amount, grand_total, payment_status, status, termin_group_id, 
            origin_id, previous_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [rows] = await connection.execute(query, [
        created_by, title, invoice_number, source_id, source_type, client_id ?? null, 
        vendor_id ?? null, receiver_name, receiver_address, receiver_phone, receiver_email, 
        sender_name, sender_address, sender_phone, sender_email, issue_date, due_date, 
        subtotal, tax_amount, shipping_cost, discount_amount, grand_total, payment_status, status, 
        termin_group_id ?? null, origin_id ?? null, previous_id ?? null
    ]);
    
    const invoiceId = rows.insertId;

    if (!termin_group_id) {
        await connection.execute('UPDATE invoices SET termin_group_id = ? WHERE id = ?', [invoiceId, invoiceId]);
    }

    return invoiceId;
}

exports.addItems = async (invoiceId, invoiceItems, connection = pool) => {
    const query = `INSERT INTO invoice_items (invoice_id, item_description, quantity, unit, unit_price, total_price) VALUES ?`;
    const values = invoiceItems.map(item => [
        invoiceId,
        item.item_description,
        item.quantity,
        item.unit,
        item.unit_price,
        item.total_price
    ]);
    
    await connection.query(query, [values]);
}

exports.addTermin = async (invoiceId, number, payment, remain, connection = pool) => {
    console.log(`${invoiceId}, ${number}, ${payment}, ${remain}`)
    await connection.execute('INSERT INTO invoice_termins (invoice_id, termin_number, termin_payment, remain_payment) VALUES (?, ?, ?, ?)', [invoiceId, number, payment, remain]);
}