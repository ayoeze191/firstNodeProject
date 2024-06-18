const Cart = require('./../model/Cart')

function getCart(req, res, next) {
    Cart.find({ user: req.userData.userId })
        .populate('user', 'email _id')
        // .populate('items', 'quantity')
        .then((cart) => {
            return res.status(200).json({
                message: 'Succesfull',
                cart: cart,
            })
        })
}

function addToCart(req, res, next) {
    Cart.findOne({ user: req.userData.userId })
        .then((cart) => {
            if (cart) {
                const product = cart.items.find(
                    (cartItem) => cartItem.product == req.body.product
                )
                if (product) {
                    product.quantity++
                    return cart.save()
                } else {
                    cart.items.push({
                        product: req.body.product,
                        quantity: 1,
                    })
                    return cart.save()
                }
            } else {
                const newCart = new Cart({
                    user: req.userData.userId,
                    items: [
                        {
                            product: req.body.product,
                            quantity: 1,
                        },
                    ],
                })
                return newCart.save()
            }
        })
        .then((result) => {
            res.status(200).json({
                message: 'successfully added to cart',
            })
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                error,
            })
        })
}

function removeFromCart(req, res, next) {
    Cart.findOne({ user: req.userData.userId })
        .then((cart) => {
            if (cart) {
                cart.items = cart.items.filter(
                    (cartItem) =>
                        cartItem.product.toString() !== req.params.product
                )
                return cart.save() // Save the updated cart
            } else {
                // Handle case where cart is not found
                res.status(500).json({
                    message: 'No cart',
                })
            }
        })
        .then((response) => {
            res.status(200).json({
                message: 'Successfully deleted',
            })
        })
        .catch((err) => {
            res.status(500).json({
                message: err,
            })
        })
}

function reduceQuantity(req, res, next) {
    Cart.findOne({ user: req.userData.userId })
        .then((cart) => {
            if (cart) {
                const product = cart.items.find(
                    (cartItem) => cartItem.product == req.params.product
                )
                if (product) {
                    if (product.quantity !== 1) {
                        product.quantity--
                        return cart.save()
                    } else {
                        cart.items = cart.items.filter(
                            (cartItem) =>
                                cartItem.product.toString() !==
                                req.params.product
                        )
                        return cart.save()
                    }
                } else {
                    res.status(500).json({
                        message: 'Product is not in the cart',
                    })
                }
            }
        })
        .then((result) => {
            res.status(200).json({
                message: 'Succesfull',
            })
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({
                err: err,
            })
        })
}

module.exports = {
    getCart,
    addToCart,
    removeFromCart,
    reduceQuantity,
}
