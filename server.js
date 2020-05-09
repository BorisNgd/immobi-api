

const server = require('./configuration/app')();
const config = require('./configuration/config/config');
const database = require('./configuration/database');

//create the basic server setup
server.create(database);

//start the server
server.start();