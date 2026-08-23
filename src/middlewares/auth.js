const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis'); 

exports.checkSession = async (req, res) => {
    try {
        // 1. Ambil sessionId dari cookie
        const { sessionId } = req.cookies;

        if (!sessionId) {
            return res.status(401).json({
                success: false,
                authenticated: false
            });
        }

        // 2. Langsung cari token di Redis menggunakan prefix 'session:'
        const token = await redisClient.get(`session:${sessionId}`);

        if (!token) {
            return res.status(401).json({
                success: false,
                authenticated: false
            });
        }

        // 3. Verifikasi JWT menggunakan JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Jika valid, kembalikan respons sukses beserta data user dari payload JWT
        return res.status(200).json({
            success: true,
            authenticated: true,
            user: {
                id: decoded.id,
                userCode: decoded.userCode,
                role: decoded.role
            }
        });

    } catch (err) {
        console.error("Error in checkSession middleware:", err);
        
        return res.status(401).json({
            success: false,
            authenticated: false
        });
    }
};