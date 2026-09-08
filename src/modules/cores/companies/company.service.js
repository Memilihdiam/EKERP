const redisClient = require('../../../config/redis');
const { httpStatus } = require('../../../utils/util');
const repository = require('./company.repository');

exports.getCompanyData = async () => {
    const cachedKey = 'company-data';
    const cachedEx = 3600;

    try{
        const cacheData = await redisClient.get(cachedKey);
        if(cacheData){
            return {company: JSON.parse(cacheData)};
        }

        const company = await repository.getCompanyData();
        if(!company){
            const error = new Error('Not Have Company Data');
            error.statusCode = httpStatus.notFound;
            throw error;
        }

        await redisClient.set(cachedKey, JSON.stringify(company), 'EX', cachedEx);
        return {company};
    }catch(err){
        throw err;
    }
}