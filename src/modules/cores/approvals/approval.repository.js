const pool = require('../../../config/db');

exports.getClientProcurements = async () => {
    const query = `
        SELECT
            id,
            rfq_number AS number,
            title,
            'REQUEST OF QUOTATION' AS type,
            status,
            submission_deadline AS deadline
        FROM client_rfqs WHERE status NOT IN ("CLOSED", "EXPIRED")
        
        UNION ALL
        
        SELECT 
            id,
            quotation_number AS number,
            title,
            'QUOTATION' AS type,
            status,
            valid_until AS deadline
        FROM client_quotations WHERE status NOT IN ("ACCEPTED", "REJECTED", "EXPIRED", "CANCELLED")
        
        UNION ALL
        
        SELECT
            id,
            po_number AS number,
            title,
            'PURCHASE ORDERS' AS type,
            status,
            expected_delivery_date AS deadline
        FROM purchase_orders WHERE status NOT IN ("Completed", "Cancelled")
        
        ORDER BY deadline
    `
    const [rows] = await pool.execute(query);
    return rows
}