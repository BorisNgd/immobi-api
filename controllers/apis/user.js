const express = require('express');
const userService = require('../../services/user/user');
let router = express.Router();

const { jwtMW } = require('../../auth/');
const { updateToken } = require('../../services/user/user');
const user = require('../../services/user/user');

router.post('/registration', jwtMW , userService.createUser);
router.get('/information/:phone', jwtMW , userService.getUser);
router.put('/update/:phone' , jwtMW , userService.updateUser);
router.get('/otp' ,  jwtMW , userService.verifyOtp);
router.post('/otp' , jwtMW  , userService.generateOtp);
router.get('/location' , jwtMW , userService.getUserLocation);
router.get('/locate' , jwtMW , userService.getDistanceFromLatLongKm);
router.post('/token/:phone' , jwtMW , user.updateToken);


module.exports = router;
