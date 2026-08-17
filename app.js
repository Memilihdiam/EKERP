const express = require('express');
const path = require('path');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const apiRoute = require('./src/routes/index');
const pageRoute = require('./src/routes/pages');
const { redirectToCleanUrl, handle404 } = require('./src/middlewares/routeHandlers');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use(redirectToCleanUrl);

app.use('/pages', pageRoute);
app.use('/api', apiRoute);

app.use(express.static(path.join(__dirname, './public'), {extensions: ['html']}));

app.use(handle404);

const option = {
    key: fs.readFileSync(path.join(__dirname, 'cert.key')),
    cert: fs.readFileSync(path.join(__dirname, 'cert.crt'))
}

https.createServer(option, app).listen(port, () => {
    console.log(`System Run On https://localhost:${port}`);
});