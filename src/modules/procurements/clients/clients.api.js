const route = require('express').Router();
const { verifyToken } = require('../../../middlewares/middleware');
const controller = require('./client.controller');

route.get('/', verifyToken, controller.findAllClients);
route.get('/:id', verifyToken, controller.findClientById);

route.post('/', verifyToken, controller.addClients);

route.get('/industry', verifyToken, controller.findAllIndustries);

module.exports = route;