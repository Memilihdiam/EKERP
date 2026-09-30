const { httpStatus } = require("../../../utils/util");
const service = require('./notification.service');

exports.latestTask = async (req, res) => {
    try{
        const { task } = await service.latestTask();

        res.status(httpStatus.ok).json({
            success: true,
            message: "Successfuly Fetch Data",
            task
        })
    }catch(err){
        console.log('Error while fetch lastest task, ', err);
        return res.status(err.statusCode || httpStatus.internalServerError).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}