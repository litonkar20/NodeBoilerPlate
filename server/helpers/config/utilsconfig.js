'use strict';

/**
 * @module Utils-config
 * @Author Liton Kar
 * @Description This module will used for some default functiona and configurations.
 */
const envConfig = require('./dbconfig').VcapServices();
const errorCode = require('./../resource/errorcode/error-code.json');
const logger = require('../logger/logger');

/**
 * @Function EnvConfiguration
 * @Description Get configuration details from VCAP_SERVICES
 *
 */
const EnvConfiguration = () => {
    if (envConfig) {
        return envConfig;
    } else {
        logger.error('EnvConfiguration :: Not able to load Vcap Services file');
        return false;
    }
}


/**
 * @Function headerAuthorization
 * @Description It will check header authorization before hitting the API. If header Auth faild it will through Auth error.
 *
 */
const headerAuthorization = (authorization) => {
    const APIAuth = EnvConfiguration().APIAuth;
    return new Promise((resolve, reject) => {
        if (!authorization) {
            reject(errorCode.Error.NoBasicAuthError);
        } else {
            var authorizationToken = authorization.split(' ');
            if (authorizationToken[0] === 'Basic' && authorizationToken[1]) {
                var decodedAuthorization = Buffer.from(authorizationToken[1], 'base64').toString();
                var usernamepassword = decodedAuthorization.split(':');
                var username = usernamepassword[0];
                var password = usernamepassword[1];
                if (APIAuth.username === username && APIAuth.password === password) {
                    resolve(true)
                } else {
                    reject(errorCode.Error.BasicAuthError);
                }
            }
        }
    })
};

/**
 * @Function capitalizeFirstLetter
 * @Description change string to capitalize
 *
 */
const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * @Function validationError
 * @Description It will format validation error message.
 *
 */
const validationError = (errMessage) => {
    let message = errMessage.replace(/^instance./, '');
    let validationError = capitalizeFirstLetter(message);
    errorCode.Error.schemaValidation["message"] = "Schema validation failed. " + validationError
    return errorCode.Error.schemaValidation
}

module.exports = {
    EnvConfiguration,
    headerAuthorization,
    validationError
};