"use strict"


/**
 * @module Test-Server
 * @Author Liton Kar
 * @Description This is a controller file and it will communicate with model file to check if application and DB running properly.
 * @requires mysql,logger
 */

const logger = require('../../helpers/logger/logger');
const testServerModule = require('../../models/testServer/test.model');
const testServer = new testServerModule();

const checkApplicationStatus = (req, res) => {
    logger.info('checkApplicationStatus ==> API Called');
    testServer.applicationStatus().then((response)=>{
        res.status(200).json(response);
    }).catch((err)=>{
        logger.error(`checkApplicationStatus :: Error - ${JSON.stringify(err)}`);
        res.json(err);
    })
}

const checkDatabaseStatus = (req, res) => {
    logger.info('checkDatabaseStatus ==> API Called');
    testServer.databaseStatus().then((response)=>{
        res.status(200).json(response);
    }).catch((err)=>{
        logger.error(`checkDatabaseStatus :: Error - ${JSON.stringify(err)}`);
        res.json(err);
    })
}   
    
module.exports = {
    checkApplicationStatus,
    checkDatabaseStatus
}