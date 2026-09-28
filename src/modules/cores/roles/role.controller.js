const { httpStatus } = require("../../../utils/util");
const service = require('./role.service');

exports.getRoles = async (req, res) => {
    try{
        const { roles } = await service.getRoles();

        res.status(httpStatus.ok).json({
            success: true,
            message: 'Successfuly Fetch Data',
            roles
        })
    }catch(err){
        console.log('Error while fetch roles data, ', err);
        return res.status(err.statusCode || httpStatus.internalServerError).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}