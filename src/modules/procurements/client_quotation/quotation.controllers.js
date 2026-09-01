const { httpStatus } = require('../../../utils/util');
const service = require('./quotation.service');

exports.getQuotByIdForRfq = async (req, res) => {
    const { quotId } = req.params;
    try{
        const { quotation, quotItem } = await service.getQuotByIdForRfq(quotId);

        res.status(httpStatus.ok).json({
            success: true,
            message: 'Successfuly Fetch Data',
            quotation,
            quotItem
        })
    }catch(err){
        console.log('Error while fetch quot detail data, ', err);
        return res.status(err.statusCode || httpStatus.internalServerError).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}

exports.getQuotByClient = async (req, res) => {
    const { clientId } = req.params;
    try{
        const { quotation } = await service.getQuotByClient(clientId);

        res.status(httpStatus.ok).json({
            success: true,
            message: 'Successfuly Fetch Data',
            quotation
        })
    }catch(err){
        console.log('Error while fetch quotation client, ', err);
        return res.status(err.statusCode || httpStatus.internalServerError).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}

exports.addQuot = async (req, res) => {
    const { id } = req.user;
    const { quotData, quotItem } = req.body;
    try{
        if(!quotData.created_by){
            quotData.created_by = id;
        }

        await service.addQuotForRfq(quotData, quotItem);

        res.status(httpStatus.created).json({
            success: true,
            message: 'Successfuly Create Data'
        })
    }catch(err){
        console.log('Error while created quotation, ', err);
        return res.status(err.statusCode || httpStatus.internalServerError).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}