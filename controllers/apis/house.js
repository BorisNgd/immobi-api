const express = require('express');
const houseService = require('../../services/house/house');
let router = express.Router();

const { jwtMW }  = require('../../auth/')

router.post('/', jwtMW , houseService.createHouse);
router.get('/' , jwtMW , houseService.getHouses);
router.put('/' , jwtMW , houseService.updateHouse);

module.exports = router;
