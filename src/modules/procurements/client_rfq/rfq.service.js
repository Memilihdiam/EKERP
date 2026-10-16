const pool = require('../../../config/db');
const redisClient = require('../../../config/redis');
const { letterCode } = require('../../../utils/code-generator');
const { httpStatus, typeLetter, statusList } = require('../../../utils/util');
const repository = require('./rfq.repository');
const letterService = require('../../cores/letter/letter.service');

exports.findAllRFQ = async () => {
    const cachedKey = 'all-client-rfq';
    const cachedEx = 3600;

    try{
        const cacheData = await redisClient.get(cachedKey);
        if(cacheData){
            return { client_rfq: JSON.parse(cacheData) };
        }

        const client_rfq = await repository.fetchAllRFQ();
        if(client_rfq.length === 0){
            return { client_rfq: [] };
        }

        await redisClient.set(cachedKey, JSON.stringify(client_rfq), 'EX', cachedEx);
        return { client_rfq };
    }catch(err){
        throw err;
    }
}

exports.findRfq = async (rfqId) => {
    if(!rfqId){
        const error = new Error("Not Found RFQ ID");
        error.statusCode = httpStatus.badRequest;
        throw error;
    }
    const cachedKey = `rfq-detail:${rfqId}`;
    const cachedEx = 3600;
    try{
        const cacheData = await redisClient.get(cachedKey);
        if(cacheData){
            return JSON.parse(cacheData);
        }

        const rfq = await repository.fetchRfqById(rfqId);
        if(!rfq){
            const error = new Error("Invalid RFQ ID");
            error.statusCode = httpStatus.notFound;
            throw error;
        }

        const rfqItems = await repository.fetchRfqItems(rfqId);
        
        const result = {rfq, rfqItems: rfqItems || []};

        await redisClient.set(cachedKey, JSON.stringify(result), 'EX', cachedEx);
        return result;
    }catch(err){
        throw err;
    }
}

exports.findRfqClient = async (clientId) => {
    if(!clientId){
        const error = new Error('Not Found client');
        error.statusCode = httpStatus.notFound;
        throw error;
    }

    const cachedKey = `client-rfq:${clientId}`;
    const cachedEx = 3600;

    try{
        const cacheData = await redisClient.get(cachedKey);
        if(cacheData){
            return { rfqs: JSON.parse(cacheData) };
        }

        const rfqs = await repository.fetchRfqByClient(clientId);
        if(rfqs.length === 0){
            return { rfqs: [] };
        }

        await redisClient.set(cachedKey, JSON.stringify(rfqs), 'EX', cachedEx);
        return { rfqs };
    }catch(err){
        throw err;
    }
}

exports.addRfq = async (rfq, items) => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const type = typeLetter.spb;
    
    if(!rfq.client_id || !rfq.title){
        const error = new Error("RFQ Number, Client, and Title are required");
        error.statusCode = httpStatus.badRequest;
        throw error;
    }
    
    let connection;
    try{
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        const sequence = await letterService.letterSequence(type, month, year, connection);
        if (!rfq.rfq_number) {
            const code = await letterService.letterCode(type);
            rfq.rfq_number = await letterCode(code, month, year, sequence);
        }

        const rfqId = await repository.addRfq(rfq, connection);

        if(items && items.length > 0){
            await repository.addRfqItems(items, rfqId, connection);
        }

        await letterService.addSequence(type, month, year, sequence + 1, connection);

        await connection.commit();
        await redisClient.del('all-client-rfq');
        await redisClient.del(`client-rfq:${rfq.client_id}`);
    }catch(err){
        if(connection) await connection.rollback();
        throw err;
    }finally{
        if(connection) connection.release();
    }
}

exports.updateStatus = async (rfqData) => {
    if(!rfqData){
        const error = new Error("Field Can't Be Null");
        error.statusCode = httpStatus.badRequest;
        throw error;
    }

    let connection;
    try{
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const detail = await repository.fetchRfqById(rfqData.id);
        if (!detail) {
            const error = new Error("Data not found");
            error.statusCode = httpStatus.notFound;
            throw error;
        }

        // Ambil status saat ini dan status tujuan
        const currentStatus = statusList.find(
            (item) =>
                item.value === detail.status &&
                item.modul.includes("REQUEST FOR QUOTATION")
        );

        const updateStatus = statusList.find(
            (item) =>
                item.value === rfqData.status &&
                item.modul.includes("REQUEST FOR QUOTATION")
        );

        // Validasi status harus terdaftar untuk modul
        if (!currentStatus || !updateStatus) {
            const error = new Error("Invalid status");
            error.statusCode = httpStatus.badRequest;
            throw error;
        }

        // Status tidak boleh mundur ke level lebih rendah
        if (updateStatus.level < currentStatus.level) {
            const error = new Error(
                `Status tidak bisa diturunkan dari ${currentStatus.name} ke ${updateStatus.name}`
            );
            error.statusCode = httpStatus.badRequest;
            throw error;
        }
        await repository.updateStatus(rfqData.id, rfqData.status, connection);
        
        await connection.commit();
        await redisClient.del(`rfq-detail:${rfqData.id}`);
        await redisClient.del('approval-client-procurements');
        await redisClient.del('all-client-rfq');
        await redisClient.del('all-clients');
        await redisClient.del(`rfq-detail${rfqData.id}`);
    }catch(err){
        if(connection) await connection.rollback();
        throw err;
    }finally{
        if(connection) connection.release();
    }
}
