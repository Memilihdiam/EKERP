const repository = require('./management.repository');
const { httpStatus } = require('../../../utils/util');
const redisClient = require('../../../config/redis');

exports.findAllProject = async () => {
    const cachedKey = 'all-projects';
    const cachedEx = 3600;

    try{
        const cacheData = await redisClient.get(cachedKey);
        if(cacheData){
            return { projects: JSON.parse(cacheData) };
        }

        const projects = await repository.findAllProjects();
        if(projects.length === 0){
            return { projects: [] };
        }

        await redisClient.set(cachedKey, JSON.stringify(projects), 'EX', cachedEx);
        return { projects };
    }catch(err){
        throw err;
    }
}