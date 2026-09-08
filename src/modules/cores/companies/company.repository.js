const pool = require('../../../config/db');

exports.getCompanyData = async () => {
    const [rows] = await pool.execute('SELECT * FROM company_data');
    return rows[0];
}