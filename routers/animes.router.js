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

route.get('/', getOption, cache('5 minutes'), getIndex)
route.get('/animes-list', getOption, cache('5 minutes'), getAnimeList)
route.get('/anime/:anime_id/:slug', countViewMidd, getOption, cache('5 minutes'), getAnime)
route.get('/anime/:anime_id/:slug/episode/:number', countViewMidd, getOption, cache('5 minutes'), getEpisode)
route.get('/ranking/:sort', getOption, cache('5 minutes'), getAnimeRanking)
route.get('/calendar/:day', getOption, cache('5 minutes'), getAnimeCalendar)
route.get('/search',  getOption, cache('5 minutes'), searchAnime)
route.get('/privacy-policy', getOption, cache('5 minutes'), (req, res) => {
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