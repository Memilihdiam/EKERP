const pool = require("../../../config/db");

exports.getDepartmentPosition = async () => {
    const query = `
    SELECT 
        p.*,
        d.*,
        dp.*    
    FROM department_position dp
    LEFT JOIN departments d ON dp.department_id = d.id
    LEFT JOIN positions p ON dp.position_id = p.id
    `;
    const [rows] = await pool.execute(query);
    return rows;
}

exports.getDepartmentCode = async (jobId, connection = pool) => {
    const query = `
    SELECT
        dp.id,
        d.id AS department_id,
        d.department_code
    FROM department_position dp
    JOIN departments d ON dp.department_id = d.id
    WHERE dp.id = ?
    `;
    const [rows] = await connection.execute(query, [jobId]);
    return rows[0];
}