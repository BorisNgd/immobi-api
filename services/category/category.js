const { jwt, SECRET_KEY } = require('../../auth');

const createCategory = (req, res, next) => {

    let category = req.body;
    let type_name = category.name;

    if(category != null && category != undefined ){

        if(type_name != null && type_name != ''){

            req.getConnection((err , conn) =>{
                if(err){
                    res.status(500);
                    res.json({
                        success:false,
                        message:err.message
                    })
                }else{
                    conn.query('INSERT INTO `house_type`(`name`) VALUES (?)' , [type_name] , (err , rows , fields) =>{
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
                                    message:"Category Created"
                                })
                            }else{
                                res.status(202);
                                res.json({
                                    success:true,
                                    message:"Unable to create category"
                                })
                            }
                        }
                    })
                }
            })
        }else{
            res.status(522).json({
                success:false,
                message:"Required params is missing [type name]"
            })
        }

    }else{
        res.status(522).json({
            success:false,
            message:"Missing body"
        });
    }

}

const getCategory = (req , res , next) =>{

    req.getConnection((error , conn)=>{
        if(error){
            res.status(500);
            res.json({
                success:false,
                message:error.message
            })
        }else{
            conn.query('SELECT `id`, `name` FROM `house_type` ' , (err , rows , fields) =>{
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

const updateCategory = (req , res , next) =>{

    let category = req.body;
    let categoryId = req.params.id;

    if(categoryId != null && categoryId != ''){

        if(category.name != null && category.name != ''){

            req.getConnection((err , conn) =>{
                if(err){
                    res.status(500);
                    res.json({
                        success:false,
                        message:err.message
                    })
                }else{
                    conn.query('UPDATE `house_type` SET `name`= ? WHERE id = ?' , [category.name , categoryId] , (err , rows , fields) => {
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
                                    message:'Unable to update category'
                                })
                            }

                        }
                    })
                }
            })
        }else{
            res.status(522);
            res.json({
                success:false,
                message:"Missing required body"
            })
        }
    

    }else{
        res.status(500);
        res.json({
            success:false,
            message:'Missing required parameter house'
        })
    }
}

const categoryDetails = (req ,  res , next) =>{

    
    let categoryId = req.params.id;

    if(categoryId != null && categoryId != ''){
        req.getConnection((err , conn) =>{
            if(err){
                res.status(500);
                res.json({
                    success:false,
                    message:err.message
                })
            }else{
                conn.query('SELECT `id` , `name` FROM `house_type` WHERE  `id` = ?' , [categoryId ] , (err , rows , fields) => {
                    if(err){
                        res.status(500);
                        res.json({
                            success:false,
                            message: err.message
                        })
                    }else{
                        if(rows.length > 0){
                            res.status(202);
                            res.json({
                                success:true,
                                message:'fetch data successfully',
                                data:rows
                            })
                        }else{
                            res.status(202);
                            res.json({
                                success:false,
                                message:'empty result'
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
              message:'Missing required parameter category'
          })
      }


}

module.exports = {
    createCategory: createCategory,
    categoryDetails:categoryDetails,
    getCategory: getCategory,
    updateCategory: updateCategory,
};