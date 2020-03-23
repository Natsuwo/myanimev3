const { Router } = require('express')
const route = Router()
const { getIndex, getAnime, getEpisode, getAnimeRanking, getAnimeCalendar, getAnimeList } = require('../controllers/animes.controller')
const { getOption } = require('../middlewares/animes.middleware')
route.get('/', getOption, getIndex)
route.get('/animes-list', getOption, getAnimeList)
route.get('/anime/:anime_id/:slug', getOption, getAnime)
route.get('/anime/:anime_id/:slug/episode/:number', getOption, getEpisode)
route.get('/ranking/:sort', getOption, getAnimeRanking)
route.get('/calendar/:day', getOption, getAnimeCalendar)

route.get('/privacy-policy', getOption, (req, res) => {
    var { settings, reqUrl, isMobile } = res.locals
    res.render('privacy-policy', {
        settings,
        url: reqUrl,
        pageTitle: "Privacy Policy",
        isMobile
    })
})
module.exports = route