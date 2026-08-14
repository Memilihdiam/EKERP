const pool = require('../../../config/db');

exports.findAllClients = async () => {
    const [rows] = await pool.execute(
        `SELECT 
            c.*,
            i.name AS industry_name
        FROM clients c
        JOIN industries i ON c.industry_id = i.id`
    );
    return rows;
}

exports.findAllIndustries = async () => {
    const [rows] = await pool.execute('SELECT * FROM industries');
    return rows;
}

exports.addClients = async (clientData, connection = pool) => {
    const { client_code, company_name, industry_id, pic_name, email, telephone_number, address, status } = clientData;
    await connection.execute(
        'INSERT INTO clients (client_code, company_name, industry_id, pic_name, email, telephone_number, address, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [client_code, company_name, industry_id, pic_name, email, telephone_number, address, status]
    )
}