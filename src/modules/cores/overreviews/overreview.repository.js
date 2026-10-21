const pool = require('../../../config/db');

exports.countProjectsStatus = async () => {
    const query = `
        SELECT 
            COUNT(*) AS project_total,
            SUM(status = 'DRAFT') AS project_draft,
            SUM(status = 'ON_RUNNING') AS project_running,
            SUM(status = 'COMPLETED') AS project_completed,
            SUM(status = 'CANCELLED') AS project_cancelled
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