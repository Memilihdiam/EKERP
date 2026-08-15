const route = require('express').Router();
const { verifyToken } = require('../../../middlewares/middleware');
const controller = require('./management.controller');

route.get('/', verifyToken, controller.getAllProjects);
route.get('/:id', verifyToken, controller.getProjectDetail);

module.exports = route;