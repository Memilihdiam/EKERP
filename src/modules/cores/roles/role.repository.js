const pool = require('../../../config/db');

exports.getRoles = async () => {
    const [rows] = await pool.execute('SELECT * FROM roles');
    return rows;
}

exports.addEmployeeRole = async (employeeId, roleId, connection) => {
    await connection.execute('INSERT INTO employee_roles (employee_id, role_id) VALUES (?, ?)', [employeeId, roleId]);
}