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
            return { client: JSON.parse(cacheData) };
        }

        const client = await repository.findClientsById(id);
        const pic = await repository.findPicClient(id);
        if(!client){
            const error = new Error('Not Found Data');
            error.statusCode = httpStatus.notFound;
            throw error;
        }

        await redisClient.set(cachedKey, JSON.stringify(client), 'EX', cachedEx);
        return { client, pic };
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
    if(!clientsData){
        const error = new Error("Field Can't Be Null");
        error.statusCode = httpStatus.badRequest;
        throw error;
    }
    let connection;
    try{
        connection = await pool.getConnection();
        await connection.beginTransaction();

        await repository.addClients(clientsData);

        connection.commit();
        await redisClient.del('all-clients');
    }catch(err){
        throw err;
    }
}