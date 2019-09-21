"use strict"

/**
 * @module Login
 * @Author Liton Kar
 * @Description This sample login module file.
 * @requires mysql
 */

const DB = require('../../helpers/config/dbconfig');
const logger = require('../../helpers/logger/logger');
const dbScript = require('../../helpers/resource/db-script/db-script.json');
const responseCode = require('../../helpers/resource/errorcode/error-code.json');

class Login {

    /** 
     * @method checkApplicationStatus 
     * @description This method will checkif application is running.
     */

    userLogin(param) {
        return new Promise((resolve, reject) => {
            let query = dbScript.script.login.select;
            let value=[1,1];
            DB.Select(query,value).then((response) => {
                resolve(responseCode.Success.loginSuccess)
            }).catch((err) => {
                logger.error(`TestServer ==> databaseStatus :: Error - ${JSON.stringify(err)}`);
                reject(err);
            })
        });
    }
}

module.exports = Login