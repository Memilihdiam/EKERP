const path = require('path');
const { httpStatus } = require('../utils/util');

/**
 * Middleware untuk me-redirect URL yang berakhiran .html ke URL tanpa ekstensi.
 * Contoh: /pages/dashboard.html -> /pages/dashboard
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const redirectToCleanUrl = (req, res, next) => {
    if (req.path.endsWith('.html')) {
        const cleanUrl = req.path.slice(0, -5); // Menghapus '.html'
        return res.redirect(301, cleanUrl);
    }
    next();
};

/**
 * Middleware untuk menangani permintaan ke rute yang tidak ditemukan (404).
 * Harus ditempatkan setelah semua rute lain didefinisikan.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const handle404 = (req, res, next) => {
    res.status(httpStatus.notFound).sendFile(path.join(__dirname, '../../public', '404.html'));
};

module.exports = {
    redirectToCleanUrl,
    handle404,
};