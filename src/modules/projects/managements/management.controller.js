const { httpStatus } = require("../../../utils/util");
const service = require('./management.service');

exports.getAllProjects = async (req, res) => {
    try{
        const { projects } = await service.findAllProject();

        res.status(httpStatus.ok).json({
            succees: true,
            message: 'Successfuly Fetch Data',
            projects
        })
    }catch(err){
        console.log('Error while fetch all projects, ',err);
        return res.status(err.statusCode || httpStatus.internalServerError).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}

exports.getProjectDetail = async (req, res) => {
    const {id} = req.params;
    try{
        const { project } = await service.findProjectById(id);

        res.status(httpStatus.ok).json({
            success: true,
            message: 'Successfuly Fetch Data',
            project
        })
    }catch(err){
        console.log('Error while fetch project detail, ', err);
        return res.status(err.statusCode || httpStatus.internalServerError).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}