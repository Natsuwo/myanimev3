const mongoose = require('mongoose')

const notiSchema = new mongoose.Schema({
    user_id: Number,
    anime_id: Number,
    lang: String,
    episode_id: String,
    cover: String,
    message: String,
    read: Boolean,
    created_at: Number

})

notiSchema.pre('save', async function (next) {
    var noti = this
    noti.created_at = Date.now()
    noti.read = false
    next()
})

const Noti = mongoose.model('Noti', notiSchema, 'noti')

module.exports = Noti