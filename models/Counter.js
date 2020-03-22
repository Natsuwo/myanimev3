const mongoose = require('mongoose')
const counterSchema = new mongoose.Schema({
    key: String,
    value: Number
})

const Counter = mongoose.model('Counter', counterSchema, 'counter')
module.exports = Counter