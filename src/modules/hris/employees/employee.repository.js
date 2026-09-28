const pool = require('../../../config/db');

exports.getEmployeeList = async () => {
    const query = `
    SELECT
        e.*,
        d.department_name,
        p.position_name,
        s.status_name
    FROM employees e
    LEFT JOIN employee_employment_status ep ON ep.employee_id = e.id
    LEFT JOIN employment_status s ON ep.status_id = s.id
    LEFT JOIN department_position p ON e.position_id = p.id
    LEFT JOIN departments d ON p.department_id = d.id
    `;
    const [rows] = await pool.execute(query);
    return rows;
}

exports.getPtkpStatus = async () => {
    const [rows] = await pool.execute('SELECT * FROM ptkp_status');
    return rows;
}

exports.getEmployementStatus = async () => {
    const [rows] = await pool.execute('SELECT * FROM employment_status');
    return rows;
}

exports.findYearSequence = async (year, connection = pool) => {
    const [rows] = await connection.execute(`SELECT COALESCE(MAX(year_sequence_join), 0) + 1 AS next_year_seq FROM employees WHERE YEAR(join_date) = ?`, [year]);
    return rows[0];
}

exports.addEmployee = async (employeeData, connection = pool) => {
    const { employee_code, year_sequence_join, name, gender, address, date_of_birth, email, telephone_number, bank_name, account_number, 
        ptkp_id, join_date, position_id, password, image_path } = employeeData;
    const [rows] = await connection.execute(
        `INSERT INTO employees (
            employee_code, year_sequence_join, name, gender, address, date_of_birth, email, telephone_number, bank_name, account_number, ptkp_id, 
            join_date, position_id, password, image_path
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            employee_code, year_sequence_join, name, gender, address, date_of_birth, email, telephone_number, bank_name, account_number, ptkp_id, 
            join_date, position_id, password, image_path ?? null
        ]
    );

    return rows.insertId;
}

exports.employementStatus = async(status_id, employee_id, start_work, end_work, connection = pool) => {
    await connection.execute('INSERT INTO employee_employment_status (status_id, employee_id, start_work, end_work) VALUES (?, ?, ?, ?)', [status_id, employee_id, start_work, end_work]);
}