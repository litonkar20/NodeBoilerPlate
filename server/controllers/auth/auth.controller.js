"use strict"


/**
 * @module Test-Server
 * @Author Liton Kar
 * @Description Sample Schema validation.Any parameter missmatch will through validation error
 * @requires mysql,logger
 */

const Validator = require('jsonschema').Validator;
const v = new Validator();
const schema = require('../../helpers/resource/schema-validation/schema.json');
const utill = require('../../helpers/config/utilsconfig');
const logger = require('../../helpers/logger/logger');
const loginModule = require('../../models/auth/auth.model');
const login = new loginModule();

const loginUser = (req, res) => {
    logger.info('loginUser ==> API Called');
    let reqParam =req.body;
    let result = v.validate(reqParam, schema.login);
    if (result.valid) {
        logger.debug(`loginUser ==> userLogin :: reqParam - ${JSON.stringify(reqParam)}`);
        login.userLogin(reqParam).then((result)=>{
            logger.debug(`loginUser ==> userLogin :: Response - Success`);
            res.status(200).json(result);
        }).catch((err)=>{
            logger.error(`loginUser ==> userLogin :: Error - ${JSON.stringify(err)}`);
            res.json(err);
        })    
    }else{
        let validationError = utill.validationError(result.errors[0].stack)
        res.send(validationError);
    }   
}
  
    
module.exports = {
    loginUser
}