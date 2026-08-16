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

exports.findRfqClient = async (req, res) => {
    const { id } = req.params;
    try{
        const { client_rfq } = await service.findRfqClient(id);

        res.status(httpStatus.ok).json({
            success: true,
            message: 'Successfuly Fetch Data',
            client_rfq
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
    const { rfq, items } = req.body;

    rfq.created_by = userId;

    try{
        await service.addRfq({ rfq, items });
        res.status(httpStatus.created).json({
            success: true,
            message: 'RFQ created successfully'
        });
    }catch(err){
        console.log('Error while creating RFQ: ', err);
        res.status(err.statusCode || httpStatus.internalServerError).json({ success: false, message: err.message });
    }
}