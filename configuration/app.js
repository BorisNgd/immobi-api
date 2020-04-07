const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const myConnection = require('express-myconnection')
const mysql = require('mysql');
const expressip = require('express-ip');

let appDir = path.dirname(require.main.filename);
const publicDir = appDir + '/public';

let config = require('./database');

let dbOptions = {
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    port: config.database.port,
    database: config.database.database
}

module.exports = () => {
    let server = express(), create, start;

    create = (config , database) => {
        let routes = require('../routes');

        //set all the server things
        server.set('env', config.env);
        server.set('port', config.port);
        server.set('hostname', config.hostname);

        //add middleware
        server.use(bodyParser.json());
        server.use(bodyParser.urlencoded({ extended: false}));
        server.use(express.static(publicDir));
        server.use(myConnection(mysql, dbOptions, 'pool'));
        //server.use(expressip().getIpInfoMiddleware);

        //routes
        routes.init(server);

        server.use((err, req, res, next) => {
            if (err.name === 'UnauthorizedError') {
                res.status(401).send(
                    {
                        success: false,
                        message: 'Access denied'
                    });
            } else {
                res.setHeader('Access-Control-Allow-Headers',
                    'Content-Type',
                    'Authorization'
                );

                next();

            }

        });
    };


    start = () => {
        let hostname = server.get('hostname');
        let port = server.get('port');
        server.listen(port, () => {
            console.log('\x1b[43m','Server  running on  - http://' + hostname + ':' + port);
            console.log('\x1b[0m', '');
        });
    };

    return {
        create: create,
        start: start
    };

};