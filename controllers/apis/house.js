const express = require('express');
const houseService = require('../../services/house/house');
let router = express.Router();

const { jwtMW }  = require('../../auth/')

router.post('/create', jwtMW , houseService.createHouse);
router.get('/all' , jwtMW , houseService.getHouses);
router.put('/update' , jwtMW , houseService.updateHouse);
router.get('/details/:id' , jwtMW , houseService.houseDetails);
router.get('/search/filter/:id' , jwtMW , houseService.houbeByCategoryAndCity);
router.get('/attachments/:id' , jwtMW , houseService.getHouseAttachments);
router.get('/genres' , jwtMW , houseService.getHouseByHouseType);
router.get('/home' , houseService.getHouseByGenre);
router.get('/search/house' , houseService.searchHouse);

module.exports = router;
