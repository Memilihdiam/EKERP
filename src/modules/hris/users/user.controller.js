const { httpStatus } = require('../../../utils/util');
const service = require('./user.service');

exports.authentication = async (req, res) => {
    const userData = req.body;
    try{
        const { userCode, password } = userData;
        console.log(userCode, password);

        const { sessionId } = await service.authService(userCode, password);

        res.status(httpStatus.ok).json({
            success: true,
            message: 'Successfuly Auth Account',
            sessionId
        })
    }catch(err){
        console.log('Error while login auth, ', err);
        return res.status(err.statusCode || httpStatus.internalServerError).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}