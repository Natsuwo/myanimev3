const mongoose = require('mongoose');
const redis = require("redis");
const util = require("util");

const client = redis.createClient();
client.hset = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = { time: 60 }) {
    this.useCache = true;
    this.time = options.time;
    this.hashKey = JSON.stringify(options.key || this.mongooseCollection.name);
    return this;
};

mongoose.Query.prototype.exec = async function () {
    if (!this.useCache) {
        return await exec.apply(this, arguments);
    }

    const key = JSON.stringify({
        ...this.getQuery()
    });
    console.log(key)
    const cacheValue = client.hget(this.hashKey, key);
    if (cacheValue) {
        const doc = JSON.parse(cacheValue);
        console.log("Response from Redis");
        return Array.isArray(doc)
            ? doc.map(d => new this.model(d))
            : new this.model(doc);
    }

    const result = await exec.apply(this, arguments);
    client.hmset(this.hashKey, JSON.stringify(result));
    client.expire(this.hashKey, this.time);

    console.log("Response from MongoDB");
    return result;
};

module.exports = {
    clearKey(hashKey) {
        client.del(JSON.stringify(hashKey));
    }
};