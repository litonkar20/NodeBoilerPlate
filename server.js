"use strict"
const app = require("./server/app");
const https = require('https');
const logger = require('./server/helpers/logger/logger')
const fs = require('fs');

var options = {
    key: fs.readFileSync('./server/helpers/security/key.pem', 'utf8'),
    cert: fs.readFileSync('./server/helpers/security/server.crt', 'utf8')
};
const normalizePort = (val) => {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

const onError = (error) => {
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
    switch (error.code) {
        case "EACCES":
            logger.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            logger.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
    logger.info("Server Listening on " + JSON.stringify(bind));
};

const port = normalizePort(process.env.PORT || "8443");
app.set("port", port);

const server = https.createServer(options,app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
