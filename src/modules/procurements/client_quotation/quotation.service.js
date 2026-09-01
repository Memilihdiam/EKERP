const pool = require('../../../config/db');
const redisClient = require('../../../config/redis');
const { httpStatus, typeLetter } = require('../../../utils/util');
const { letterCode } = require('../../../utils/code-generator');
const repository = require('./quotation.repository');
const letterService = require('../../cores/letter/letter.service');

exports.getQuotByIdForRfq = async (quotationId) => {
    if(!quotationId){
        const error = new Error('Attribute Id Null');
        error.StatusCode = httpStatus.badRequest;
        throw error;
    }

    const cachedKey = `quot:${quotationId}`;
    const cachedEx = 3600;
    try{
        const cacheData = await redisClient.get(cachedKey);
        if(cacheData){
            return JSON.parse(cacheData);
        }

        const quotation = await repository.findQuotByIdForRfq(quotationId);
        if(!quotation){
            const error = new Error('Quotation With Id Not Found');
            error.statusCode = httpStatus.notFound;
            throw error;
        }
        const quotItem = await repository.findQuotItem(quotationId);
        if(quotItem.length === 0){
            quotItem = [];
        }

        const result = {
            quotation, quotItem
        }

        await redisClient.set(cachedKey, JSON.stringify(result), 'EX', cachedEx);
        return result;
    }catch(err){
        throw err;
    }
}

exports.getQuotByClient = async (clientId) => {
    if(!clientId){
        const error = new Error('Attribute Id Null');
        error.statusCode = httpStatus.badRequest;
        throw error;
    }

    const cachedKey = `client-quot:${clientId}`;
    const cachedEx = 3600;
    try{
        const cacheData = await redisClient.get(cachedKey);
        if(cacheData){
            return { quotation: JSON.parse(cacheData) };
        }

        const quotation = await repository.findQuotByClient(clientId);
        if(quotation.length === 0){
            return { quotation : [] };
        }

        await redisClient.set(cachedKey, JSON.stringify(quotation), 'EX', cachedEx);
        return { quotation };
    }catch(err){
        throw err;
    }
}

exports.addQuotForRfq = async (quotData, itemData) => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const type = typeLetter.sph;

    if(!quotData || !itemData){
        const error = new Error("Field Can't Be Null");
        error.statusCode = httpStatus.badRequest;
        throw error;
    }

    let connection;
    try{
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const sequence = await letterService.letterSequence(type, month, year, connection);
        if (!quotData.quotation_number) {
            const code = await letterService.letterCode(type);
            quotData.quotation_number = await letterCode(code, month, year, sequence);
        }

        const quotId = await repository.addQuotForRfq(quotData, connection);
        if(itemData && itemData.length > 0){
            await repository.addQuotItem(itemData, quotId, connection);
        }

        await letterService.addSequence(type, month, year, sequence + 1, connection);

        await connection.commit();
        await redisClient.del(`client-quot:${quotData.client_id}`)
    }catch(err){
        if(connection) await connection.rollback();
        throw err;
    }finally{
        if(connection) connection.release();
    }
}