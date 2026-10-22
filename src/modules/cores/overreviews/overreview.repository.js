const pool = require('../../../config/db');

exports.countProjectsStatus = async () => {
    const query = `
        SELECT 
            COUNT(*) AS project_total,
            COALESCE(SUM(status = 'DRAFT'), 0) AS project_draft,
            COALESCE(SUM(status = 'ON_RUNNING'), 0) AS project_running,
            COALESCE(SUM(status = 'COMPLETED'), 0) AS project_completed,
            COALESCE(SUM(status = 'CANCELLED'), 0) AS project_cancelled
        FROM projects
    `;
    const [rows] = await pool.execute(query);
    return rows[0];
}

exports.countClientsStatus = async () => {
    const query = `
        SELECT
            COUNT(*) AS client_total,
            SUM(status = 'ACTIVE') AS client_active,
            SUM(status = 'INACTIVE') AS client_inactive
        FROM clients
    `;
    const [rows] = await pool.execute(query);
    return rows[0];
}

exports.valueClientProject = async () => {
    const query = `
        SELECT
            SUM(q.grand_total) as quotation_value,
            SUM(p.grand_total) as po_value
        FROM client_quotations q
        JOIN purchase_orders p
    `;
    const [rows] = await pool.execute(query);
    return rows[0];
}

exports.paymentInvoiceBasedStatus = async () => {
    const query = `
        SELECT
            SUM(CASE WHEN payment_status = 'PAID' THEN grand_total ELSE 0 END) AS paid_payment,
            SUM(CASE WHEN payment_status = 'PARTIAL' THEN grand_total ELSE 0 END) AS partial_payment,
            SUM(CASE WHEN payment_status = 'UNPAID' THEN grand_total ELSE 0 END) AS unpaid_payment
        FROM invoices
    `;
    const [rows] = await pool.execute(query);
    return rows[0];
}