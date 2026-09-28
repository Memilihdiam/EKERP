const route = require('express').Router();
const { verifyToken } = require('../../../middlewares/middleware');
const controller = require('./employee.controller');

route.get('/', verifyToken, controller.getEmployees);
route.get('/data/add/employee', verifyToken, controller.getDataForAdd);
route.post('/', verifyToken, controller.addEmployee);

module.exports = route;