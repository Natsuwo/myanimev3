const mongoose = require('mongoose'),
    Counter = require('./Counter'),
    bcrypt = require('bcryptjs'),
    SALT_FACTOR = 12


const userSchema = new mongoose.Schema({
    user_id: Number,
    email: {
        type: String,
        required: true,
        index: { unique: true }
    },
    username: {
        type: String,
        required: true,
        index: { unique: true }
    },
    password: {
        type: String,
        required: true
    },
    avatar: String,
    rank: Number,
    created_at: Number
})

userSchema.pre('save', function (next) {
    var user = this

    user.created_at = Date.now()

    if (!user.isModified('password')) return next()

    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) return next(err)
        bcrypt.hash(user.password, salt, async function (err, hash) {
            if (err) return next(err)
            user.password = hash
            var counter = await Counter.findOneAndUpdate({ key: "user" }, { $inc: { value: 1 } }, { new: true })
            user.user_id = counter.value
            next()
        })
    })
})

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password)
}

userSchema.index({ username: 'text', email: 'text' })

const User = mongoose.model('User', userSchema, 'user')
module.exports = User