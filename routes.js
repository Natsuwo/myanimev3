const { Router } = require('express')
const router = Router()

const index = require('./routers/animes.router')
const auth = require('./routers/auth.router')
const user = require('./routers/user.router')

router.use(index)
router.use(auth)
router.use(user)

module.exports = router