const route = require('express').Router();
const { verifyToken } = require('../../../middlewares/middleware');
const controller = require('./user.controller');

route.get('/me', verifyToken, controller.userData);

route.post('/', controller.authentication);

route.put('/me/password', verifyToken, controller.changePassword);

module.exports = route;