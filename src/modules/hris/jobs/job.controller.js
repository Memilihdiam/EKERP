const { httpStatus } = require('../../../utils/util');
const service = require('./job.service');

exports.getJob = async (req, res) => {
    try{
        const { job } = await service.getDepartmentPosition();
        res.status(httpStatus.ok).json({
            success: true,
            message: 'Successfuly Fetch Data',
            job
        })
    }catch(err){
        console.log('Error while fetch job data, ', err);
        return res.status(err.statusCode || httpStatus.internalServerError).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}