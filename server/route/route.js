"use strict"
const express = require('express');
const router = express.Router();

//test
const testServer = require('../controllers/testServer/test.controller');
const login = require('../controllers/auth/auth.controller');

/**
* @Router - Router file
* @Description - This is main router file. ALl API routers are defined here.
* @requires Router 
*/

router.get('/api/check/application/status', testServer.checkApplicationStatus);
router.get('/api/check/database/status', testServer.checkDatabaseStatus);

router.post('/api/user/login', login.loginUser);

module.exports = router;
