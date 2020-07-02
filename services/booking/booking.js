const { jwt, SECRET_KEY } = require("../../auth");

const createBooking = (req, res, next) => {
  let booking = req.body;
  let date = new  Date();
  let bookingDate = date.toISOString().slice(0 , 19).replace('T' , ' ');
  var startDate = booking.start_date;
  var endDate = booking.end_date;
  var status = 0;
  var paymentType = 0
  var price = booking.price;
  var information = booking.information;
  var comment = booking.comment;
  var userID = booking.userID;
  var houseID = booking.houseID;

  if (booking.userID != null && booking.houseID != null) {
    req.getConnection((err, conn) => {
      if (err) {
        res.status(200);
        res.json({
          success: false,
          message: err.message
        });
      } else {
        conn.query(
          "INSERT INTO `booking`(`house_id`, `customer_id`, `date`, `start_date`, `end_date`, `status`, `price`, `information`, `comment`, `payment_type`) VALUES (?,?,?,?,?,?,?,?,?,?)",
          [houseID , userID , bookingDate , startDate , endDate , status , price , information , comment , paymentType],
          (error, rows, fields) => {
            if (error) {
              res.status(200);
              res.json({
                success: false,
                message: error.message
              });
            } else {
              if (rows.affectedRows > 0) {
                res.status(200);
                res.json({
                  success: true,
                  message: "Booking create successfully"
                });
              } else {
                res.status(200);
                res.json({
                  success: false,
                  message: "Unable to create booking"
                });
              }
            }
          }
        );
      }
    });
  } else {
    res.status(400);
    res.json({
      success: false,
      message: "Required params userID & houseID is missing"
    });
  }
};

const getBookingByUser = (req, res, next) => {
  var phoneNumber = req.params.phone;

  if (phoneNumber != null && phoneNumber != "") {
    req.getConnection((err, conn) => {
      if (err) {
        res.status(500);
        res.json({
          success: false,
          message: err.message
        });
      } else {
    
        conn.query("SELECT booking.id, house.title , booking.house_id, booking.customer_id, booking.date, booking.start_date, booking.end_date, booking.status, booking.price, booking.information, booking.comment, booking.payment_type FROM booking INNER JOIN house ON booking.house_id = house.id INNER JOIN customer ON booking.customer_id = customer.id WHERE phone_number = ?",
          [phoneNumber],
          (err, rows, fields) => {
            if (err) {
              res.status(500);
              res.json({
                success: false,
                message: err.message
              });
            } else {
              if (rows.length > 0) {
                res.status(202);
                res.json({
                  success:true,
                  data: rows
                });
              } else {
                res.status(202);
                res.json({
                  success: false,
                  data: [],
                });
              }
            }
          }
        );
      }
    });
  } else {
    res.status(500);
    res.json({
      success: false,
      message: "Missing required param phone number"
    });
  }
};

const getBookings = (req, res, next) => {
  req.getConnection((err, conn) => {
    if (err) {
      res.status(500);
      res.json({
        success: false,
        message: err.message
      });
    } else {
      conn.query("SELECT * FROM booking", (err, rows, fields) => {
        if (err) {
          res.json({
            success: false,
            message: err.message
          });
        } else {
          if (rows.length > 0) {
            res.json({
              success: true,
              message: rows
            });
          } else {
            res.json({
              success: true,
              message: "Empty booking"
            });
          }
        }
      });
    }
  });
};

const updateStatus = (req , res , next) =>{

    let bookingID = req.query.id;
    let status = req.body.status;

    if(bookingID != null && bookingID != ''){
        req.getConnection((err , conn) =>{
            if(err){
                res.status(500);
                res.json({
                    success:false,
                    message:err.message
                })
            }else{
                conn.query('UPDATE booking SET status = ? WHERE bookingID = ?' , [status , bookingID] , (err , rows , fields) =>{
                    if(err){
                        res.status(500);
                        res.json({
                            success:false,
                            message:err.message
                        })
                    }else{
                        if(rows.affectedRows > 0){
                            res.status(202);
                            res.json({
                                success:true,
                                message:'Updated status successful'
                            })
                        }else{
                            res.status(500);
                            res.json({
                                success:false,
                                message:'Unable to update status'
                            })
                        }
                    }
                })
            }
        })
    }else{
        res.status(500);
        res.json({
            success:false,
            message:'Missing required param bookingID'
        })
    }
}

module.exports = {
  createBooking: createBooking,
  getBookingByUser: getBookingByUser,
  getBookings: getBookings,
  updateStatus: updateStatus
};
