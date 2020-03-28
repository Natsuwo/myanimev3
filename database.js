const mongoose = require('mongoose')
var MongooseCache = require('./cache')
var MongooseArrCache = require('./cacheAggregate');
MongooseCache(mongoose);
MongooseArrCache(mongoose);

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