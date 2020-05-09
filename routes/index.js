const apiRoutes = require('./apis');
const moment = require('moment');

const init = (server) => {
    server.use("*", (req, res, next) => {
        let dateTime = moment().format('DD/MMMM/YYYY:HH:mm:ss');
        let userAgent = res.locals.ua = req.get('User-Agent');
        let statusCode = res.statusCode;
        let HTTPVersion =  'HTTP/'+req.httpVersion;

        let remoteAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('\x1b[32m','['+moment().format('DD/MMMM/YYYY:HH:mm:ss')+']  '  + '\x1b[0m' +'\033[43m' , req.method +' \x1b[0m' + ' \033[34m' + req.originalUrl +' \x1b[0m ' +'\033[41m '+ remoteAddress +  ' \x1b[0m  ' +userAgent + ' '+ statusCode + ' ' + HTTPVersion);
        console.log('\x1b[0m', '');
        return next();
    });

    server.use('/api' , apiRoutes);
}

module.exports = {
    init: init,
};