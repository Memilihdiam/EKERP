const express = require('express');
const path = require('path');
const cors = require('cors');
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

app.listen(port, () => {
    console.log(`System Run On http://localhost:${port}`);
});