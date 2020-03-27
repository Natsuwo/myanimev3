const Option = require('../models/Options')
const Mobile = require('../helpers/is-mobile')
module.exports = {
    async getOption(req, res, next) {
        try {
            res.removeHeader('X-Powered-By');
            var option = await Option.findOne({ default: true })
            if (!option) throw Error("Setting not found. Please set option in backend fisrt.")
            var { settings } = option
            var reqUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
            var isMobile = Mobile(req)
            res.locals.settings = settings
            res.locals.reqUrl = reqUrl
            res.locals.isMobile = isMobile
            next()
        } catch (err) {
            console.log(err.message)
        }
    }
}