const mongoose = require('mongoose')
const Order = require('./../model/Order')
const Cart = require('./../model/Cart')

function getAllOrder(req, res) {
    Order.find()
        .where({ owner: req.userData.userId })
        .select('product quantity _id')
        .populate('product', 'price name')
        .then((docs) => {
            const allOrder = docs.map((order) => {
                return {
                    orders: docs,
                    request: {
                        type: 'GET',
                        url: `localhost:3000/orders/${order._id}`,
                    },
                }
            })
            res.status(200).json({ counts: allOrder.length, order: allOrder })
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            })
        })
}

async function postOrder(req, res) {
    try {
        const cart = await Cart.findOne({ user: req.userData.userId }).populate(
            'items.product'
        )
        const totalPrice = cart.items.reduce((accumulator, currentValue) => {
            return (
                accumulator + currentValue.product.price * currentValue.quantity
            )
        }, 0)
        const reFormedCart = cart.items.map((cartItem) => {
            return (
                cartItem && {
                    ...cartItem,
                    price: cartItem.product.price * cartItem.quantity,
                }
            )
        })
        const order = new Order({
            user: req.userData.userId,
            items: [...reFormedCart],
            shippingAddress: {
                street: req.body.street,
                city: req.body.city,
                state: req.body.state,
                postalCode: req.body.postalCode,
                country: req.body.country,
            },
            totalPrice: totalPrice,
            status: 'Pending',
        })
        await order.save()
        await Cart.findOneAndDelete({ user: req.userData.userId })
        res.status(200).json({
            message: 'Succesfull',
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            message: err,
        })
    }
}

function getOrderDetail(req, res) {
    Order.findById(req.params.orderId)
        .select('user _id items shippingAddress totalPrice status placedAt')
        .populate('items.product')
        .exec()
        .then((order) => {
            if (!order) {
                return res.status(404).json({
                    message: 'Order not found',
                })
            }
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders',
                },
            })
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            })
        })
}

function deleteOrderDetail(req, res) {
    Order.findByIdAndDelete(req.params.orderId)
        .exec()
        .then(() => {
            res.status(500).json({
                message: 'Order deleted',
                request: {
                    type: 'POST',
                    url: 'http://local:3000/orders',
                    body: { productId: 'ID', quantity: 'Number' },
                },
            })
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            })
        })
}

module.exports = {
    getAllOrder,
    postOrder,
    getOrderDetail,
    deleteOrderDetail,
}
