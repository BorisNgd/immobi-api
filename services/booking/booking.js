const { jwt, SECRET_KEY } = require("../../auth");

const createBooking = (req, res, next) => {
  let booking = req.body;
  var period = booking.period;
  var status = booking.status;
  var price = booking.price;
  var information = booking.information;
  var comment = booking.comment;
  var userID = booking.userID;
  var houseID = booking.houseID;

  if (booking.userID != null && booking.houseID != null) {
    req.getConnection((err, conn) => {
      if (err) {
        res.status(500);
        res.json({
          success: false,
          message: err.message
        });
      } else {
        conn.query(
          "INSERT INTO booking(period, status, bookingPrice, bookingInformation, bookingComment, usersID, houseID) VALUES (?,?,?,?,?,?,?)",
          [period, status, price, information, comment, userID, houseID],
          (error, rows, fields) => {
            if (error) {
              res.status(500);
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
                res.status(500);
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
  var phoneNumber = req.query.phoneNumber;

  if (phoneNumber != null && phoneNumber != "") {
    phoneNumber = "+" + phoneNumber;
    req.getConnection((err, conn) => {
      if (err) {
        res.status(500);
        res.json({
          success: false,
          message: err.message
        });
      } else {
        conn.query(
          "SELECT bookingID, bookingDate, period, status, bookingPrice, bookingInformation, bookingComment, typePayment, usersID, houseID FROM booking INNER JOIN users ON booking.usersID = users.userID  WHERE users.phoneNumber = ? ",
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
                  success: false,
                  data: rows
                });
              } else {
                res.status(202);
                res.json({
                  success: false,
                  message: "Empty result"
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
