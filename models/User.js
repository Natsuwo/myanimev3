const mongoose = require('mongoose'),
    Counter = require('./Counter'),
    bcrypt = require('bcryptjs'),
    SALT_FACTOR = 12


const userSchema = new mongoose.Schema({
    user_id: Number,
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    myList: {
        type: Array,
        default: []
    },
    myAlert: {
        type: Array,
        default: []
    },
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
            var counter = await Counter.countDocuments({ key: "user" })
            if (counter) {
                var counter = await Counter.findOneAndUpdate({ key: "user" }, { $inc: { value: 1 } }, { new: true })
                user.user_id = counter.value
                return next()
            } else {
                await Counter.create({ key: "user", value: 1 })
                user.user_id = 1
                return next()
            }
        })
    })
})

userSchema.pre('updateOne', function (next) {
    var update = this.getUpdate()
    if (!update.password) return next()
    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) return next(err)
        bcrypt.hash(update.password, salt, async function (err, hash) {
            if (err) return next(err)
            update.password = hash
            return next()
        })
    })
})

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password)
}

userSchema.index({ username: 'text', email: 'text' })

const User = mongoose.model('User', userSchema, 'user')
module.exports = User