const { jwt, SECRET_KEY } = require("../../auth");
const randomize = require('randomatic');
const axios = require('axios').default;
let geoAPIURL = 'http://ip-api.com/json/';
let API = 'http://ip-api.com/json/?fields=status,message,lat,lon';

var coords = [
  {lat: 50.1161299 , lon:8.7088881 , name:'Zoo de Francort'},
	{lat: 40.7127837, lon: -74.0059413, name: 'New York, NY'},
	{lat: 34.0522342, lon: -118.2436849, name: 'Los Angeles, CA'},
	{lat: 37.3382082, lon: -121.8863286, name: 'San Jose, CA'},
	{lat: 41.8781136, lon: -87.6297982, name: 'Chicago, IL'},
	{lat: 47.6062095, lon: -122.3320708, name: 'Seattle, WA'},
	];


const updateToken = (req , res , next) =>{

  let phone = req.params.phone;
  let token = req.body.token;

  if(phone !== null && phone !== 'undefined' && phone !== ''){

    req.getConnection((error , conn) =>{
      if(error){
        res.status(500);
        res.json({
          succes:false,
          message:error.message
        });
      }else{
        conn.query('UPDATE customer SET token = ? WHERE phone_number = ?' , [ token , phone] , (error , rows , fields) =>{
          if(error){
            res.status(500);
            res.json({
              succes:false,
              message:error.message
            });
          }else{
            if(rows.affectedRows > 0){
              res.status(200);
              res.json({
                succes:true,
                message:"Token send successfully"
              })
            }else{
              res.status(500)
              res.json({
                succes:false,
                message:"Unable to update token"
              })
            }
          }
        })
      }
    })

  }else{
    res.status(522);
    res.json({
      succes:false,
      message:"Missing required parameter"
    });
  }

}

const createUser = (req, res, next) => {
  let user = req.body;
  let phoneNumber = user.phone;

  if (phoneNumber != null && phoneNumber != '') {
    var firstname = user.firstname;
    var lastname = user.lastname;
    var emailAddress = user.emailAddress;
    var state = user.state;
    var city = user.city;
    var street = user.street;
    var latitude = user.latitude;
    var longitude = user.longitude;
    var UUID = randomize('Aa0' , 30);

    req.getConnection((error, conn) => {
      conn.query(
        "SELECT * FROM customer WHERE phone_number = ?",
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
                message: `User alredy exist with phone Number ${phoneNumber}`
              });
            } else {
              conn.query("INSERT INTO `location`(`state`, `city`, `street`, `latitude`, `longitude`) VALUES (?,?,?,?,?)" , [
                state,
                city,
                street,
                latitude,
                longitude
              ] , (err , result) =>{
                if(err){
                  res.status(500);
                  res.json({
                    succes:false,
                    message:err.message
                  });
                }else{
                  let insertedId = result.insertId;
                  console.log('InsertedId', insertedId)
                  conn.query(
                    "INSERT INTO customer(firstname, lastname, email_address, phone_number, uuid , location_id ) VALUES(?,?,?,?,?,?)",
                    [
                      firstname,
                      lastname,
                      emailAddress,
                      phoneNumber,
                      UUID,
                      insertedId
                    ],
                    (err, rows, fields) => {
                      if (err) {
                        res.status(500);
                        res.json({
                          success: false,
                          message: err.message
                        });
                      } else {
                        if (rows.affectedRows > 0) {
                          res.status(202);
                          res.json({
                            success: true,
                            message: "User created"
                          });
                        } else {
                          res.status(404);
                          res.json({
                            success: false,
                            message: "Unable to create user"
                          });
                        }
                      }
                    }
                  );
                }
              })
            }
          }
        }
      );
    });
  } else {
    res.json({
      success: false,
      message: "phoneNumber is required"
    });
  }
};

const getUser = (req , res , next) => {

  let phoneNumber = req.params.phone;


    if(phoneNumber != null && phoneNumber != ''){
        req.getConnection((err , conn) =>{
            conn.query(' SELECT customer.id, customer.location_id, customer.firstname, customer.lastname, customer.email_address as emailAddress , customer.phone_number as phoneNumber, location.state , location.city , location.street , location.latitude , location.longitude , customer.uuid as UUID FROM customer INNER JOIN location ON customer.location_id = location.id WHERE phone_number = ? ' , [phoneNumber]
            , (err , rows , fields) => {
                if(err){
                    res.status(500);
                    res.json({success:false,
                    message:err.message});
                }else{
                    if(rows.length > 0){
                        res.status(202);
                        res.json({
                            success:true,
                            result:rows
                        });
                    }else{
                        res.status(202);
                        res.json({
                            success:false,
                            message: "No user found"
                        });
                    }
                }
            })
        })
    }else{
        res.status(500);
        res.json({
            success:false,
            message:"Phone number required or can't be  empty"
        })
    }
};

const updateUser = (req , res , next) =>{

  let user = req.body;
  let lastname = user.lastname;
  let firstname = user.firstname;
  let emailAddress = user.emailAddress;
  let city = user.city;
  let state = user.state;
  let street = user.street;
  let phoneNumber = req.params.phone;
  console.log('PHONE NUMBER', phoneNumber)

  if(phoneNumber != null && phoneNumber != '' && phoneNumber != 'undefined'){
    req.getConnection((err , conn)=>{
      if(err){
        res.status(500);
        res.json({
          succes:false,
          message:err.message
        });
      }else{
        conn.query('SELECT * FROM customer WHERE phone_number = ?' , [phoneNumber] , (err, rows ,fields) =>{
          if(err){
            res.status(500);
            res.json({
              succes:false,
              message:err.message
            })
          }else{
            if(rows.length > 0){
              console.log('ROWS', rows[0].location_id);
              let location = rows[0].location_id;
              conn.query('UPDATE `location` SET `state`= ? ,`city`= ? ,`street`= ? ,`latitude`= ? ,`longitude`= ? WHERE `id` = ?' , [state , city , street , "" , "" , location] , (err , results , fields) =>{
                if(err){
                  res.status(500);
                  res.json({
                    succes: false,
                    message:err.message
                  })
                }else{
                  if(results.affectedRows > 0){
                    conn.query('UPDATE customer SET firstname = ? , lastname = ? , email_address = ?  WHERE phone_number = ?' , [firstname , lastname , emailAddress , phoneNumber] , (err , rows , fields) =>{
                      if(err){
                        res.status(500);
                        res.json({
                          succes:false,
                          message:err.message
                        })
                      }else{
                        if(rows.affectedRows > 0){
                          res.status(202);
                          res.json({
                            succes:true,
                            message:'Updated successfull'
                          })
                        }else{
                          res.status(202);
                          res.json({
                            succes:false,
                            message:'Cannot update account'
                          })
                        }
                      }
                    })
                  }else{
                    res.status(202);
                    res.json({
                      succes:false,
                      message:'Cannot update account'
                    })
                  }
                }
              })

            }else{
              res.status(202);
              res.json({
                succes:false,
                message:'User not found'
              })
            }
          }
        })
      }
    })
  }else{
    res.status(522);
    res.json({
      succes:false,
      message:'Required parameter phone number is missing'
    });
  }
}

const verifyOtp = (req , res , next) =>{
  
  let user = req.query;
  var phoneNumber = req.body.phoneNumber;
  var otpCode = user.otpCode;

  if(phoneNumber != null && phoneNumber != ''){
    if(otpCode != null && otpCode != ''){
      req.getConnection((err , conn) =>{
        if(err){
          console.log('MYSQLERROR', err.message);
        }else{
          conn.query('SELECT phoneNumber FROM temp WHERE phoneNumber = ? LIMIT 1' , [phoneNumber] , (error , rows , fields) =>{
            if(err){
              res.status(500);
              res.json({
                success: false,
                message: error.message
              });
            }else{
              if(rows.length > 0){
                conn.query('SELECT * FROM temp WHERE phoneNumber = ? AND generateCode = ? ' , [phoneNumber ,otpCode] , (error , rows , fields)=>{
                  if(error){
                    res.status(500);
                    res.json({
                      success:false,
                      message:error.message
                    });
                  }else{
                    if(rows.length > 0){
                      conn.query('DELETE FROM temp WHERE phoneNumber = ?' , [phoneNumber] , (err , rows , fields) =>{
                        if(err){
                          res.status(500);
                          res.json({
                            success: false,
                            message:err.message
                      });
                        }else{
                          if(rows.affectedRows > 0){
                            res.status(202);
                            res.json({
                              success: true,
                              message:'Authenticate success'
                            });
                          }else{
                            res.status(500);
                            res.json({
                              success:false,
                              message:'Unable to detect error'
                            });
                          }
                        }
                      })
                  
                    }else{
                      res.status(500);
                      res.json({
                        succes:false,
                        message:'Invalid Code'
                      })
                    }
                  }
                })
              }else{
                res.status(500);
                res.json({
                  success:false,
                  message:'Unable to authenticate please enter correct optCode or generate again'
                });
              }
            }
          })
        }
      })
    }else{
      res.status(500);
      res.json({
        success:false,
        message:'Missing query required otp Code'
      });
    }
  }else{
    res.status(500);
    res.json({
      success:false,
      message:'Missing query required phone number'
    });
  }
};

const generateOtp = (req , res , next) =>{

  var phoneNumber = req.body.phoneNumber;
  var otpCode = randomize('0',5);

  if(phoneNumber != null && phoneNumber != ''){
    req.getConnection((error , conn) =>{
      conn.query('INSERT INTO temp(phoneNumber , generateCode) VALUES(?,?)' , [phoneNumber , otpCode] , (err , rows , fields) =>{
        if(err){
          res.status(500);
          res.json({
            success:false,
            message :err.message
          });
        }else{
          if(rows.affectedRows > 0){
            res.status(202);
            res.json({
              success:true,
              message : 'Your authentification code has been send !'
            });
          }else{
            res.status(500);
            res.json({
              succes:false,
              message:'Undefined error'
            })
          }
        }
      })
    });
  }else{
    res.status(400);
    res.json({
      success:false,
      message:'Required param phone number is missing'
    });
  }
}

const getUserLocation = (req , res , next) =>{

  axios.get(geoAPIURL).then(response =>{
    if(response.data !== null){
      if(response.data.status == 'success'){
        res.json({
          succes:true,
          data:response.data
        });
      }else{
        res.status(500);
        res.json({
          succes:false,
          message:response.data.message
        });
      }
    }else{
      res.status(402);
      res.json({
        succes:false,
        message:response.data.message
      });
    }
  }).catch(err =>{
    res.status(500);
    res.json({
      succes:false,
      message:err
    });
  });
  }

function deg2rad(deg) {
	return deg * (Math.PI/180)
}

 function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2-lat1);  // deg2rad below
	var dLon = deg2rad(lon2-lon1); 
	var a = 
		Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
		Math.sin(dLon/2) * Math.sin(dLon/2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; // Distance in km
	return d;
} 

const getDistanceFromLatLongKm = (req , res , next) =>{
  
  axios.get(API).then((response) =>{
    for(var i = 0; i < coords.length; i++) {
			var diff = getDistanceFromLatLonInKm(coords[i].lat, coords[i].lon, response.data.lat, response.data.lon);
      console.log('distance to ' + coords[i].name + ': ' + diff + ' km');
      res.status(202);
      res.json({
        succes:true,
        message:'Success',
        distanceInKm:+diff+' KM'
      })
		}

  }).catch((err)=>{
    res.status(500);
    res.json({
      succes:false,
      message:err
    });
    res.end();
  })
}



module.exports = {
  updateToken: updateToken,
  createUser: createUser,
  getUser: getUser,
  verifyOtp: verifyOtp ,
  generateOtp : generateOtp,
  updateUser: updateUser,
  getUserLocation: getUserLocation,
  getDistanceFromLatLongKm: getDistanceFromLatLongKm
};
