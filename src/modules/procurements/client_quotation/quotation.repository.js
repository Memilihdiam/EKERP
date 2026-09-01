const pool = require('../../../config/db');

exports.findQuotByIdForRfq = async (quotId) => {
    const query = `
        SELECT
            q.*,
            c.id,
            c.company_name AS client,
            r.id,
            r.title
        FROM client_quotations q
        LEFT JOIN clients c ON q.client_id = c.id
        LEFT JOIN client_rfqs r ON q.client_rfq_id = r.id
        WHERE q.id = ?
    `;
    const [rows] = await pool.execute(query, [quotId]);
    return rows[0];
}

exports.findQuotByClient = async (clientId) => {
    const [rows] = await pool.execute('SELECT * FROM client_quotations WHERE client_id = ?', [clientId]);
    return rows;
}

exports.findQuotItem = async (quotId) => {
    const [rows] = await pool.execute('SELECT * FROM client_quotation_items WHERE quotation_id = ?', [quotId]);
    return rows;
}

exports.addQuotForRfq = async (quotData, connection = pool) => {
    console.log(quotData);
    const { 
        quotation_number, client_id, client_rfq_id, quotation_date, valid_until, title, description,
        subtotal, discount_amount, tax_amount, shipping_cost, grand_total, payment_terms, delivery_terms,
        warranty_terms, notes, status, created_by
    } = quotData;

    const query = `
        INSERT INTO client_quotations 
        (
            quotation_number, client_id, client_rfq_id, quotation_date, valid_until, title, description, 
            subtotal, discount_amount, tax_amount, shipping_cost, grand_total, payment_terms, delivery_terms,
            warranty_terms, notes, status, created_by
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
        const [rows] = await connection.execute(query, [quotation_number, client_id, client_rfq_id, quotation_date, valid_until, title, description, subtotal, discount_amount, tax_amount, shipping_cost, grand_total, payment_terms, delivery_terms, warranty_terms, notes, status, created_by])
        return rows.insertId;
}

exports.addQuotItem = async (itemData, quotId, connection = pool) => {
    const query = `
        INSERT INTO client_quotation_items (quotation_id, rfq_item_id, item_id, item_description, specification, quantity, unit, unit_price, discount_amount, tax_amount, total_price, delivery_days, notes)
        VALUES ?
    `;

    const values = itemData.map(item => [
        quotId,
        item.rfq_item_id, 
        item.item_id, 
        item.item_description, 
        item.specification, 
        item.quantity, 
        item.unit, 
        item.unit_price, 
        item.discount_amount, 
        item.tax_amount, 
        item.total_price, 
        item.delivery_days, 
        item.notes
    ]);
    
    await connection.query(query, [values]);
}
