const express = require('express')
const OrderController = require('./../controller/Orders')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')

router.get('/', checkAuth, OrderController.getAllOrder)
router.post('/checkout', checkAuth, OrderController.postOrder)
router.get('/:orderId', checkAuth, OrderController.getOrderDetail)
router.delete('/:orderId', checkAuth, OrderController.deleteOrderDetail)
module.exports = router
