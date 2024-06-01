const Product = require('./../model/Product')
const mongoose = require('mongoose')

function getAllProducts(req, res) {
    Product.find()
        .select('name price _id')
        .exec()
        .then((products) => {
            const allProducts = products.map((prod) => {
                return {
                    name: prod.name,
                    price: prod.price,
                    _id: prod._id,
                    request: {
                        type: 'GET',
                        url: `localhost:3000/products/${prod._id}`,
                    },
                }
            })
            res.status(200).json({
                count: allProducts.length,
                message: { allProducts },
            })
        })
}

function postProduct(req, res) {
    const prod = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
    })
    prod.save().then((prod) => {
        res.status(200).json({
            name: prod.name,
            price: prod.price,
            _id: prod._id,
            request: {
                type: 'GET',
                url: `localhost:3000/products/${prod._id}`,
            },
        })
    })
}

function productDetail(req, res) {
    console.log(req.params.id)
    Product.findById(req.params.id).then((doc) => {
        if (doc) {
            res.status(200).json({
                message: 'succesfull',
                data: doc,
            })
        } else {
            res.status(200).json('No product with that id found')
        }
    })
}

function updateProduct(req, res) {
    const updatedVersion = {}
    for (key in req.body) {
        updatedVersion[key] = req.body[key]
    }
    Product.findByIdUpdate(req.params.productId, updatedVersion)
        .then((res) => {
            res.status(200).json({ message: 'Successfully updated' })
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({
                error: err,
            })
        })
}

function DeleteProduct(req, res) {
    const prod = Product.findByIdAndDelete(req.params.productId).then((res) => {
        res.status(200)
            .json({
                message: 'Succesfully Deleted',
            })
            .catch((err) => {
                console.log(err)
                res.status(500).json({
                    error: err,
                })
            })
    })
}

module.exports = {
    getAllProducts,
    DeleteProduct,
    updateProduct,
    postProduct,
    productDetail,
}
