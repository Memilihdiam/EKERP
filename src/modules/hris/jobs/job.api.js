const route = require('express').Router();
const { verifyToken } = require('../../../middlewares/middleware');
const controller = require('./job.controller');

route.get('/', verifyToken, controller.getJob);

module.exports = route; 