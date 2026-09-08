const pool = require("../../../config/db");
const redisClient = require("../../../config/redis");
const { httpStatus, typeLetter, sourceType } = require("../../../utils/util");
const repository = require('./po.repository');
const letterService = require('../../cores/letter/letter.service');
const { letterCode } = require("../../../utils/code-generator");

exports.getClientPo = async (clientId) => {
    if(!clientId){
        const error = new Error('Attribute ID Null');
        error.statusCode = httpStatus.badRequest;
        throw error;
    }

    const cachedKey = `client-po:${clientId}`;
    const cachedEx = 3600;
    try{
        const cacheData = await redisClient.get(cachedKey);
        if(cacheData){
            return { poData: JSON.parse(cacheData) };
        }

        const poData = await repository.getClientPo(clientId, sourceType.poClient);
        if(poData.length === 0){
            return { poData: [] };
        }

        await redisClient.set(cachedKey, JSON.stringify(poData), 'EX', cachedEx);
        return { poData };
    }catch(err){
        throw err;
    }
}

exports.getDetailPo = async (poId) => {
    if(!poId){
        const error = new Error('Attribute ID Null');
        error.statusCode = httpStatus.badRequest;
        throw error;
    }

    const cachedKey = `detail-po:${poId}`;
    const cachedEx = 3600;
    try{
        const cacheData = await redisClient.get(cachedKey);
        if(cacheData){
            return JSON.parse(cacheData);
        }

        const poData = await repository.getPoDetail(poId);
        if(!poData){
            const error = new Error('Purchase Order Data Not Found');
            error.statusCode = httpStatus.notFound;
            throw error;
        }

        let poItems = await repository.getPoItems(poId);
        if(poItems.length === 0){
            poItems = [];
        }

        const result = {
            poData,
            poItems
        };

        await redisClient.set(cachedKey, JSON.stringify(result), 'EX', cachedEx);
        return result;
    }catch(err){
        throw err;
    }
}

exports.addClientPo = async (poData, poItems) => {
    if(!poData || !poItems){
        const error = new Error("Field Can't Be Null");
        error.statusCode = httpStatus.badRequest;
        throw error;
    }
    
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const type = typeLetter.sps;

    let connection;
    try{
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const sequence = await letterService.letterSequence(type, month, year, connection);
        if(!poData.po_number && !poData.source_type){
            const code = await letterService.letterCode(type);
            poData.po_number = await letterCode(code, month, year, sequence);
            poData.source_type = sourceType.poClient;
        }
        
        const poId = await repository.addPo(poData, connection);
        if(poItems && poItems.length > 0){
            await repository.addPoItems(poId, poItems, connection);
        }

        await letterService.addSequence(type, month, year, sequence + 1, connection);

        await redisClient.del(`client-po:${poData.client_id}`)
    }catch(err){
        if(connection) await connection.rollback();
        console.log(err);
        throw err;
    }finally{
        if(connection) connection.release();
    }
}