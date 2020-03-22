const mongoose = require('mongoose'),
    Counter = require('./Counter')

const optionSchema = new mongoose.Schema({
    id: Number,
    name: String,
    default: {
        type: Boolean,
        default: false
    },
    settings: Object
})

optionSchema.pre('save', async function (next) {
    var option = this
    var counter = await Counter.findOne({ key: "option" })
    if (counter) {
        var counter = await Counter.findOneAndUpdate({ key: "option" }, { $inc: { value: 1 } }, { new: true })
        option.id = counter.value
        return next()
    } else {
        await Counter.create({ key: "option", value: 1 })
        option.id = 1
        return next()
    }
})

const Option = mongoose.model('Option', optionSchema, 'option')
module.exports = Option