const { Router } = require('express')
const route = Router()
const { addMyAlert, addMyList, getMylist, getMyAlert, loadMyList } = require('../controllers/user.controller')
const { auth } = require('../middlewares/auth.middleware')
const { getOption } = require('../middlewares/animes.middleware')

route.get('/auth/lists', auth, getOption, getMylist)
route.get('/auth/alerts', auth, getOption, getMyAlert)

route.get('/api/user/loadlist', auth, loadMyList)
route.put('/user/alert', auth, addMyAlert)
route.put('/user/mylist', auth, addMyList)
module.exports = route