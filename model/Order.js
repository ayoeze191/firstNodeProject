const mongoose = require('mongoose')
const Product = require('./Product')

const OrderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Products: {
        type: {
            
        }
    } 
})