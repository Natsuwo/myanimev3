const { Router } = require('express')
const route = Router()
const { getIndex, getAnime, getEpisode, getAnimeRanking,
    getAnimeCalendar, getAnimeList, suggestSearch, searchAnime } = require('../controllers/animes.controller')
const { getOption } = require('../middlewares/animes.middleware')
const apicache = require('apicache')
let cache = apicache.middleware

const countViewMidd = async (req, res, next) => {
    var { anime_id, slug, number } = req.params
    var Anime = require('../models/Anime')
    var Episode = require('../models/Episode')
    if (number) {
        var episode = await Episode.findOne({ anime_id, number }, { __v: 0, _id: 0 })
        if (episode) {
            var { anime_id } = episode
            await Episode.updateOne({ anime_id, number }, { $inc: { views: 1 } }, { new: true })
            await Anime.updateOne({ anime_id }, { $inc: { views: 1 } }, { new: true })
            return next()
        }
    }
    await Anime.updateOne({ $or: [{ anime_id }, { slug }] }, { $inc: { views: 1 } }, { new: true })
    return next()
}

route.get('/', cache('5 minutes'), getOption, getIndex)
route.get('/animes-list', cache('5 minutes'), getOption, getAnimeList)
route.get('/anime/:anime_id/:slug', countViewMidd, cache('5 minutes'), getOption, getAnime)
route.get('/anime/:anime_id/:slug/episode/:number', countViewMidd, cache('5 minutes'), getOption, getEpisode)
route.get('/ranking/:sort', cache('5 minutes'), getOption, getAnimeRanking)
route.get('/calendar/:day', cache('5 minutes'), getOption, getAnimeCalendar)
route.get('/search', cache('5 minutes'), getOption, searchAnime)
route.get('/privacy-policy', cache('5 minutes'), getOption, (req, res) => {
    var { settings, reqUrl, isMobile } = res.locals
    res.render('privacy-policy', {
        settings,
        url: reqUrl,
        pageTitle: "Privacy Policy",
        isMobile
    })
})

route.get('/search/queries', cache('5 minutes'), suggestSearch)

module.exports = route