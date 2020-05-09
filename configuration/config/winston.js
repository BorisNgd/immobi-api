var appRoot = require('app-root-path');
var winston = require('winston');

var options = {
    file: {
      level: 'info',
      format:winston.format.simple(),
      filename: `${appRoot}/logs/app.log`,
      handleExceptions: true,
      json: false,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: true,
      timestamp: function () {
        return (new Date().toLocaleTimeString());
    },
      prepend:true,
      prettyPrint:true,
    },
    console: {
      level: 'debug',
      handleExceptions: true,
      json: false,
      format:winston.format.simple(),
      colorize: true,
      prepend:true,
      prettyPrint:true,
      timestamp: function () {
        return (new Date()).toLocaleTimeString();
    },
    },
  };



  var logger =  winston.createLogger({
    transports: [
      new winston.transports.File(options.file),
      new winston.transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
  });

  winston.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'cyan',
    debug: 'green'
  });

  logger.stream = {
    write: function(message, encoding) {
      logger.info(message);
    },
  };

  module.exports = logger;