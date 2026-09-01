const route = require('express').Router();
const { verifyToken } = require('../../../middlewares/middleware');
const controller = require('./quotation.controllers');

route.get('/:quotId', verifyToken, controller.getQuotByIdForRfq);
route.get('/client/:clientId', verifyToken, controller.getQuotByClient);

route.post('/', verifyToken, controller.addQuot);

module.exports = route;