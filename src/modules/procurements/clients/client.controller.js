const { httpStatus } = require('../../../utils/util');
const service = require('./client.service');

exports.findAllClients = async (req, res) => {
    try{
        const { clients } = await service.findClient();

        res.status(httpStatus.ok).json({
            success: true,
            message: 'Successfuly Fetch Data',
            clients
        })
    }catch(err){
        console.log('Error while fetch all clients, ', err);
        return res.status(err.statusCode || httpStatus.internalServerError).json({
            success: false,
            message: err.message || 'Internal Server error'
        })
    }
}

exports.findAllIndustries = async (req, res) => {
    try{
        const { industries } = await service.getIndustries();

        res.status(httpStatus.ok).json({
            success: true,
            message: 'Successfuly Fetch Data',
            industries
        })
    }catch(err){
        console.log('Error while fetch all industries, ', err);
        return res.status(err.statusCode || httpStatus.internalServerError).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}

exports.addClients = async (req, res) => {
    const clientData = req.body;
    try{
        await service.addClients(clientData);

        res.status(httpStatus.created).json({
            success: true,
            message: 'Successfuly Created Data'
        })
    }catch(err){
        console.log('Error while created clients, ', err);
        return res.status(err.statusCode || httpStatus.internalServerError).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}