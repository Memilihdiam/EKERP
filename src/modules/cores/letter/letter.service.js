const pool = require('../../../config/db');
const { httpStatus } = require('../../../utils/util');
const repository = require('./letter.repository');

exports.letterCode = async (letter_code) => {
    if(!letter_code){
        const error = new Error('Not Found Letter Id');
        error.statusCode = httpStatus.badRequest;
        throw error;
    }

    const letter = await repository.getLetterTypeByCode(letter_code);
    return letter.letter_code;
}

exports.letterSequence = async (type, month, year, connection) => {
    if(!type || !month || !year){
        const error = new Error('Not Found Parameter');
        error.statusCode = httpStatus.badRequest;
        throw error;
    }
    const letterId = await repository.getLetterTypeByCode(type);
    const id = letterId.id;

    const row = await repository.getSequenceLetter(id, month, year, connection);
    return row.max_sequence ? row.max_sequence : 0;
}

exports.addSequence = async (type_letter, month, year, sequence, connection) => {
    if(!type_letter || !month || !year){
        const error = new Error('Not Found Parameter');
        error.statusCode = httpStatus.badRequest;
        throw error;
    }
    const letterId = await repository.getLetterTypeByCode(type_letter);
    const id = letterId.id;

    try{
        await repository.addSequence(id, month, year, sequence, connection);
    }catch(err){
        throw err;
    }
}