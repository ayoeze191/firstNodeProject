const moongose = require('mongoose')

const CategorySchema = moongose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
})

module.exports = moongose.model('Category', CategorySchema)
