const express = require('express');
const categoryService = require('../../services/category/category');
let router = express.Router();

const { jwtMW } = require('../../auth/')

router.get('/all' , jwtMW ,categoryService.getCategory);
router.get('/details/:id' , jwtMW , categoryService.categoryDetails)
router.put('/update/:id' , jwtMW , categoryService.updateCategory);
router.post('/create'  ,jwtMW, categoryService.createCategory);

module.exports = router;
