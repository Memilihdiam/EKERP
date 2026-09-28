const repository = require("./job.repository");
const redisClient = require("../../../config/redis");
const { httpStatus } = require("../../../utils/util");

exports.getDepartmentPosition = async () => {
    const cachedKey = 'all-department-position';
    const cachedEx = 3600;

    const cacheData = await redisClient.get(cachedKey);
    if(cacheData){
        return { job: JSON.parse(cacheData) };
    }

    const job = await repository.getDepartmentPosition();
    if(job.length === 0){
        return { job: [] };
    }

    await redisClient.set(cachedKey, JSON.stringify(job), 'EX', cachedEx);
    return { job };
}

exports.getDepartmentByJobId = async (jobId, connection) => {
    if(!jobId){
        const error = new Error("Attribute Position Null");
        error.statusCode = httpStatus.badRequest;
        throw error;
    }

    const cachedKey = `department-position:${jobId}`;
    const cachedEx = 3600;

    const cacheData = await redisClient.get(cachedKey);
    if(cacheData){
        return { job: JSON.parse(cacheData) };
    }

    const job = await repository.getDepartmentCode(jobId, connection);
    if(!job){
        const error = new Error("Job With Id Not Found");
        error.statusCode = httpStatus.notFound;
        throw error;
    }
    console.log(job);

    await redisClient.set(cachedKey, JSON.stringify(job), 'EX', cachedEx);
    return { job };
}