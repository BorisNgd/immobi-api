const express = require('express');
const bookingService = require('../../services/booking/booking');
let router = express.Router();

const { jwtMW } = require('../../auth/')

router.get('/user/:phone', jwtMW ,bookingService.getBookingByUser);
router.get('/all' , jwtMW ,bookingService.getBookings);
router.put('/update' , jwtMW , bookingService.updateStatus);
router.post('/create'  ,jwtMW, bookingService.createBooking);

module.exports = router;
