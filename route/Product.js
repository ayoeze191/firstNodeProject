/**
 * @swagger
 * components:
 * schemas:
 * Product:
 *          type: object
 *          required:
 *          - title
 *          - description
 */

const checkAuth = require('../middleware/check-auth')
const { isAdmin } = require('../middleware/check-permissionType')

const express = require('express')
const router = express.Router()
const products = require('./../controller/Product')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    },
})
const filefilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, false)
    } else {
        cb(null, true)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: filefilter,
})
router.get('/', products.getAllProducts)
router.post(
    '/',
    upload.single('productImage'),
    checkAuth,
    isAdmin,
    products.postProduct
)
router.get('/:id', products.productDetail)
router.patch(
    '/:productId',
    upload.single('productImage'),
    checkAuth,
    isAdmin,
    products.updateProduct
)
router.delete('/:productId', checkAuth, isAdmin, products.DeleteProduct)
module.exports = router
