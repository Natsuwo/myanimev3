const axios = require('axios')
const Mobile = require('../helpers/is-mobile')
const Anime = require('../models/Anime')
const Option = require('../models/Options')
const Genre = require('../models/Genre')
const Episode = require('../models/Episode')
module.exports = {
    async getIndex(req, res) {
        var isMobile = Mobile(req)
        var option = await Option.findOne({ default: true })
        if (!option) throw Error("Setting not found. Please set option in backend fisrt.")
        var { settings } = option
        var { current_season } = settings
        if (current_season) {
            var currentSeasonItems = await Anime.find({ season: current_season }, { _id: 0 }).select("title slug thumb anime_id")
            var currentSeason = {}
            currentSeason.caption = current_season
            currentSeason.items = currentSeasonItems
        } else {
            currentSeason = null
        }
        var features = []
        var topRank = await Anime
            .find({}, { _id: 0 })
            .limit(30)
            .sort({ views: -1 })
            .select("title slug thumb anime_id")
        var newUpdate = await Anime
            .find({}, { _id: 0 })
            .limit(30)
            .sort({ updated_at: -1 })
            .select("title slug thumb anime_id")
        var recommend = await Anime
            .find({}, { _id: 0 })
            .limit(30)
            .sort({ favorites: -1 })
            .select("title slug thumb anime_id")
        var random = await Anime
            .aggregate([{ $sample: { size: 30 } }])
            .project("title slug thumb anime_id -_id")

        features.push(
            {
                name: "anime-new-update",
                title: "New Update",
                cards: newUpdate
            },
            {
                name: "anime-recommend",
                title: "Recommend",
                cards: recommend
            },
            {
                name: "anime-random",
                title: "Random",
                cards: random
            })
        res.render('index', {
            isMobile,
            currentSeason,
            topRank,
            features,
        })
    },
    async getAnime(req, res) {
        try {
            var isMobile = Mobile(req)
            var { anime_id, slug } = req.params
            var anime = await Anime.findOne({ anime_id, slug }, { _id: 0, __v: 0 })
            if (!anime) throw Error("Not found.")
            var genres = await Genre.find({ genre_id: { $in: anime.genres } }, { _id: 0 }).select("title")
            var episodes = await Episode.find({ anime_id }, { _id: 0 }).select("thumbnail views sources number description")
            var recommend = await Anime
                .aggregate([{ $match: { genres: { $in: anime.genres } } }, { $sample: { size: 8 } }])
                .project("title slug thumb anime_id -_id")
            res.render('anime', {
                anime,
                genres,
                episodes,
                recommend,
                isMobile
            })
        } catch (err) {
            console.log(err.message)

        }
    },
    async getEpisode(req, res) {
        try {
            req.connection.setTimeout(60 * 10 * 1000)
            var isMobile = Mobile(req)
            var { anime_id, slug, number } = req.params
            var episodeList = {}
            var episodes = await Episode
                .find({ anime_id }, { _id: 0 })
                .select("thumbnail views sources number description")
            episodeList.caption = "Episodes List"
            episodeList.items = episodes
            var episode = await Episode.findOne({ anime_id, number }, { _id: 0 })
            var anime = await Anime.findOne({ anime_id, slug }, { _id: 0 }).select("title genres anime_id slug")
            var recommend = await Anime
                .aggregate([{ $match: { genres: { $in: anime.genres } } }, { $sample: { size: 16 } }])
                .project("title slug thumb anime_id -_id")
            res.render('watch', {
                isMobile,
                anime,
                episode,
                episodeList,
                recommend,
            })
        } catch (err) {
            console.log(err.message)
        }
    },
    async getAnimeRanking(req, res) {
        var isMobile = Mobile(req)
        var { slug } = req.params
        res.render('ranking', {
            isMobile
        })
    },
    async getAnimeCalendar(req, res) {
        var isMobile = Mobile(req)
        var { slug } = req.params
        res.render('calendar', {
            isMobile
        })
    },
}