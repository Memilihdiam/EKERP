const { httpStatus } = require('../../../utils/util');
const service = require('./user.service');

exports.authentication = async (req, res) => {
    const userData = req.body;
    try{
        const { userCode, password } = userData;

        const { sessionId } = await service.authService(userCode, password);

        res.cookie('sessionId', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/'
        });

        res.status(httpStatus.ok).json({
            success: true,
            message: 'Successfuly Auth Account'
        });
    }catch(err){
        console.log('Error while login auth, ', err);
        return res.status(err.statusCode || httpStatus.internalServerError).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}

exports.userData = async (req, res) => {
    const { id } = req.user;
    try{
        const { user } = await service.userData(id);

        res.status(httpStatus.ok).json({
            success: true,
            message: 'Successfuly Fetch Data',
            user
        })
    }catch(err){
        console.log('Error while fetch user data, ', err);
        return res.status(err.statusCode || httpStatus.internalServerError).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}