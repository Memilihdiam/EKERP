const pool = require('../../../config/db');

exports.latestTask = async () => {
    const query = `
    SELECT 
        p.project_code AS code, 
        p.project_name AS title, 
        c.company_name AS client, 
        p.start_date AS start, 
        p.end_date AS end, 
        p.status,
        DATEDIFF(p.start_date, CURDATE()) AS start_day_left,
        DATEDIFF(p.end_date, CURDATE()) AS end_day_left
    FROM projects p 
    JOIN clients c ON c.id = p.client_id
    WHERE p.status NOT IN ("Completed", "Cancelled")
        
    UNION ALL
        
    SELECT 
        o.po_number AS code, 
        o.title, 
        c.company_name AS client, 
        o.po_date AS start, 
        o.expected_delivery_date AS end, 
        o.status,
        DATEDIFF(o.po_date, CURDATE()) AS start_day_left,
        DATEDIFF(o.expected_delivery_date, CURDATE()) AS end_day_left
    FROM purchase_orders o 
    JOIN clients c ON c.id = o.client_id
    WHERE o.status NOT IN ("Completed", "Cancelled")
        
    ORDER BY end
    `

    const [rows] = await pool.execute(query);
    return rows;
}