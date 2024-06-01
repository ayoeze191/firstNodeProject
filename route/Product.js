const express = require('express')
const router = express.Router();
const products = require('./../controller/Product')

router.get('/', products.getAllProducts)
router.post('/', products.postProduct)
router.get('/:id', products.productDetail)
router.patch(':/productId', products.updateProduct)
module.exports = router