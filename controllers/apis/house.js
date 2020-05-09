const express = require('express');
const houseService = require('../../services/house/house');
let router = express.Router();

const { jwtMW }  = require('../../auth/')

router.post('/create', jwtMW , houseService.createHouse);
router.get('/all' , jwtMW , houseService.getHouses);
router.put('/update' , jwtMW , houseService.updateHouse);
router.get('/details/:id' , jwtMW , houseService.houseDetails);
router.get('/search/filter/:id' , jwtMW , houseService.houbeByCategoryAndCity);

module.exports = router;
