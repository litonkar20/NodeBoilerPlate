const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const route = require('../server/route/route');
const router = require('express').Router();
const utils = require('../server/helpers/config/utilsconfig');
const logger = require('../server/helpers/logger/logger')

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use('/*', router);
app.use('/', route);

router.use((req, res, next) => {
    var requestUrl = req.originalUrl.split('/').filter(Boolean).pop();
    if (requestUrl === 'status') {
        next();
    } else {
        var authorization = req.headers['authorization'];
        utils.headerAuthorization(authorization).then((result) => {
            next();
        }).catch((err) => {
            logger.error(`BasicAuthError :: ${JSON.stringify(err)}`)
            res.json(err);
        })
    }

});

module.exports = app