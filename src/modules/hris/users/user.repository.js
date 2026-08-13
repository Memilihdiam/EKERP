const pool = require('../../../config/db');

exports.findUserByEmployeeCode = async (userId) => {
    const query = `
        SELECT
            e.id,
            e.name,
            e.employee_code,
            e.gender,
            e.address,
            e.date_of_birth,
            e.email,
            e.telephone_number,
            e.bank_name,
            e.account_number,
            e.join_date,
            e.password,
            e.image_path,
            dp.position_name AS position_name,
            d.department_name,
            es.status_name,
            r.role_name,
            pt.name AS ptkp_status
        FROM employees e
        LEFT JOIN department_position dp ON dp.id = e.position_id
        LEFT JOIN positions p ON p.id = dp.position_id
        LEFT JOIN departments d ON d.id = dp.department_id
        LEFT JOIN employee_employment_status ees ON ees.employee_id = e.id
        LEFT JOIN employment_status es ON es.id = ees.status_id
        LEFT JOIN ptkp_status pt ON pt.id = e.ptkp_id
        LEFT JOIN employee_roles er ON er.employee_id = e.id
        LEFT JOIN roles r ON r.id = er.role_id
        WHERE e.employee_code = ?
    `;
    const [rows] = await pool.execute(query, [userId]);
    return rows[0];
}