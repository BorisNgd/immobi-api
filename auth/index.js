var SECRET_KEY = "REST_API_ENDPOINT";

const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');

const jwtMW = exjwt({
    secret: SECRET_KEY
});

module.exports = { jwt, jwtMW, SECRET_KEY };
