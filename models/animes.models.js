const mongoose = require('mongoose')

const animesSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    title: String,
    content: String,
    thumb: String,
    thumbPortrait: String,
    genre: {
        type: Array,
        default: []
    },
    seasons: {
        type: Array,
        default: []
    },
    caption: String,
    sharedLink: {
        type: Object,
        default: {}
    },
    createdAt: Number,
    updatedAt: Number
})

animesSchema.pre('save', async function (next) {
    var animes = this
    animes.createdAt = Date.now()
    animes.updatedAt = Date.now()
    next()
})

const Animes = mongoose.model('Animes', animesSchema, 'animes')

module.exports = Animes