const pool = require('../../../config/db');

exports.findClientsById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM clients WHERE id = ?', [id]);
    return rows[0];
}

exports.findAllClients = async () => {
    const [rows] = await pool.execute(
        `SELECT 
            c.*,
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
    const { client_code, company_name, industry_id, email, telephone_number, address, status } = clientData; // email is company_email
    const [result] = await connection.execute(
        'INSERT INTO clients (client_code, company_name, industry_id, company_email, company_number, address, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [client_code, company_name, industry_id, email, telephone_number, address, status]
    );
    return result;
}

exports.addPicClient = async (picData, clientId, connection = pool) => {
    const { name, email, phone, whatsapp_number, status } = picData;
    await connection.execute(
        'INSERT INTO client_contacts (client_id, name, email, phone, whatsapp_number, status) VALUES (?, ?, ?, ?, ?, ?)',
        [clientId, name, email, phone, whatsapp_number, status || 'ACTIVE']
    );
}