const { httpStatus } = require("../../../utils/util");
const service = require('./approval.service');

exports.getClientProcurements = async (req, res) => {
    try{
        const { client_procurements } = await service.getClientProcurements();

        res.status(httpStatus.ok).json({
            success: true,
            message: 'Successfuly Fetch Data',
            client_procurements
        })
    }catch(err){
        console.log('Error while fetch client procurement data, ', err);
        return res.status(err.statusCode || httpStatus.internalServerError).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}