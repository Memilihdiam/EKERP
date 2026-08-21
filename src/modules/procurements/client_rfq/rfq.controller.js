const { httpStatus } = require('../../../utils/util');
const service = require('./rfq.service');

exports.findAllRFQ = async (req, res) => {
    try{
        const { client_rfq } = await service.findAllRFQ();

        res.status(httpStatus.ok).json({
            success: true,
            message: 'Successfuly Fetch Data',
            client_rfq
        })
    }catch(err){
        console.log('Error while fetch all client rfq, ', err);
        return res.status(err.statusCode || httpStatus.internalServerError).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}

exports.findRfq = async (req, res) => {
    const { id } = req.params;
    try{
        const {rfq, rfqItems} = await service.findRfq(id);

        res.status(httpStatus.ok).json({
            success: true,
            message: 'Successfuly Fetch Data',
            rfq,
            rfqItems
        })
    }catch(err){
        console.log('Error while fetch rfq detail, ', err);
        return res.status(err.statusCode || httpStatus.internalServerError).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}

exports.findRfqClient = async (req, res) => {
    const { id } = req.params;
    try{
        const { rfqs } = await service.findRfqClient(id);

        res.status(httpStatus.ok).json({
            success: true,
            message: 'Successfuly Fetch Data',
            rfqs
        })
    }catch(err){
        console.log('Error while fetch rfq client, ', err);
        return res.status(err.statusCode || httpStatus.internalServerError).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}

exports.addRfq = async (req, res) => {
    const { id: userId } = req.user;
    const { rfq, items } = req.body; // rfq is an object, items is an array

    if (!rfq) {
        return res.status(httpStatus.badRequest).json({ success: false, message: 'RFQ data is missing.' });
    }
    
    rfq.created_by = userId;

    try{
        await service.addRfq(rfq, items);
        res.status(httpStatus.created).json({
            success: true,
            message: 'RFQ created successfully'
        });
    }catch(err){
        console.log('Error while creating RFQ: ', err);
        res.status(err.statusCode || httpStatus.internalServerError).json({ success: false, message: err.message });
    }
}