const pool = require('../../../config/db');

// Fetch
exports.fetchAllRFQ = async () => {
    const [rows] = await pool.execute('SELECT * FROM client_rfqs');
    return rows;
}

exports.fetchRfqByClient = async (clientId) => {
    const query = `SELECT * FROM client_rfqs WHERE client_id = ?`;
    const [rows] = await pool.execute(query, [clientId]);
    return rows[0]
}

exports.fetchRfqItems = async (rfq_id) => {
    const query = `SELECT * FROM client_rfq_items WHERE client_rfq_id = ?`;
    const [rows] = await pool.execute(query, [rfq_id]);
    return rows;
}

// Add
exports.addRfq = async (rfqData, connection) => {
    const { rfq_number, client_id, rfq_date, submission_deadline, title, description, status, created_by } = rfqData;
    const query = `
        INSERT INTO client_rfqs 
            (rfq_number, client_id, rfq_date, submission_deadline, title, description, status, created_by) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await connection.execute(query, [rfq_number, client_id, rfq_date, submission_deadline, title, description, status, created_by]);
    return result.insertId;
}

exports.addRfqItems = async (items, rfqId, connection) => {
    const query = `
        INSERT INTO client_rfq_items
            (client_rfq_id, item_id, item_description, specification, quantity, unit, requested_delivery_date, notes)
        VALUES ?
    `;
    const values = items.map(item => [
        rfqId,
        item.item_id || null,
        item.item_description,
        item.specification,
        item.quantity, item.unit, item.requested_delivery_date, item.notes
    ]);
    await connection.query(query, [values]);
}