const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const products = require('./route/Product')
// mongodb+srv://Ayoeze191:<password>@cluster0.ipkimb3.mongodb.net/
mongoose.connect(
    'mongodb+srv://Ayoeze191:75739768jc@cluster0.ipkimb3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
)
mongoose.Promise = global.Promise

app.use(morgan('dev'))
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
