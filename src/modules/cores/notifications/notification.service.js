const redisClient = require("../../../config/redis");
const { httpStatus } = require("../../../utils/util");
const service = require('./notification.repository');

exports.latestTask = async () => {
    const cachedKey = 'latest-task';
    const cachedEx = 3600;

    const cacheData = await redisClient.get(cachedKey);
    if(cacheData){
        return { task: JSON.parse(cacheData) };
    }

    const task = await service.latestTask();
    if(task.length === 0){
        return { task: [] };
    }

    await redisClient.set(cachedKey, JSON.stringify(task), 'EX', cachedEx);
    return { task };
}