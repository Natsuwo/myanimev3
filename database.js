const mongoose = require('mongoose')
var mongooseRedisCache = require("mongoose-redis-cache");
mongooseRedisCache(mongoose, {
    cache: true
});

mongoose.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
})

mongoose.connection.on('connected', function () {
    console.log('Mongoose successfully connected.')
})

mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err)
})

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose was disconnected')
})

mongoose.set('useFindAndModify', false);

module.exports = mongoose