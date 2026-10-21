const { response } = require("express");
const { httpStatus } = require("../../../utils/util");
const service = require('./overreview.service');

exports.countProcurementStatus = async (req, res) => {
    try{
        const { projects, clientsStatus } = await service.countProcurementStatus();

        res.status(httpStatus.ok).json({
            success: true,
            message: 'Successfuly Fetch Data',
            projects,
            clientsStatus
        })
    }catch(err){
        console.log('Error while fetch review data, ', err);
        return res.status(err.statusCode || httpStatus.internalServerError).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}

exports.valueProject = async (req, res) => {
    try{
        const { value } = await service.valueProject();

        res.status(httpStatus.ok).json({
            success: true,
            message: 'Successfuly Fetch Data',
            value
        })
    }catch(err){
        console.log('Error while fetch value data, ', err);
        return res.status(err.statusCode || httpStatus.internalServerError).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}