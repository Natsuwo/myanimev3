
const crypto = require('crypto')
const algorithm = 'aes-256-cbc'
const key = process.env.CRYPTOKEY

module.exports = {
    encodeQueryData(data) {
        const ret = [];
        for (let d in data)
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
        return ret.join('&');
    },
    dayToNum(str) {
        str = str.toLowerCase()
        var day;
        switch (str) {
            case "sunday" || "sun":
                day = 0;
                break;
            case "monday" || "mon":
                day = 1;
                break;
            case "tuesday" || "tue":
                day = 2;
                break;
            case "wednesday" || "wed":
                day = 3;
                break;
            case "thursday" || "thu":
                day = 4;
                break;
            case "friday" || "fri":
                day = 5;
                break;
            case "saturday" || "sat":
                day = 6;
                break;
            default:
                day = null
                break;
        }
        return day
    },
    alphabet(items) {
        var listsAb = [
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "I",
            "J",
            "K",
            "L",
            "M",
            "N",
            "O",
            "P",
            "Q",
            "R",
            "S",
            "T",
            "U",
            "V",
            "W",
            "X",
            "Y",
            "Z"
        ];
        var resultAb = {
            others: [],
            a: [],
            b: [],
            c: [],
            d: [],
            e: [],
            f: [],
            g: [],
            h: [],
            i: [],
            j: [],
            k: [],
            l: [],
            m: [],
            n: [],
            o: [],
            p: [],
            q: [],
            r: [],
            s: [],
            t: [],
            u: [],
            v: [],
            w: [],
            x: [],
            y: [],
            z: []
        };

        for (var item of items) {
            var count = 0;
            for (var character of listsAb) {
                if (item.title[0].toLowerCase().indexOf(character.toLowerCase()) > -1) {
                    resultAb[character.toLowerCase()].push(item);
                    count++;
                    continue;
                }
            }
            if (count === 0) {
                resultAb["others"].push(item);
            }
        }
        return {
            listsAb,
            resultAb
        };
    },
    escapeRegex(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
    },
    encrypt(text) {
        var cipher = crypto.createCipher(algorithm, Buffer.from(key))
        var encrypted = cipher.update(text, 'utf8', 'hex')
        encrypted += cipher.final('hex')
        // let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv)
        // let encrypted = cipher.update(text)
        // encrypted = Buffer.concat([encrypted, cipher.final()])
        // return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') }
        return encrypted
    },
    decrypt(text) {
        var decipher = crypto.createDecipher(algorithm, Buffer.from(key));
        var decrypted = decipher.update(text, 'hex', 'utf8')
        decrypted += decipher.final('utf8');
        // let iv = Buffer.from(text.iv, 'hex')
        // let encryptedText = Buffer.from(text.encryptedData, 'hex')
        // let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv)
        // let decrypted = decipher.update(encryptedText)
        // decrypted = Buffer.concat([decrypted, decipher.final()])
        // return decrypted.toString()
        return decrypted
    },
    getProxy(drive_id) {
        var proxyDomain = "https://s1.myanime.co"
        var endpoint = proxyDomain + "/video/" + module.exports.encrypt(drive_id)
        return endpoint
    }
}