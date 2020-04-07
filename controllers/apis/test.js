const express = require('express');
const testService = require('../../services/test/test');
let router = express.Router();

const { jwtMW } = require('../../auth/');

router.get('/', testService.helloWorld);
router.get('/secure' ,jwtMW ,testService.helloWorldSecure);

module.exports = router;
