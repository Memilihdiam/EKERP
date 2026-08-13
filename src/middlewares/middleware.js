const jwt = require('jsonwebtoken');
const { httpStatus } = require('../utils/util');
const redisClient = require('../config/redis');

// Fungsi verifikasi token pengguna
const verifyToken = async(req, res, next) => {
    const { sessionId } = req.cookies;

    if(!sessionId){
        return res.status(httpStatus.unauthorized).json({
            message: 'Session not found. Please log in.'
        });
    }
    
    try{
        const token = await redisClient.get(`session:${sessionId}`);

        if (!token) {
            return res.status(httpStatus.unauthorized).json({
                message: 'Invalid or expired session.'
            });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    }catch(err){
        console.error('Token verification error:', err);
        return res.status(httpStatus.unauthorized).json({
            message: 'Invalid Token.'
        })
    }
}

module.exports = {verifyToken};