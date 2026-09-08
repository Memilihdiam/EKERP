const pool = require('../../../config/db');

exports.getPoDetail = async (id) => {
    const query = `
        SELECT 
            p.*, 
            i.*,
            c.*
        FROM purchase_orders p 
        LEFT JOIN po_items i ON i.po_id = p.id 
        LEFT JOIN clients c ON p.client_id = c.id
        WHERE p.id = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
}

exports.getClientPo = async (id, source_type) => {
    const query = `
        SELECT
            p.*,
            c.company_name AS client_name
        FROM purchase_orders p
        JOIN clients c ON p.client_id = c.id
        WHERE c.id = ? AND p.source_type = ?
    `;
    const [rows] = await pool.execute(query, [id, source_type]);
    return rows;
}

exports.getPoItems = async (poId) => {
    const [rows] = await pool.execute('SELECT * FROM po_items WHERE po_id = ?', [poId]);
    return rows;
}

exports.addPo = async (poData, connection = pool) => {
    console.log(poData);
    const { po_number, source_type, source_id, project_id, client_id, vendor_id, created_by, po_date, expected_delivery_date, subtotal, tax_amount, shipping_cost, grand_total, status, payment_status, terms_and_conditions } = poData;
    
    const [rows] = await connection.execute(
        `INSERT INTO purchase_orders 
        (
            po_number, source_type, source_id, project_id, client_id, vendor_id, created_by, po_date, expected_delivery_date, subtotal, tax_amount, shipping_cost, grand_total, status, payment_status, terms_and_conditions
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [po_number, source_type, source_id, project_id ?? null, client_id ?? null, vendor_id ?? null, created_by, po_date, expected_delivery_date, subtotal, tax_amount, shipping_cost, grand_total, status, payment_status, terms_and_conditions]
    );
    return rows.insertId;
}

exports.addPoItems = async (poId, poItem, connection = pool) => {
    const query = `INSERT INTO po_items (po_id, item_id, item_description, quantity, unit_price, total_price) VALUES ?`;

    const values = poItem.map(item => [
        poId,
        item.item_id,
        item.item_description,
        item.quantity,
        item.unit_price,
        item.total_price
    ])
    await connection.query(query, [values]);
}
