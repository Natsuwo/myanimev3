const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { checkValidPass } = require('../helpers')
function getTokenFromHeader(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
        req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}

module.exports = {
    async auth(req, res, next) {
        try {
            if (!req.signedCookies._auth) {
                return next();
            }
            var token = req.signedCookies._auth
            var validate = jwt.verify(token, process.env.JWTSECRET)
            var user_id = validate.ID
            var email = validate.EMAIL
            var user = await User.findOne({ user_id, email }, { __v: 0, _id: 0, password: 0 })
            if (!user) {
                return next()
            }
            res.locals.user = user;
            next();
        } catch (err) {
            console.error(err.message, 'at check auth')
            return next()
        }
    },
    async validateSignIn(req, res, next) {
        try {
            var { email, password } = req.body
            if (!email || !password) {
                throw Error('Do not empty fields.')
            }
            var user = await User.findOne({ email }, { _id: 0, __v: 0 })
            if (!user) throw Error('Something wrong, please check again.')
            var isPasswordValid = await user.comparePassword(password)
            if (!isPasswordValid) throw Error('Wrong password.')
            user.password = undefined
            res.locals.user = user
            next()
        } catch (err) {
            req.flash('errors', err.message)
            res.redirect('/auth/sign-in')
        }
    },
    // validate Sign up
    async validateSignup(req, res, next) {
        try {
            var { email, password, username, confirm_password } = req.body
            if (!email || !username || !password || !confirm_password) {
                throw Error('Do not empty fields.')
            }
            var checkUser = await User.findOne({ email })
            // Check user has exist
            if (checkUser) throw Error("Your email already exists.")
            // Check password match
            await checkValidPass(password, confirm_password)
            next()

        } catch (err) {
            req.flash('errors', err.message)
            req.flash('form', { email, username })
            res.redirect('/auth/sign-up')
        }
    }
}