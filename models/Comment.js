const mongoose = require('mongoose'),
    Counter = require('./Counter')

const commentSchema = new mongoose.Schema({
    comment_id: Number,
    user_id: Number,
    episode_id: String,
    parent_id: Number,
    comment: String,
    hearts: {
        type: Number,
        default: 0
    },
    created_at: Number
})

commentSchema.pre('save', async function (next) {
    var comment = this
    comment.created_at = Date.now()
    var counter = await Counter.findOneAndUpdate({ key: "comment" }, { $inc: { value: 1 } }, { new: true })
    comment.comment_id = counter.value
    next()
})


const Comment = mongoose.model('Comment', commentSchema, 'comment')
module.exports = Comment