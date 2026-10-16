const route = require('express').Router();
const { verifyToken } = require('../../../middlewares/middleware');
const controller = require('./po.controller');

route.get('/client/:client_id', verifyToken, controller.getPoClient);

route.get('/:poId', verifyToken, controller.getPoDetail);
route.post('/', verifyToken, controller.addPo);

route.put('/status/update', verifyToken, controller.updateStatus);

module.exports = route;