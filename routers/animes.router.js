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

route.get('/', cache, getOption, getIndex)
route.get('/animes-list', cache, getOption, getAnimeList)
route.get('/anime/:anime_id/:slug', countViewMidd, cache, getOption, getAnime)
route.get('/anime/:anime_id/:slug/episode/:number', countViewMidd, cache, getOption, getEpisode)
route.get('/ranking/:sort', cache, getOption, getAnimeRanking)
route.get('/calendar/:day', cache, getOption, getAnimeCalendar)
route.get('/search', cache, getOption, searchAnime)
route.get('/privacy-policy', cache, getOption, (req, res) => {
    var { settings, reqUrl, isMobile } = res.locals
    res.render('privacy-policy', {
        settings,
        url: reqUrl,
        pageTitle: "Privacy Policy",
        isMobile
    })
})

route.get('/search/queries', cache, suggestSearch)

module.exports = route