const { Router } = require('express')
const route = Router()
const { getIndex, getAnime, getEpisode, getAnimeRanking, getAnimeCalendar } = require('../controllers/animes.controller')

route.get('/', getIndex)
route.get('/anime/:anime_id/:slug', getAnime)
route.get('/anime/:anime_id/:slug/episode/:number', getEpisode)
route.get('/ranking', getAnimeRanking)
route.get('/calendar/:date', getAnimeCalendar)
module.exports = route