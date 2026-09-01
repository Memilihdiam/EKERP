const pool = require('../../../config/db');

exports.getLetterTypeByCode = async (letter_code) => {
    const [rows] = await pool.execute('SELECT * FROM type_letter WHERE letter_code = ?', [letter_code]);
    return rows[0];
}

exports.getSequenceLetter = async (letter_id, month, year, connection = pool) => {
    const [rows] = await connection.execute('SELECT MAX(sequence) AS max_sequence FROM sequence_of_letter WHERE type_letter = ? AND month_period = ? AND year_period = ? FOR UPDATE', [letter_id, month, year]);
    return rows[0];
}

exports.addSequence = async (type_letter, month, year, sequence, connection = pool) => {
    await connection.execute('INSERT INTO sequence_of_letter (type_letter, month_period, year_period, sequence) VALUE(?, ?, ?, ?)', [type_letter, month, year, sequence]);
}