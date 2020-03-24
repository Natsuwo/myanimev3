const axios = require('axios')
const Anime = require('../models/Anime')
const Option = require('../models/Options')
const Genre = require('../models/Genre')
const Episode = require('../models/Episode')
const Calendar = require('../models/Calendar')
const { dayToNum, alphabet, escapeRegex } = require('../helpers')
module.exports = {
    async getIndex(req, res) {
        var { settings, reqUrl, isMobile } = res.locals
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
            settings,
            url: reqUrl,
            pageTitle: "Home Page",
            isMobile,
            currentSeason,
            topRank,
            features,
        })
    },
    async getAnime(req, res) {
        try {
            var { settings, reqUrl, isMobile } = res.locals
            var { anime_id, slug } = req.params
            var { sort } = req.query
            if (!sort || sort !== "asc" && sort !== "desc") sort = "asc"
            sort = { number: sort }
            var anime = await Anime.findOne({ anime_id, slug }, { _id: 0, __v: 0 })
            if (!anime) throw Error("Not found.")
            var genres = await Genre.find({ genre_id: { $in: anime.genres } }, { _id: 0 }).select("title")
            var episodes = await Episode.find({ anime_id }, { _id: 0 })
                .select("thumbnail views sources number description")
                .sort(sort)
            var recommend = await Anime
                .aggregate([{ $match: { genres: { $in: anime.genres } } }, { $sample: { size: 8 } }])
                .project("title slug thumb anime_id -_id")
            sort = sort.number
            if (sort === "asc") {
                sort = "desc"
            } else {
                sort = "asc"
            }
            res.render('anime', {
                settings,
                url: reqUrl,
                pageTitle: "Calendar",
                sort,
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
            var { settings, reqUrl, isMobile } = res.locals
            var { anime_id, slug, number } = req.params
            var episodeList = {}
            var episodes = await Episode
                .find({ anime_id }, { _id: 0 })
                .select("thumbnail views sources number description")
            episodeList.caption = "Episodes List"
            episodeList.items = episodes
            var episode = await Episode.findOne({ anime_id, number }, { _id: 0 })
            var anime = await Anime.findOne({ anime_id, slug }, { _id: 0 }).select("title genres anime_id slug en_title jp_title")
            var recommend = await Anime
                .aggregate([{ $match: { genres: { $in: anime.genres } } }, { $sample: { size: 16 } }])
                .project("title slug thumb anime_id -_id")
            res.render('watch', {
                settings,
                url: reqUrl,
                pageTitle: anime.title + " Episode " + episode.number,
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
        try {
            var { settings, reqUrl, isMobile } = res.locals
            var { sort } = req.params
            var { g } = req.query
            if (g === "all" || !parseInt(g)) {
                g = null
            }
            if (!sort || sort !== "views" && sort !== "favorites") throw Error("Not found.")
            sort = [[sort, -1]]
            var genres = await Genre.find({}, { __v: 0, _id: 0 });
            var genre = g ? { genres: { $in: parseInt(g) } } : {};
            var topRank = await Anime
                .find(genre, { _id: 0 })
                .limit(50)
                .sort(sort)
                .select("title slug thumb anime_id")
            if (topRank.length === 0) {
                topRank = await Anime
                    .find({}, { _id: 0 })
                    .limit(50)
                    .sort(sort)
                    .select("title slug thumb anime_id")
            }
            res.render('ranking', {
                settings,
                url: reqUrl,
                pageTitle: "Ranking",
                topRank,
                genres,
                isMobile
            })
        } catch (err) {
            console.log(err.message)
        }
    },
    async getAnimeCalendar(req, res) {
        try {
            var { settings, reqUrl, isMobile } = res.locals
            var { day } = req.params
            if (!day) day = "monday"
            day = dayToNum(day)
            if (typeof (day) !== "number") throw Error("Not found.")
            var calendar = await Calendar.find({ day }, { __v: 0, _id: 0 })
            var animes = []
            var option = await Option.findOne({ default: true })
            if (!option) throw Error("Setting not found. Please set option in backend fisrt.")
            var { settings } = option
            var { current_season } = settings
            for (var item of calendar) {
                var anime = await Anime
                    .findOne({ anime_id: item.anime }, { _id: 0 })
                    .select("title slug thumb anime_id")
                animes.push(anime)
            }
            var weekRecommend = await Anime
                .aggregate([{ $sample: { size: 9 } }])
                .project("title slug thumbPortrait anime_id -_id")

            var moreRecommend = await Anime
                .aggregate([{ $sample: { size: 9 } }])
                .sort({ favorites: -1 })
                .project("title slug thumbPortrait anime_id -_id")
            res.render('calendar', {
                settings,
                url: reqUrl,
                pageTitle: "Calendar",
                animes,
                current_season,
                weekRecommend,
                moreRecommend,
                calendar,
                isMobile
            })
        } catch (err) {
            console.log(err.message)
        }
    },
    async getAnimeList(req, res) {
        try {
            var { settings, reqUrl, isMobile } = res.locals
            var animes = await Anime.find({}, { _id: 0 }).select("title anime_id slug")
            animes = alphabet(animes)
            res.render('animes-list', {
                settings,
                url: reqUrl,
                pageTitle: "Animes List",
                animes,
                isMobile
            })
        } catch (err) {
            console.log(err.message)
        }
    },
    async suggestSearch(req, res) {
        try {
            var { q } = req.query
            var regex = new RegExp(escapeRegex(q), 'gi')
            var animes = await Anime.find({
                $or: [
                    { title: regex },
                    { description: regex },
                    { en_title: regex },
                    { jp_title: regex },
                    { premiered: regex },
                    { season: regex },
                    { studios: regex }
                ]
            }, { _id: 0 }).select("title").limit(5)
            res.send({ success: true, result: animes })
        } catch (err) {
            console.log(err.message)
        }
    },
    async searchAnime(req, res) {
        try {
            var { q, limit } = req.query
            var { settings, reqUrl, isMobile } = res.locals
            limit = parseInt(limit)
            var regex = new RegExp(escapeRegex(q), 'gi')
            var animes = await Anime.find({
                $or: [
                    { title: regex },
                    { description: regex },
                    { en_title: regex },
                    { jp_title: regex },
                    { premiered: regex },
                    { season: regex },
                    { studios: regex }
                ]
            }, { _id: 0 }).select("title thumb slug anime_id").limit(limit)
            counts = {}
            for (var item of animes) {
                var { anime_id } = item
                counts[anime_id] = await Episode.countDocuments({ anime_id })
            }
            res.render('search', {
                settings,
                query: q,
                url: reqUrl,
                pageTitle: "Anime Search",
                animes,
                counts,
                isMobile
            })
        } catch (err) {
            console.log(err.message)
        }
    },
}