const express = require('express');
const userService = require('../../services/user/user');
let router = express.Router();

const { jwtMW } = require('../../auth/');

router.post('/', jwtMW , userService.createUser);
router.get('/', jwtMW , userService.getUser);
router.put('/' , jwtMW , userService.updateUser);
router.get('/otp' ,  jwtMW , userService.verifyOtp);
router.post('/otp' , jwtMW  , userService.generateOtp);
router.get('/location' , jwtMW , userService.getUserLocation);
router.get('/locate' , jwtMW , userService.getDistanceFromLatLongKm);


module.exports = router;
