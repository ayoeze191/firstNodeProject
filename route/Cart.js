const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')
const cartController = require('./../controller/Cart')
router.get('/', checkAuth, cartController.getCart)
router.post('/', checkAuth, cartController.addToCart)
router.delete('/:product', checkAuth, cartController.removeFromCart)
router.patch('/:product', checkAuth, cartController.reduceQuantity)
module.exports = router
