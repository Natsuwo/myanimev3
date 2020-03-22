const mongoose = require('mongoose'),
    Counter = require('./Counter'),
    bcrypt = require('bcryptjs'),
    SALT_FACTOR = 12


const userAdminSchema = new mongoose.Schema({
    user_id: {
        type: Number,
        index: { unique: true }
    },
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
    pin: {
        type: Number,
        required: true
    },
    role: {
        type: Number,
        default: 0,
        required: true
    },
    avatar: String,
    created_at: Number
})

userAdminSchema.pre('save', function (next) {
    var user = this

    user.created_at = Date.now()

    if (!user.isModified('password')) return next()

    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) return next(err)
        bcrypt.hash(user.password, salt, async function (err, hash) {
            if (err) return next(err)
            user.password = hash
            var counter = await Counter.findOneAndUpdate({ key: "useradmin" }, { $inc: { value: 1 } }, { new: true })
            user.user_id = counter.value
            next()
        })
    })
})

userAdminSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password)
}

const UserAdmin = mongoose.model('UserAdmin', userAdminSchema, 'useradmin')
module.exports = UserAdmin