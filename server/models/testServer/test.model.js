"use strict"

/**
 * @module Test-Server
 * @Author Liton Kar
 * @Description This module will check if application and DB running properly.
 * @requires mysql
 */

const DB = require('../../helpers/config/dbconfig');
const logger = require('../../helpers/logger/logger');
const dbScript = require('../../helpers/resource/db-script/db-script.json');
const responseCode = require('../../helpers/resource/errorcode/error-code.json');

class TestServer {

    /** 
     * @method checkApplicationStatus 
     * @description This method will checkif application is running.
     */

    applicationStatus() {
        return new Promise((resolve, reject) => {
            resolve(responseCode.Success.applicationStatus)
        });
    }

    /** 
     * @method databaseStatus 
     * @description This method  will check if database is running.
     */
    
    databaseStatus() {
        return new Promise((resolve, reject) => {
            let query = dbScript.script.dbTest.select;
            DB.testDBConnection(query).then((response) => {
                resolve(responseCode.Success.databaseStatus);
            }).catch((err) => {
                logger.error(`TestServer ==> databaseStatus :: Error - ${JSON.stringify(err)}`);
                reject(err);
            })
        })
    }
}

module.exports = TestServer