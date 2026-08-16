const route = require('express').Router();
const path = require('path');

route.get('/projects/project-detail/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/pages/projects/project-detail.html'));
});

route.get('/clients/client-detail/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/pages/clients/client-detail.html'));
});

route.get('/rfqs/rfq-detail/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/pages/procurements/rfqs/rfq-detail.html'));
});

module.exports = route;
