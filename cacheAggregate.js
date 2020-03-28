'use strict';

const Hash = require("mix-hash"),
    redis = require("redis"),
    util = require("util");
let hasBeenExtended = false;

module.exports = function (mongoose, option) {
    const aggregate = mongoose.Model.aggregate;
    var client = redis.createClient(option || "redis://127.0.0.1:6379");
    client.get = util.promisify(client.get);

    mongoose.Model.aggregate = function () {
        const res = aggregate.apply(this, arguments);

        if (!hasBeenExtended && res.constructor && res.constructor.name === 'Aggregate') {
            extend(res.constructor);
            hasBeenExtended = true;
        }

        return res;
    };

    function extend(Aggregate) {
        const exec = Aggregate.prototype.exec;

        Aggregate.prototype.exec = async function () {
            if (!this._ttl) return exec.apply(this, arguments);

            const key = this._key || Hash.md5(JSON.stringify(Object.assign({}, { name: this.model.collection.name, conditions: this._conditions, fields: this._fields, o: this.options })));
    
            const cached = await client.get(key);
            if (cached) {
                // console.log(`[LOG] Serving from cache`);
                const doc = JSON.parse(cached);
                // console.log(Array.isArray(doc) ? doc.map(d => new this.model(d)) : new this.model(doc))
                return doc
            }
    
            const result = await exec.apply(this, arguments);
            if (result) {
                client.set(key, JSON.stringify(result), "EX", this._ttl);
            }
            return result;
        };

        Aggregate.prototype.cache = function (ttl, customKey) {
            if (typeof ttl === 'string') {
                customKey = ttl;
                ttl = 60;
            }
            this._ttl = ttl;
            this._key = customKey;
            return this;
        }
    }
};