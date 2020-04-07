const { jwt, SECRET_KEY } = require('../../auth');

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

    req.getConnection((err , conn) =>{
        if(err){
            res.status(500);
            res.json({
                success:false,
                message:err.message
            })
        }else{
            conn.query('INSERT INTO housing(title, reference, area, price, status, description, numberRoom, localisationID, houseTypeID) VALUES (?,?,?,?,?,?,?,?,?)' , [title , reference , area , price , status ,description , numberRoom ,localizationID ,houseType] , (err , rows , fields) =>{
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
                            message:"House Created"
                        })
                    }else{
                        res.status(202);
                        res.json({
                            success:true,
                            message:"Uable to create house"
                        })
                    }
                }
            })
        }
    })
    
}

const getHouses = (req , res , next) =>{

    req.getConnection((error , conn)=>{
        if(error){
            res.status(500);
            res.json({
                success:false,
                message:error.message
            })
        }else{
            conn.query('SELECT houseID, title, reference, area, price, status, description, numberRoom, localisationID, houseTypeID FROM housing' , (err , rows , fields) =>{
                if(err){
                    res.status(500);
                    res.json({
                        success:false,
                        message:err.message
                    })
                }else{
                    if(rows.length > 0){
                        res.status(202);
                        res.json({
                            success:true,
                            data:rows
                        })
                    }else{
                        res.status(202);
                        res.json({
                            success:false,
                            message:'Empty result'
                        })
                    }
                }
            })
        }
    })
}

const updateHouse = (req , res , next) =>{

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

    if(houseID != null && houseID != ''){
      req.getConnection((err , conn) =>{
          if(err){
              res.status(500);
              res.json({
                  success:false,
                  message:err.message
              })
          }else{
              conn.query('UPDATE housing SET title= ?, reference= ?, area= ?, price= ? ,status= ?, description= ?, numberRoom= ?, localisationID = ?, houseTypeID = ? WHERE houseID = ?' , [title , reference , area , price , status , description , numberRoom , localizationID , houseType , houseID] , (err , rows , fields) => {
                  if(err){
                      res.status(500);
                      res.json({
                          success:false,
                          message: err.message
                      })
                  }else{
                      if(rows.affectedRows > 0){
                          res.status(202);
                          res.json({
                              success:true,
                              message:'Update done'
                          })
                      }else{
                          res.status(202);
                          res.json({
                              success:false,
                              message:'Unable to update'
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
            message:'Missing required parameter house'
        })
    }
}



module.exports = {
    createHouse: createHouse,
    getHouses: getHouses,
    updateHouse: updateHouse
  
};