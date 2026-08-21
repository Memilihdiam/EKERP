const route = require('express').Router();
const { verifyToken } = require('../../../middlewares/middleware');
const controller = require('./rfq.controller');

route.get('/', verifyToken, controller.findAllRFQ);
route.get('/:id', verifyToken, controller.findRfqClient);
route.get('/detail/:id', verifyToken, controller.findRfq);

route.post('/', verifyToken, controller.addRfq);

module.exports = route;