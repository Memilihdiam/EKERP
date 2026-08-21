const pool = require("../../../config/db");
const redisClient = require("../../../config/redis");
const { httpStatus } = require("../../../utils/util");
const repository = require('./client.repository');

exports.getClientById = async (id) => {
    if(!id){
        const error = new Error('Not Found Client Id');
        error.statusCode = httpStatus.badRequest;
        throw error;
    }
    const cachedKey = `client:${id}`;
    const cachedEx = 3600;
    
    try{
        const cacheData = await redisClient.get(cachedKey);
        if(cacheData){
            return JSON.parse(cacheData);
        }

        const client = await repository.findClientsById(id);
        const pic = await repository.findPicClient(id);
        if(!client){
            const error = new Error('Not Found Data');
            error.statusCode = httpStatus.notFound;
            throw error;
        }

        const result = {
            client, pic: pic || []
        }
        await redisClient.set(cachedKey, JSON.stringify(result), 'EX', cachedEx);
        return result;
    }catch(err){
        throw err;
    }
}

exports.getAllClients = async () => {
    const cachedKey = 'all-clients';
    const cachedEx = 3600;

    try{
        const cacheData = await redisClient.get(cachedKey);
        if(cacheData){
            return { clients: JSON.parse(cacheData) };
        }

        const clients = await repository.findAllClients();
        if(clients.length === 0){
            return { clients: [] };
        }

        await redisClient.set(cachedKey, JSON.stringify(clients), 'EX', cachedEx);

        return { clients };
    }catch(err){
        throw err;
    }
}

exports.getIndustries = async () => {
    const cachedKey = 'all-industries';
    const cachedEx = 3600;

    try{
        const cacheData = await redisClient.get(cachedKey);
        if(cacheData){
            return { industries: JSON.parse(cacheData) };
        }

        const industries = await repository.findAllIndustries();
        if(industries.length === 0){
            return { industries: [] };
        }

        await redisClient.set(cachedKey, JSON.stringify(industries), 'EX', cachedEx);

        return { industries };
    }catch(err){
        throw err;
    }
}

exports.addClients = async (clientsData) => {
    const { pics, ...clientInfo } = clientsData;

    if(!clientInfo){
        const error = new Error("Field Can't Be Null");
        error.statusCode = httpStatus.badRequest;
        throw error;
    }

    let connection;
    try{
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const result = await repository.addClients(clientInfo, connection);
        const clientId = result.insertId;

        if (pics && pics.length > 0) {
            for (const pic of pics) {
                await repository.addPicClient(pic, clientId, connection);
            }
        }

        await connection.commit();
        await redisClient.del('all-clients');
    }catch(err){
        if(connection) await connection.rollback();
        throw err;
    }finally{
        if(connection) connection.release();
    }
}

exports.addPicClients = async(data) => {
    const picData = data;

    if(!picData){
        const error = new Error("Field Can't Be Null");
        error.statusCode = httpStatus.badRequest;
        throw error;
    }
    let connection;
    try{
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const clientId = picData.clientId;
        await repository.addPicClient(picData, clientId, connection);

        await connection.commit();
        await redisClient.del(`client:${clientId}`);
    }catch(err){
        if(connection) await connection.rollback();
        throw err;
    }finally{
        if(connection) connection.release();
    }
}