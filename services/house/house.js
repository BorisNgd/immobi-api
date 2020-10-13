const {
    jwt,
    SECRET_KEY
} = require('../../auth');

const createHouse = (req, res, next) => {

    let house = req.body;
    let title = house.title;
    let reference = house.reference;
    let area = house.area;
    let price = house.price;
    let status = house.status;
    let description = house.description;
    let numberRoom = house.numberRoom;
    let localizationID = house.localizationID;
    let houseType = house.houseType;

    req.getConnection((err, conn) => {
        if (err) {
            res.status(500);
            res.json({
                success: false,
                message: err.message
            })
        } else {
            conn.query('INSERT INTO housing(title, reference, area, price, status, description, numberRoom, localisationID, houseTypeID) VALUES (?,?,?,?,?,?,?,?,?)', [title, reference, area, price, status, description, numberRoom, localizationID, houseType], (err, rows, fields) => {
                if (err) {
                    res.status(500);
                    res.json({
                        success: false,
                        message: err.message
                    })
                } else {
                    if (rows.affectedRows > 0) {
                        res.status(202);
                        res.json({
                            success: true,
                            message: "House Created"
                        })
                    } else {
                        res.status(202);
                        res.json({
                            success: true,
                            message: "Uable to create house"
                        })
                    }
                }
            })
        }
    })

}

const getHouses = (req, res, next) => {

    req.getConnection((error, conn) => {
        if (error) {
            res.status(500);
            res.json({
                success: false,
                message: error.message
            })
        } else {
            conn.query('SELECT house.id, house.house_type_id, house.location_id, house.title, house.reference, house.area, house.price, house.status, house.picture, house.description, house.number_of_room, house.number_of_bed_room, house.number_of_kitchen_room, house.number_of_living_room, house.visitor_count, house.entrance_condition, house.promote, location.state , location.city , location.street , location.latitude , location.longitude , house_type.name , house.created_at, house.updated_at FROM house INNER JOIN location ON house.location_id = location.id INNER JOIN house_type ON house.house_type_id = house_type.id', (err, rows, fields) => {
                if (err) {
                    res.status(500);
                    res.json({
                        success: false,
                        message: err.message
                    })
                } else {
                    if (rows.length > 0) {
                        res.status(202);
                        res.json({
                            success: true,
                            data: rows
                        })
                    } else {
                        res.status(202);
                        res.json({
                            success: false,
                            message: 'Empty result'
                        })
                    }
                }
            })
        }
    })
}

const updateHouse = (req, res, next) => {

    let houseID = req.query.house
    let house = req.body;
    let title = house.title;
    let reference = house.reference;
    let area = house.area;
    let price = house.price;
    let status = house.status;
    let description = house.description;
    let numberRoom = house.numberRoom;
    let localizationID = house.localizationID;
    let houseType = house.houseType;

    if (houseID != null && houseID != '') {
        req.getConnection((err, conn) => {
            if (err) {
                res.status(500);
                res.json({
                    success: false,
                    message: err.message
                })
            } else {
                conn.query('UPDATE housing SET title= ?, reference= ?, area= ?, price= ? ,status= ?, description= ?, numberRoom= ?, localisationID = ?, houseTypeID = ? WHERE houseID = ?', [title, reference, area, price, status, description, numberRoom, localizationID, houseType, houseID], (err, rows, fields) => {
                    if (err) {
                        res.status(500);
                        res.json({
                            success: false,
                            message: err.message
                        })
                    } else {
                        if (rows.affectedRows > 0) {
                            res.status(202);
                            res.json({
                                success: true,
                                message: 'Update done'
                            })
                        } else {
                            res.status(202);
                            res.json({
                                success: false,
                                message: 'Unable to update'
                            })
                        }

                    }
                })
            }
        })

    } else {
        res.status(500);
        res.json({
            success: false,
            message: 'Missing required parameter house'
        })
    }
}

const houseDetails = (req, res, next) => {

    let houseId = req.params.id;
    if (houseId != '' && houseId != 'undefined' && houseId != null) {
        req.getConnection((error, conn) => {
            if (error) {
                res.status(500);
                res.json({
                    success: false,
                    message: error.message
                })
            } else {
                conn.query('SELECT `id`, `house_type_id`, `location_id`, `title`, `reference`, `area`, `price`, `status`, `picture`, `description`, `number_of_room`, `number_of_bed_room`, `number_of_kitchen_room`, `number_of_living_room`, `visitor_count`, `entrance_condition`, `promote`, `created_at`, `updated_at` FROM `house` WHERE id = ?', [houseId], (err, rows, fields) => {
                    if (err) {
                        res.status(500);
                        res.json({
                            success: false,
                            message: err.message
                        })
                    } else {
                        if (rows.length > 0) {
                            res.status(202);
                            res.json({
                                success: true,
                                data: rows
                            })
                        } else {
                            res.status(202);
                            res.json({
                                success: false,
                                message: `House not fount with id ${houseId}`
                            })
                        }
                    }
                })
            }
        })
    } else {
        res.status(500);
        res.json({
            status: false,
            message: "Required param houseId"
        })
    }


}

const houbeByCategoryAndCity = (req, res, next) => {

    let type = req.query.type;
    let street = req.query.street;
    let city = req.query.city;
    let houseId = req.params.id;

    req.getConnection((error, conn) => {
        if (error) {
            res.status(500);
            res.json({
                success: false,
                message: error.message
            });
        } else {

            conn.query(' SELECT house.id, house.house_type_id, house.location_id, house.title, house.reference, house.area, house.price, house.status, house.picture, house.description, house.number_of_room, house.number_of_bed_room, house.number_of_kitchen_room, house.number_of_living_room, house.visitor_count, house.entrance_condition, house.promote, house.created_at, house.updated_at FROM house  INNER JOIN location ON house.location_id = location.id INNER JOIN house_type ON house.house_type_id = house_type.id WHERE house_type_id LIKE "%' + type + '%" AND city LIKE "%' + city + '%" AND street LIKE "%' + street + '%" AND NOT(house.id = ?) ', [houseId], (error, rows, fields) => {
                if (error) {
                    res.status(500);
                    res.json({
                        success: false,
                        message: error.message
                    });
                } else {
                    if (rows.length > 0) {
                        res.status(202);
                        res.json({
                            success: true,
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
            });
        }
    });
}

const getHouseAttachments = (req, res, next) => {

    let houseId = req.params.id;

    if (houseId != '' && houseId != null && houseId != 'undefined') {
        req.getConnection((error, conn) => {
            if (error) {
                res.status(500);
                res.json({
                    success: false,
                    message: error.message
                });
            } else {
                conn.query('SELECT `id`, `house_id`, `image`, `created_at`, `updated_at` FROM `attachment` WHERE `house_id` = ? ', [houseId], (error, rows, fields) => {
                    if (error) {
                        res.status(500);
                        res.json({
                            success: false,
                            message: error.message
                        });
                    } else {
                        if (rows.length > 0) {
                            res.status(202);
                            res.json({
                                success: true,
                                attachments: rows
                            });
                        } else {
                            res.status(202);
                            res.json({
                                success: false,
                                message: `No attachment found with id ${houseId}`
                            });
                        }
                    }

                });
            }
        })
    }else{
        res.status(500);
        res.json({
            success:false,
            message:"Required parameter missing or empty"
        })
    }
}

const getHouseByHouseType = ((req , res , next) =>{

    req.getConnection((err , conn) =>{
        if(err){
            res.status(500);
            res.json({
                success:false,
                message:err.message
            });
        }else{
            conn.query("SELECT `id`, `name` FROM `house_type`" , (error , results , fields) =>{
                if(error){
                    res.status(500);
                    res.json({
                        success:false,
                        message:error.message
                    });
                }else{
                    if(results.length > 0){
                        let house_type = results;
                        conn.query("SELECT `id`, `house_type_id`, `location_id`, `title`, `reference`, `area`, `price`, `status`, `picture`, `description`, `number_of_room`, `number_of_bed_room`, `number_of_kitchen_room`, `number_of_living_room`, `visitor_count`, `entrance_condition`, `promote`, `created_at`, `updated_at` FROM `house` " , (error , results , fields) =>{
                            if(error){
                                res.status(500);
                                res.json({
                                    success:false,
                                    message:error.message
                                });
                            }else{
                                if(results.length > 0){
                                   let houses = results;

                                   for(let i = 0 ; i < house_type.length ; i++){
                                       let arrayHouses = [];
                                       for(let x = 0 ; x < houses.length; x++){
                                           if(house_type[i].id == houses[x].house_type_id){
                                               arrayHouses.push(houses[x]);
                                           }
                                       }
                                        house_type[i].houses = arrayHouses;

                                   }
                                   let data = [];
                                   let banners = [
                                       {
                                       "id":1,
                                       "name":"Thop & Yamo 4",
                                       "image":"tomates.jpg"
                                    },
                                    {
                                        "id":2,
                                        "name":"Thop & Yamo 4",
                                        "image":"tomates.jpg"
                                     },
                                     {
                                        "id":3,
                                        "name":"Thop & Yamo 4",
                                        "image":"tomates.jpg"
                                     },
                                     {
                                        "id":4,
                                        "name":"Thop & Yamo 4",
                                        "image":"tomates.jpg"
                                     },
                                ]
                                   data.push(house_type);
                                   data.push(banners)
                                    res.status(202);
                                    res.json({
                                        success:true,
                                        data:house_type,
                                        banners:banners
                                    })
                                }else{
                                    res.status(202);
                                    res.json({
                                        success:false,
                                        message:"Product found"
                                    })
                                }
                            }
                        })
                    }else{
                        res.status(202);
                        res.json({
                            success:false,
                            message:"No category found"
                        })
                    }

                }
            })
        }
    })

})

module.exports = {
    createHouse: createHouse,
    getHouses: getHouses,
    updateHouse: updateHouse,
    houseDetails: houseDetails,
    houbeByCategoryAndCity: houbeByCategoryAndCity,
    getHouseByHouseType: getHouseByHouseType,
    getHouseAttachments: getHouseAttachments,

};