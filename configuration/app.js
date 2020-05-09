const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const myConnection = require('express-myconnection')
const mysql = require('mysql');
const expressip = require('express-ip');
const morgan = require('morgan');
const winston = require('./config/winston');

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

    create = (database) => {
        let routes = require('../routes');

        //set all the server things
        //server.set('env', config.env);
        server.set('port', process.env.PORT || 3000);
        server.set('hostname', 'http://localhost');

        //add middleware
        server.use(bodyParser.json());
        server.use(bodyParser.urlencoded({ extended:true}));
        server.use(express.static(publicDir));
        server.use(myConnection(mysql, dbOptions, 'pool'));
        //server.use(expressip().getIpInfoMiddleware);
        server.use(morgan('combined' , {stream:winston.stream}));
        
        //error handler
        server.use(function(err , req , res , next) {
            res.locals.message = err.message;
            res.locals.error = req.server.get('env') === 'development' ? err : {};

            winston.error(`${err.status || 500} - ${err.message} - ${req.orginalUrl} - ${req.method} - ${req.ip}`);

            res.status(err.status || 500);
            res.render('error'); 
        })

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