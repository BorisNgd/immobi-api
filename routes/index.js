const apiRoutes = require('./apis');

const init = (server) => {
    server.get("*", (req, res, next) => {
        console.log('\x1b[32m', req.method +' : Request was made to : '  + req.originalUrl);
        console.log('\x1b[0m', '');
        return next();
    });

    server.post("*", (req, res, next) => {
        console.log('\x1b[32m','POST : Request was made to : ' + req.originalUrl);
        console.log('\x1b[0m', '');
        return next();
    });


    server.put("*", (req, res, next) => {
        console.log('\x1b[32m','PUT : Request was made to : ' + req.originalUrl);
        console.log('\x1b[0m', '');
        return next();
    });

    server.delete("*", (req, res, next) => {
        console.log('\x1b[32m','DELETE : Request was made to : ' + req.originalUrl);
        console.log('\x1b[0m', '');
        return next();
    });
    server.use('/api' , apiRoutes);
}

module.exports = {
    init: init,
};