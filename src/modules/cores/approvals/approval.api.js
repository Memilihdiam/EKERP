const route = require('express').Router();
const { verifyToken } = require('../../../middlewares/middleware');
const controller = require('./approval.controller');

route.get('/procurements', verifyToken, controller.getClientProcurements);

module.exports = route;