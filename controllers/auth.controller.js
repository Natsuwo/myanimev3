const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { sendMail, checkValidPass } = require('../helpers')
function jwtSignUser(user) {
    return jwt.sign(user, process.env.JWTSECRET, {
        expiresIn: "60d"
    })
}

module.exports = {
    async getSignIn(req, res) {
        try {
            var { user } = res.locals
            if (user)
                return res.redirect("/")
            res.render('pages/auth/sign-in', {
                message: req.flash()
            })
        } catch (err) {
        }
    },
    async getSignUp(req, res) {
        try {
            var { user } = res.locals
            if (user)
                return res.redirect("/")
            res.render('pages/auth/sign-up', {
                message: req.flash()
            })
        } catch (err) {
        }
    },
    async getForgotPass(req, res) {
        try {
            var { user } = res.locals
            if (user)
                return res.redirect("/")
            res.render('pages/auth/forgot', {
                message: req.flash()
            })
        } catch (err) {
        }
    },
    async getResetPass(req, res) {
        try {
            var { user } = res.locals
            if (user)
                return res.redirect("/")
            var { token } = req.params
            var verify = jwt.verify(token, process.env.JWTSECRET)
            var { expired } = verify
            if (Date.now() >= expired) throw Error('Session is expired.')
            res.render('pages/auth/reset', {
                message: req.flash()
            })
        } catch (err) {
            if (err.message === "jwt malformed")
                err.message = "Something wrong, please check again."
            req.flash('errors', err.message)
            res.redirect('/auth/sign-in')
        }
    },
    async signIn(req, res) {
        try {
            var { user } = res.locals
            var userToken = {
                ID: user.user_id,
                EMAIL: user.email
            }

            token = jwtSignUser(userToken)
            var cookieConfig = {
                httpOnly: true,
                maxAge: 60 * 24 * 60 * 60 * 1000,
                signed: true
            };
            res.cookie('_auth', token, cookieConfig);
            res.redirect('/')
        } catch (err) {
            req.flash('errors', err.message)
            res.redirect('/auth/sign-in')
        }
    },
    async signUp(req, res) {
        try {
            var { email, password, username } = req.body
            await User.create({ email, password, username })
            req.flash('success', 'Your account has been successfully created.')
            res.redirect('/auth/sign-in')
        } catch (err) {
            req.flash('errors', err.message)
            req.flash('form', { email, username })
            res.redirect('/auth/sign-up')
        }
    },
    async forgotPass(req, res) {
        try {
            var { email } = req.body
            if (!email) throw Error("The email is empty.")
            var user = await User.findOne({ email })
            if (!user) throw Error("Email does not exist.")
            var date = new Date()
            var expired = date.setMinutes(date.getMinutes() + 30)
            var userData = {
                user_id: user.user_id,
                email,
                expired
            }
            var token = jwtSignUser(userData)
            var subject = 'Myanime.co forgot password ' + email
            var text = subject
            var html = `<div>Hi: ${user.username}</div>
            <div>You've requested to reset password user ${user.username} at myanime.co - bakadora.com. Click the link below to reset password:</div>
            <div>${'https://' + req.get('host')}/auth/reset/${token}</div>
            <div>If you did not request a reset password, you may ignore this email.</div>`
            sendMail(email, subject, text, html)
            req.flash('success', `A mail has sent to your email. 
            If you don't see any mail, please check your spam mail.`)
            res.redirect('/auth/sign-in')
        } catch (err) {
            req.flash('errors', err.message)
            res.redirect('/auth/forgot')
        }
    },
    async resetPassword(req, res) {
        try {
            var { token } = req.params
            var { password, confirm_password } = req.body
            var verify = jwt.verify(token, process.env.JWTSECRET)
            var { user_id, email, expired } = verify
            if (Date.now() >= expired) throw Error('Session is expired.')
            if (!email || !password || !confirm_password) {
                throw Error('Something wrong, please check again or contact the administrator.')
            }
            // Check password match
            await checkValidPass(password, confirm_password)
            await User.updateOne({ user_id, email }, { password })
            req.flash('success', 'Success. Your password has changed.')
            res.redirect('/auth/sign-in')
        } catch (err) {
            if (err.message === "jwt malformed")
                err.message = "Something wrong, please check again."
            req.flash('errors', err.message)
            res.redirect('/auth/reset/' + token)
        }
    },
    logout(req, res) {
        res.clearCookie('_auth');
        res.redirect('/');
    }
}