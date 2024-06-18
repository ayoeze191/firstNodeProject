const Product = require('./../model/Product')
const mongoose = require('mongoose')
// const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })
function getAllProducts(req, res) {
    Product.find()
        .select('name price _id productImage category')
        .populate('category', 'title')
        .exec()
        .then((products) => {
            const allProducts = products.map((prod) => {
                return {
                    name: prod.name,
                    price: prod.price,
                    productImage: prod.productImage,
                    category: prod.category,
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

function postProduct(req, res, next) {
    const prod = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path,
        category: req.body.category,
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
    Product.findById(req.params.id)
        .select('price name _id productImage category')
        .populate('category', 'title')
        .then((doc) => {
            if (doc) {
                res.status(200).json({
                    message: 'succesfull',
                    data: doc,
                })
            } else {
                res.status(200).json('No product with that id found')
            }
        })
        .catch((error) => {
            res.status(200).json({
                error,
                message: 'There is no such product ',
            })
        })
}

function updateProduct(req, res) {
    const updatedVersion = {}
    for (key in req.body) {
        updatedVersion[key] = req.body[key]
    }
    updatedVersion['productImage'] = req.file.path
    Product.findByIdAndUpdate(req.params.productId, updatedVersion)
        .then((result) => {
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
    const prod = Product.findByIdAndDelete(req.params.productId)
        .then((result) => {
            if (result) {
                res.status(200).json({
                    message: 'Succesfully Deleted',
                })
            } else {
                res.status(500).json({
                    message: 'Succesfully Deleted',
                })
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({
                error: err,
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
