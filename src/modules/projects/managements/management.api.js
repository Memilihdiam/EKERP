const route = require('express').Router();
const { verifyToken } = require('../../../middlewares/middleware');
const controller = require('./management.controller');

route.get('/', verifyToken, controller.getAllProjects);

module.exports = route;