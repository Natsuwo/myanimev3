const { Router } = require('express')
const router = Router()

const index = require('./routers/animes.router')

router.use(index)

module.exports = router