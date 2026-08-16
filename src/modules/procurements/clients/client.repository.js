const pool = require('../../../config/db');

exports.findClientsById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM clients WHERE id = ?', [id]);
    return rows[0];
}

exports.findAllClients = async () => {
    const [rows] = await pool.execute(
        `SELECT 
            c.*,
            p.*
            i.name AS industry_name
        FROM clients c
        LEFT JOIN industries i ON c.industry_id = i.id`
    );
    return rows;
}

exports.findPicClient = async (clientId) => {
    const [rows] = await pool.execute('SELECT * FROM client_contacts WHERE client_id = ?', [clientId]);
    return rows;
}

exports.findAllIndustries = async () => {
    const [rows] = await pool.execute('SELECT * FROM industries');
    return rows;
}

exports.addClients = async (clientData, connection = pool) => {
    const { client_code, company_name, industry_id, pic_name, email, telephone_number, address, status } = clientData;
    await connection.execute(
        'INSERT INTO clients (client_code, company_name, industry_id, company_email, company_number, address, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [client_code, company_name, industry_id, pic_name, email, telephone_number, address, status]
    )
}