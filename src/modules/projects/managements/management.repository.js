const pool = require('../../../config/db');

exports.findAllProjects = async () => {
    const [rows] = await pool.execute(`
        SELECT
            p.*,
            c.company_name,
            c.pic_name,
            c.email,
            c.telephone_number
        FROM projects p
        LEFT JOIN clients c ON p.client_id = c.id
    `)
    return rows;
}

exports.findProjectsById = async (id) => {
    const query = `
        SELECT
            p.*,
            c.company_name,
            c.pic_name,
            c.email,
            c.telephone_number
        FROM projects p
        LEFT JOIN clients c ON p.client_id = c.id
    `;

    const [rows] = await pool.execute(query, [id]);
    return rows[0];
}