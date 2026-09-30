const route = require('express').Router();
const { verifyToken } = require('../../../middlewares/middleware');
const controller = require('./notification.controller');

route.get('/tasks/urgent', verifyToken, controller.latestTask);

module.exports = route;