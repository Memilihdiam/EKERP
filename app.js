const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const apiRoute = require('./src/routes/index');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get(/\.html$/, (req, res) => {
    const cleanUrl = req.url.replace('.html', '');
    res.redirect(301, cleanUrl);
})

app.use(express.static(path.join(__dirname, './public'), {extensions: ['html']}));
app.use('/api', apiRoute);

app.listen(port, () => {
    console.log(`System Run On http://localhost:${port}`);
});