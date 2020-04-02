const { Router } = require('express')
const route = Router()
const { getIndex, getAnime, getEpisode, getAnimeRanking,
    getAnimeCalendar, getAnimeList, suggestSearch, searchAnime, getAnimeId, getSeason } = require('../controllers/animes.controller')
const { getOption } = require('../middlewares/animes.middleware')
const { auth } = require('../middlewares/auth.middleware')
const apicache = require('apicache')
apicache.options({
    appendKey: (req, res) => res.locals.isMobile
})

let cache = apicache.middleware

const countViewMidd = async (req, res, next) => {
    var { anime_id, slug, number } = req.params
    var Anime = require('../models/Anime')
    var Episode = require('../models/Episode')
    if (!parseInt(anime_id)) return next()
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

route.get('/', getOption, auth, getIndex)
route.get('/animes-list', getOption, auth, getAnimeList)
route.get('/anime/:anime_id/:slug', countViewMidd, auth, getOption, getAnime)
route.get('/anime/:anime_id', countViewMidd, getOption, auth, getAnimeId)
route.get('/anime/:anime_id/:slug/episode/:number', countViewMidd, getOption, cache('2 minutes'), auth, getEpisode)
route.get('/ranking/:sort', getOption, auth, getAnimeRanking)
route.get('/season/:slug/:sort', getOption, auth, getSeason)
route.get('/calendar/:day', getOption, getAnimeCalendar)
route.get('/search', getOption, auth, searchAnime)
route.get('/privacy-policy', getOption, auth, (req, res) => {
    var { settings, reqUrl, isMobile } = res.locals
    res.render('privacy-policy', {
        settings,
        url: reqUrl,
        pageTitle: "Privacy Policy",
        isMobile
    })
})

route.get('/search/queries', suggestSearch)

module.exports = route