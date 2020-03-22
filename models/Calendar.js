const mongoose = require('mongoose'),
    Counter = require('./Counter')

const calendarSchema = new mongoose.Schema({
    id: Number,
    anime: Number,
    day: Number,
    date: String,
    start_time: String,
    end_time: String

})

calendarSchema.pre('save', async function (next) {
    var calendar = this
    var counter = await Counter.findOne({ key: "calendar" })
    if (counter) {
        var counter = await Counter.findOneAndUpdate({ key: "calendar" }, { $inc: { value: 1 } }, { new: true })
        calendar.id = counter.value
        return next()
    } else {
        await Counter.create({ key: "calendar", value: 1 })
        calendar.id = 1
        return next()
    }
})

const Calendar = mongoose.model('Calendar', calendarSchema, 'calendar')

module.exports = Calendar