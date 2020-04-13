
const crypto = require('crypto')
const algorithm = 'aes-256-cbc'
const key = process.env.CRYPTOKEY
const axios = require('axios')
const nodemailer = require('nodemailer')
module.exports = {
    async checkValidPass(password, confirm_password) {
        var lowercase = /[a-z]/.test(password)
        var number = /\d/.test(password)
        var uppercase = /[A-Z]/.test(password)
        if (password.length <= 8) {
            throw Error("Password must be greater than 8 characters.")
        }
        if (!lowercase) {
            throw Error("Password must be have a lowercase.")
        }
        if (!number) {
            throw Error("Password must be have a number")
        }
        if (!uppercase) {
            throw Error("Password must be have a uppercase.")
        }
        if (confirm_password !== password) {
            throw Error("Password not match.")
        }
    },
    async sendMail(email, subject, text, html) {
        try {
            var transporter = nodemailer.createTransport({
                host: "smtp.yandex.com",
                port: 465,
                auth: {
                    user: process.env.YANDEX_MAIL,
                    pass: process.env.YANDEX_PASS
                }
            })
            var mainOptions = {
                from: process.env.YANDEX_MAIL,
                to: email,
                subject,
                text,
                html
            }
            await transporter.sendMail(mainOptions)
        } catch (err) {
            console.error(err.message, ' at sendMail')
        }
    },
    encodeQueryData(data) {
        const ret = [];
        for (let d in data)
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
        return ret.join('&');
    },
    getSkipEp(totalDoc, number) {
        var skip = 0
        if (totalDoc <= 12) {
            skip = 0
        }
        else if (number < 12 && totalDoc > 12) {
            skip = totalDoc - 12
        }

        else if (number < 12 && totalDoc < 12) {
            skip = 12
        } else {
            skip = totalDoc - number - 1
            if (skip < 0)
                skip = 0
        }
        return skip
    },
    async getSourceHls(drive_id) {
        try {
            var drDomain = process.env.DRDOMAIN
            var endpoint = drDomain + '/api/v2/hls-drive/get-data'
            var token = process.env.DRTOKEN
            var user_id = process.env.DRUSER
            var query = `?user_id=${user_id}&drive_id=${drive_id}&secret_token=${token}`
            var checkProgress = await axios.get(drDomain + '/api/v2/hls-drive/progress' + query)
            if (checkProgress.data.success) {
                var progress = checkProgress.data.progress
                if (progress.rendered && progress.deleted) {
                    var resp = await axios.get(endpoint + query)
                    var data = resp.data
                    if (!data.success) return null
                    var id = data.results.id
                    var link = "//drstream.live" + '/hls/' + id + '.m3u8'
                    return link
                }
                return null
            }
            return null
        } catch (err) {
            return null
        }
    },
    getDomain(url) {
        if (!url) return;
        var hostname;
        //find & remove protocol (http, ftp, etc.) and get hostname
        if (url.indexOf("//") > -1) {
            hostname = url.split('/')[2];
        }
        else {
            hostname = url.split('/')[0];
        }
        //find & remove port number
        hostname = hostname.split(':')[0];
        //find & remove "?"
        hostname = hostname.split('?')[0];
        return hostname;
    },
    proxyimg(img) {
        var host = module.exports.getDomain(img)
        if (host === "image.myanime.co") {
            return img
        } else {
            var img = "//image.myanime.co/?url=" + encodeURIComponent(img)
            return img;
        }
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
    escapeRegexRec(text) {
        text = text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
        if (text.split("\\").length > 2) {
            text = text.split("\\").splice(0, 2).join("\\")
            return text
        }
        return text
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