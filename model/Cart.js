const { default: mongoose } = require('mongoose')

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        // min: 1, // Enforce minimum quantity of 1
    },
})

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference the User model
        required: true,
    },
    items: [cartItemSchema], // Array of cart items
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('Cart', cartSchema)
