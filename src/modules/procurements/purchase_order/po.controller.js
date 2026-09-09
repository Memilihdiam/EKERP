const { httpStatus } = require("../../../utils/util");
const service = require('./po.service');
const companyService = require("../../cores/companies/company.service");


exports.getPoClient = async (req, res) => {
    const { client_id } = req.params;

    try{
        const {poData} = await service.getClientPo(client_id);

        res.status(httpStatus.ok).json({
            success: true,
            message: 'Successfuly Fetch Data',
            poData
        })
    }catch(err){
        console.log('Error while fetch po client data, ', err);
        return res.status(err.statusCode || httpStatus.internalServerError).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}

exports.getPoDetail = async (req, res) => {
    const {poId} = req.params;

    try{
        const { poData, poItems } = await service.getDetailPo(poId);
        const { company } = await companyService.getCompanyData();

        res.status(httpStatus.ok).json({
            success: true,
            message: 'Successfuly Fetch Data',
            poData,
            poItems,
            company
        })
    }catch(err){
        console.log('Error while fetch po detail, ', err);
        return res.status(err.statuscode || httpStatus.internalServerError).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}

exports.addPo = async (req, res) => {
    const { id } = req.user;
    const { poData, poItems } = req.body;
    try{
        if(!poData.created_by){
            poData.created_by = id;
        }
        await service.createPo(poData, poItems);

        res.status(httpStatus.created).json({
            success: true,
            message: 'Successfuly Create Data'
        })
    }catch(err){
        console.log('Error while create po client, ', err);
        return res.status(err.statusCode || httpStatus.internalServerError).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}