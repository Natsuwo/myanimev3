const mongoose = require('mongoose'),
    Counter = require('./Counter')

const episodeSchema = new mongoose.Schema({
    anime_id: Number,
    episode_id: Number,
    caption: String,
    description: String,
    number: Number,
    thumbnail: String,
    thumbs: {
        type: Array,
        default: []
    },
    sources: {
        type: Array,
        default: [
            {
                source: String,
                type: String,
                audio: String,
                subtitle: String
            }
        ]
    },
    views: {
        type: Number,
        default: 0
    },
    created_at: Number,
    updated_at: Number

})

episodeSchema.pre('save', async function (next) {
    var episode = this
    episode.created_at = Date.now()
    episode.updated_at = Date.now()
    var counter = await Counter.findOne({ key: "episode" })
    if (counter) {
        var counter = await Counter.findOneAndUpdate({ key: "episode" }, { $inc: { value: 1 } }, { new: true })
        episode.episode_id = counter.value
        return next()
    } else {
        await Counter.create({ key: "episode", value: 1 })
        episode.episode_id = 1
        return next()
    }
})

const Episode = mongoose.model('Episode', episodeSchema, 'episode')

module.exports = Episode