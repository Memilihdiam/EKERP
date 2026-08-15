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

exports.findProjectById = async (id) => {
    if(!id){
        const error = new Error('Id Not Found');
        error.statusCode = httpStatus.notFound;
        throw error;
    };

    const cachedKey = `project-detail:${id}`;
    const cachedEx = 3600;

    try{
        const cacheData = await redisClient.get(cachedKey);
        if(cacheData){
            return { project: JSON.parse(cacheData) };
        }

        const project = await repository.findProjectsById(id);
        
        await redisClient.set(cachedKey, JSON.stringify(project), 'EX', cachedEx);
        return { project };
    }catch(err){
        throw err;
    }
}