const redisClient = require("../../../config/redis");
const { httpStatus } = require("../../../utils/util");
const repository = require('./approval.repository');

exports.getClientProcurements = async () => {
    const cachedKey = 'approval-client-procurements';
    const cachedEx = 3600;

    const cacheData = await redisClient.get(cachedKey);
    if(cacheData){
        return { client_procurements: JSON.parse(cacheData) };
    }

    const client_procurements = await repository.getClientProcurements();
    if(client_procurements.length === 0){
        return { client_procurements: [] };
    }

    await redisClient.set(cachedKey, JSON.stringify(client_procurements), 'EX', cachedEx);
    return { client_procurements }
}