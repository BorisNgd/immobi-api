const testController = require('../../controllers/apis/test');
const keyController = require('../../controllers/apis/key');
const userController = require('../../controllers/apis/user');
const bookingController = require('../../controllers/apis/booking');
const houseController = require('../../controllers/apis/house');
const categoryController = require('../../controllers/apis/category');

const express = require('express');
let router = express.Router();

//DEVELOPMENT
router.use('/test', testController);

//PRODUCTION
router.use('/key', keyController);
router.use('/user' , userController);
router.use('/booking' , bookingController);
router.use('/house' , houseController);
router.use('/category' , categoryController);
module.exports = router;