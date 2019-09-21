'use strict';

/**
 * @module DB-config
 * @Author Liton Kar
 * @Description This module will connect to MySql Database. For CRUD operations, created some generic function which will get used 
 * through the function
 * @requires mysql
 */

const mysql = require('mysql');
let VCAP_SERVICES = process.env.VCAP_SERVICES && JSON.parse(process.env.VCAP_SERVICES);
const errorCode = require('../../helpers/resource/errorcode/error-code.json');

/**
* @File VCAP_SERVICES
* @Description All configuration data added in VCAP_SERVICES file. MySql configuration details can be found under 'MySql' object in VCAP_SERVICES dile.
*
*/

const VcapServices = () => {
    let envConfig;
    if (!VCAP_SERVICES && process.env.NODE_ENV !== 'production') {
        try {
            VCAP_SERVICES = require('./VCAP_SERVICES.json');
            envConfig = VCAP_SERVICES["credentials"];
        } catch (err) {
            if (err.code === 'MODULE_NOT_FOUND') {
                console.log('Error', 'VCAP_SERVICES variable not available and the VCAP_SERVICES.json was not found in the root of the project.');
            }
        }
    } else {
        envConfig = VCAP_SERVICES && VCAP_SERVICES["credentials"] || {};
    }

    return envConfig 
}
const envConfig = VcapServices();

/**
* @Config
* @Description Configuration to connect DB with connection pool.
*
*/
const config = {
    host: envConfig.MySql.host,
    port: envConfig.MySql.port,
    user: envConfig.MySql.user,
    password: envConfig.MySql.password,
    database: envConfig.MySql.database,
    multipleStatements: true
};
const pool = mysql.createPool(config);


/**
* @Function testConnection
* @Description DB connection can be tested using bellow function. If success will give result else will through error.
*
*/
const testDBConnection = (query) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(errorCode.Error.DBCOnnectionError);
            } else {
                connection.query(query, (error, results) => {
                    if (error) {
                        reject(err);
                    }else{
                        resolve(results);
                        connection.release();
                    }
                });
            }
        });
    });
}



/**
* @Function StartTransaction
* @Description Start Transaction before CRUD operations.
*
*/
const StartTransaction = (callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            callback(errorCode.Error.DBCOnnectionError);
        } else {
            connection.beginTransaction((err) => {
                if (err) {
                    connection.release();
                    callback(err, null);
                } else {
                    callback(null, connection);
                }
            });
        }
    });
};

/**
* @Function Commit
* @Description Commit Transaction one CRUD operations are done. Use this function to call Inside Trasaction.
*
*/
const Commit = (connection) => {
    if (connection) {
        connection.commit((err) => {
            if (err) {
                connection.release();
            }
        });
        connection.release();
    }
};

/**
* @Function Rollback
* @Description Rollback Transaction one CRUD operations fails. Use this function to call Inside Trasaction.
*
*/
const Rollback = (connection) => {
    if (connection) {
        connection.rollback((err) => {
            if (err){
                connection.release();
            }
        });
        connection.release();
    }
};

/**
 * @Function Select
 * @param {query,value} Parameter User provided data 
 * @Select Method to perform Select operation in database. Use this function to call without Trasaction. 
 * 
 */
const Select = (query, value) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(errorCode.Error.DBCOnnectionError);
            } else {
                connection.query(query, value, (error, results) => {
                    if (error) {
                        connection.release();
                        reject(error);
                    } else {
                        connection.release();
                        resolve(results);
                    }
                });
            }
        });
    });
}

/** 
 * @function InsertData 
 * @param {query,value} Parameter User provided data 
 * @description This function will Insert data in Database. 
 */

const Insert = (query, value) => {
    return new Promise((resolve, reject) => {
        StartTransaction((err, conn) => {
            if (err) {
                reject(errorCode.Error.DBCOnnectionError);
            } else {
                conn.query(query, value, (err, result) => {
                    if (!err) {
                        resolve(result);
                        Commit(conn);
                    } else {
                        reject(err);
                        Rollback(conn);
                    }
                });
            }
        });
    });
}


/** 
 * @function Update 
 * @param {query,value} Parameter User provided data 
 * @description This function will Update data in Database. 
 */

const Update = (query, value) => {
    return new Promise((resolve, reject) => {
        StartTransaction((err, conn) => {
            if (err) {
                reject(errorCode.Error.DBCOnnectionError);
            } else {
                conn.query(query, value, (err, result) => {
                    if (!err) {
                        resolve(result);
                        Commit(conn);
                    } else {
                        reject(err);
                        Rollback(conn);
                    }
                });
            }
        });
    });
}

/** 
 * @function Delete 
 * @param {query,value} Parameter User provided data 
 * @description This function will Delete data from Database. 
 */

const Delete = (query, value) => {
    return new Promise((resolve, reject) => {
        StartTransaction((err, conn) => {
            if (err) {
                reject(errorCode.Error.DBCOnnectionError);
            } else {
                conn.query(query, value, (err, result) => {
                    if (!err) {
                        resolve(result);
                        Commit(conn);
                    } else {
                        reject(err);
                        Rollback(conn);
                    }
                });
            }
        });
    });
}

module.exports = {
    VcapServices,
    testDBConnection,
    Select,
    Insert,
    Update,
    Delete
};