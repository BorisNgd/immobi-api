const express = require('express');
const keyService = require('../../services/key/key');
let router = express.Router();

router.get('/', keyService.getKey);

module.exports = router;
