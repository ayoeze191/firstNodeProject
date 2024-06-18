const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1, // Enforce minimum quantity of 1
    },
    price: {
        // Store price at time of order
        type: Number,
        required: true,
    },
})

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference the User model
        required: true,
    },
    items: [orderItemSchema], // Array of ordered items
    shippingAddress: {
        street: { type: String },
        city: String,
        state: String,
        postalCode: { type: String, required: true },
        country: String,
    },
    // billingAddress: {
    //     street: String,
    //     city: String,
    //     state: String,
    //     postalCode: String,
    //     country: String,
    // },
    totalPrice: {
        // Total price of the order
        type: Number,
        required: true,
    },
    status: {
        // Track order status (e.g., 'pending', 'processing', 'shipped', 'delivered')
        type: String,
        required: true,
        default: 'pending',
    },
    placedAt: {
        type: Date,
        default: Date.now,
    },
    // payment: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Payment',
    //     required: false,
    // },
})
module.exports = mongoose.model('Order', orderSchema)
