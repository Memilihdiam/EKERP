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