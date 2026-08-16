const pool = require('../../../config/db');
const redisClient = require('../../../config/redis');
const { httpStatus } = require('../../../utils/util');
const repository = require('./rfq.repository');

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
            return { client_rfq: JSON.parse(cacheData) };
        }

        const rfqs = await repository.fetchRfqByClient(clientId);
        if(!rfqs){
            return { client_rfq: [] };
        }

        let rfq_items = await repository.fetchRfqItems(rfqs.id);
        if(rfq_items.length === 0){
            rfq_items = [];
        }

        const client_rfq = {rfqs, rfq_items};

        await redisClient.set(cachedKey, JSON.stringify(client_rfq), 'EX', cachedEx);
        return { client_rfq };
    }catch(err){
        throw err;
    }
}

exports.addRfq = async (rfqPayload) => {
    const { rfq, items } = rfqPayload;

    if(!rfq || !rfq.rfq_number || !rfq.client_id || !rfq.title){
        const error = new Error("RFQ Number, Client, and Title are required");
        error.statusCode = httpStatus.badRequest;
        throw error;
    }

    let connection;
    try{
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const rfqId = await repository.addRfq(rfq, connection);

        if(items && items.length > 0){
            await repository.addRfqItems(items, rfqId, connection);
        }

        await connection.commit();
        await redisClient.del('all-client-rfq');
    }catch(err){
        if(connection) await connection.rollback();
        throw err;
    }finally{
        if(connection) connection.release();
    }
}
