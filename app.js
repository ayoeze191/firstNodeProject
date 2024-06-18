const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const products = require('./route/Product')
const orders = require('./route/Orders')
const users = require('./route/User')
const carts = require('./route/Cart')
// const swaggerjsdoc = require('sa')
const swaggerui = require('swagger-ui-express')
const yaml = require('yamljs')
const swaggedocument = yaml.load('./swagger.yml')
// const upload = multer({ dest: '/uploads/' })

// mongodb+srv://Ayoeze191:<password>@cluster0.ipkimb3.mongodb.net/
mongoose.connect(
    'mongodb+srv://Ayoeze191:75739768jc@cluster0.ipkimb3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
)
mongoose.Promise = global.Promise

app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type ,Accept, Authorization'
    )
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT',
            'POST',
            'PATCH',
            'DELETE',
            'GET'
        )
        return res.status(200).json({})
    }
    next()
})

app.use('/products', products)
app.use('/orders', orders)
app.use('/auth', users)
app.use('/cart', carts)
app.use('/api/-docs', swaggerui.serve, swaggerui.setup(swaggedocument))
app.use((res, req, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({
        error: {
            message: err.message,
        },
    })
})

module.exports = app
