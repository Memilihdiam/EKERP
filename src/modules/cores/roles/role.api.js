const route = require('express').Router();
const { verifyToken } = require("../../../middlewares/middleware");
const controller = require('./role.controller');

route.get('/', verifyToken, controller.getRoles);

module.exports = route;