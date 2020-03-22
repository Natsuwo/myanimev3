const mongoose = require('mongoose'),
    Counter = require('./Counter')
    
const langSchema = new mongoose.Schema({
    lang_id: Number,
    lang: String,
    lang_code: String,
    flag: String,
})

langSchema.pre('save', async function (next) {
    var lang = this
    var counter = await Counter.findOne({ key: "lang" })
    if (counter) {
        var counter = await Counter.findOneAndUpdate({ key: "lang" }, { $inc: { value: 1 } }, { new: true })
        lang.lang_id = counter.value
        return next()
    } else {
        await Counter.create({ key: "lang", value: 1 })
        lang.lang_id = 1
        return next()
    }
})

const Lang = mongoose.model('Lang', langSchema, 'lang')
module.exports = Lang