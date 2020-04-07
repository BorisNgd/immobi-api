const express = require('express');
const bookingService = require('../../services/booking/booking');
let router = express.Router();

const { jwtMW } = require('../../auth/')

router.get('/', jwtMW ,bookingService.getBookingByUser);
router.get('/all' , jwtMW ,bookingService.getBookings);
router.put('/' , jwtMW , bookingService.updateStatus);
router.post('/'  ,jwtMW, bookingService.createBooking);

module.exports = router;
