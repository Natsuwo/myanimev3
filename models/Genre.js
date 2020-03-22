const mongoose = require('mongoose'),
    Counter = require('./Counter')

const genreSchema = new mongoose.Schema({
    genre_id: Number,
    title: String,
    description: String,
})

genreSchema.pre('save', async function (next) {
    var genre = this
    genre.create_at = Date.now()
    var counter = await Counter.findOne({ key: "genre" })
    if (counter) {
        var counter = await Counter.findOneAndUpdate({ key: "genre" }, { $inc: { value: 1 } }, { new: true })
        genre.genre_id = counter.value
        return next()
    } else {
        await Counter.create({ key: "genre", value: 1 })
        genre.genre_id = 1
        return next()
    }
})

const Genre = mongoose.model('Genre', genreSchema, 'genre')
module.exports = Genre