const { Router } = require('express')
const route = Router()
const { getSignIn, getSignUp, getForgotPass, getResetPass,
    signUp, signIn, logout, forgotPass, resetPassword } = require('../controllers/auth.controller')
const { validateSignup, validateSignIn, auth } = require('../middlewares/auth.middleware')
const { getOption } = require('../middlewares/animes.middleware')

route.get('/auth/sign-in', getOption, auth, getSignIn)
route.get('/auth/sign-up', getOption, auth, getSignUp)
route.get('/auth/forgot', getOption, auth, getForgotPass)
route.get('/auth/reset/:token', getOption, auth, getResetPass)
route.get('/auth/logout', logout)

route.post('/auth/sign-up', validateSignup, signUp)
route.post('/auth/sign-in', validateSignIn, signIn)
route.post('/auth/forgot', forgotPass)
route.post('/auth/reset/:token', resetPassword)
module.exports = route