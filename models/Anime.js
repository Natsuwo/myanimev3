const mongoose = require('mongoose'),
    Counter = require('./Counter')

const animeSchema = new mongoose.Schema({
    anime_id: Number,
    title: String,
    slug: String,
    en_title: String,
    jp_title: String,
    description: String,
    type: String,
    premiered: String,
    season: String,
    studios: String,
    thumb: String,
    thumbPortrait: String,
    genres: Array,
    views: {
        type: Number,
        default: 0
    },
    favorites: {
        type: Number,
        default: 0
    },
    new: {
        type: Boolean,
        default: false
    },
    created_at: Number,
    updated_at: Number

})

animeSchema.pre('save', async function (next) {
    var anime = this
    anime.created_at = Date.now()
    anime.updated_at = Date.now()
    var counter = await Counter.findOne({ key: "anime" })
    if (counter) {
        var counter = await Counter.findOneAndUpdate({ key: "anime" }, { $inc: { value: 1 } }, { new: true })
        anime.anime_id = counter.value
        return next()
    } else {
        await Counter.create({ key: "anime", value: 1 })
        anime.anime_id = 1
        return next()
    }
})

animeSchema.pre('updateOne', function (next) {
    var update = this.getUpdate()
    update.$set = update.$set || {};
    update.$set.updated_at = Date.now();
    next()
})

const Anime = mongoose.model('Anime', animeSchema, 'anime')

module.exports = Anime