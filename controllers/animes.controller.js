const axios = require('axios')
const Anime = require('../models/Anime')
const Option = require('../models/Options')
const Genre = require('../models/Genre')
const Episode = require('../models/Episode')
const Calendar = require('../models/Calendar')
const { dayToNum, alphabet, escapeRegex, getProxy, proxyimg,
    getSourceHls, escapeRegexRec, getSkipEp } = require('../helpers')
module.exports = {
    async getIndex(req, res) {
        try {
            var { settings, reqUrl, isMobile } = res.locals
            var { current_season } = settings
            if (current_season) {
                var currentSeasonItems = await Anime
                    .find({ season: current_season }, { _id: 0 })
                    .select("title slug thumb anime_id new")
                    .sort({ updated_at: -1 })
                    .limit(30)
                    .cache(150, 'current-season-home')
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
                .select("title slug thumb anime_id new")
                .cache(150, 'top-rank')
            var newUpdate = await Anime
                .find({}, { _id: 0 })
                .limit(30)
                .sort({ updated_at: -1 })
                .select("title slug thumb anime_id new")
                .cache(60, 'new-update')
            var recommend = await Anime
                .find({}, { _id: 0 })
                .limit(30)
                .sort({ favorites: -1 })
                .select("title slug thumb anime_id new")
                .cache(300, 'recommend')
            var random = await Anime
                .aggregate([{ $sample: { size: 30 } }])
                .project("title slug thumb anime_id new -_id")
                .cache(150, 'random')
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
                proxyimg,
                url: reqUrl,
                pageTitle: "Home Page",
                isMobile,
                currentSeason,
                topRank,
                features,
            })
        } catch (err) {
            console.error(err)
            res.render('error', {
                settings,
                pageTitle: 'Error',
                isMobile,
                isFooter: false
            });
        }
    },
    async getSeason(req, res) {
        try {
            var { settings, reqUrl, isMobile } = res.locals
            var { slug, sort } = req.params
            if (!slug) throw Error("Not found.")
            if (!sort || sort !== "views" && sort !== "favorites") throw Error("Not found.")
            var season = slug.split("_").join(" ")
            if (!season) throw Error("Not found.")
            sort = [[sort, -1]]
            if (season) {
                var seasons = await Anime
                    .find({ season }, { _id: 0 })
                    .select("title slug thumb anime_id")
                    .sort(sort)
                    .cache(300, "season-" + season + sort)
            } else {
                season = "Season ??"
                seasons = []
            }

            res.render('season', {
                slug,
                settings,
                proxyimg,
                url: reqUrl,
                pageTitle: season,
                seasons,
                isMobile
            })
        } catch (err) {
            console.error(err)
            res.render('error', {
                settings,
                pageTitle: 'Error',
                isMobile,
                isFooter: false
            });
        }
    },
    async getAnimeId(req, res, next) {
        try {
            var { settings, reqUrl, isMobile } = res.locals
            var { anime_id } = req.params
            if (!parseInt(anime_id)) throw Error("Not found.")
            var fs = require('fs')
            var old_db = fs.readFileSync('./old_db.json', { encoding: 'utf8' })
            old_db = JSON.parse(old_db)
            var oldData = old_db.filter(x => x.old === parseInt(anime_id))[0]
            if (oldData) {
                anime_id = oldData.new
                var slug = oldData.slug
                return res.redirect(`/anime/${anime_id}/${slug}`)
            } else {
                var anime = await Anime.findOne({ anime_id }).select("slug").cache(300, 're-' + anime_id)
                if (anime)
                    return res.redirect(`/anime/${anime_id}/${slug}`)
            }
        } catch (err) {
            console.error(err)
            res.render('error', {
                settings,
                pageTitle: 'Error',
                isMobile,
                isFooter: false
            });
        }
    },
    async getAnime(req, res) {
        try {
            var { settings, reqUrl, isMobile } = res.locals
            var { anime_id, slug } = req.params
            if (!parseInt(anime_id)) throw Error("Not found.")
            var { sort, eps } = req.query
            eps = parseInt(eps)
            if (!sort || sort !== "asc" && sort !== "desc") sort = "desc"
            sort = { number: sort }
            var search = eps >= 0 ? { anime_id, number: eps } : { anime_id }
            var anime = await Anime
                .findOne({ $or: [{ anime_id }, { slug }] }, { _id: 0, __v: 0 })
                .cache(300, anime_id)

            if (!anime) throw Error("Not found.")
            var genres = await Genre.find({ genre_id: { $in: anime.genres } }, { _id: 0 })
                .select("title")
                .cache(300, 'genre-' + anime_id)

            var episodes = await Episode.find(search, { _id: 0 })
                .select("thumbnail views sources number description")
                .sort(sort).limit(25)
                .cache(60, "episodes-" + anime_id)
            var regex = new RegExp(escapeRegexRec(anime.title), 'gi')
            var totalRec = await Anime.countDocuments({ title: regex })
            var recommend = await Anime.find({ anime_id: { $ne: anime_id }, title: regex }, { _id: 0 })
                .select("title slug thumb anime_id new")
                .limit(8)
                .cache(300, "recommend-" + anime_id)
            if (totalRec < 8) {
                var limit = 8 - totalRec + 1
                var moreRecommend = await Anime
                    .aggregate([{ $match: { genres: { $in: anime.genres } } }, { $sample: { size: limit } }])
                    .project("title slug thumb anime_id new -_id")
                    .cache(300, "recommendmore-" + anime_id)
                recommend = recommend.concat(moreRecommend)
            }
            sort = sort.number
            if (sort === "asc") {
                sort = "desc"
            } else {
                sort = "asc"
            }
            res.render('anime', {
                settings,
                url: reqUrl,
                pageTitle: anime.title,
                proxyimg,
                sort,
                anime,
                genres,
                episodes,
                recommend,
                isMobile
            })
        } catch (err) {
            console.error(err)
            res.render('error', {
                settings,
                pageTitle: 'Error',
                isMobile,
                isFooter: false
            });
        }
    },
    async getEpisode(req, res) {
        try {
            var { settings, reqUrl, isMobile } = res.locals
            var { anime_id, slug, number } = req.params
            number = parseInt(number)
            var episodeList = {}
            var totalEp = await Episode.findOne({ anime_id })
                .sort({ number: -1 }).select("number")
            var totalDoc = await Episode.countDocuments({ anime_id })
            totalEp = totalEp.number
            var skip = getSkipEp(totalDoc, number)
            var episodes = await Episode
                .find({ anime_id }, { _id: 0 })
                .select("thumbnail number")
                .limit(12)
                .sort({ number: - 1 })
                .skip(skip)
                .cache(60, "episodes-" + anime_id + number)
            episodeList.caption = "Episodes List"
            episodeList.items = episodes
            var episode = await Episode
                .findOne({ anime_id, number }, { _id: 0 })
                .cache(60, "episode-" + anime_id + number)

            var anime = await Anime.findOne({ $or: [{ anime_id }, { slug }] }, { _id: 0 })
                .select("title genres anime_id slug en_title jp_title")
                .cache(60, "anime-" + anime_id + number)

            var regex = new RegExp(escapeRegexRec(anime.title), 'gi')
            var totalRec = await Anime.countDocuments({ title: regex })
            var recommend = await Anime.find({ anime_id: { $ne: anime_id }, title: regex }, { _id: 0 })
                .select("title slug thumb anime_id new")
                .limit(8)
                .cache(300, "recommend-" + anime_id + number)
            if (totalRec < 8) {
                var limit = 8 - totalRec + 1
                var moreRecommend = await Anime
                    .aggregate([{ $match: { genres: { $in: anime.genres } } }, { $sample: { size: limit } }])
                    .project("title slug thumb anime_id new -_id")
                    .cache(300, "recommendmore-" + anime_id + number)
                recommend = recommend.concat(moreRecommend)
            }
            var sources = []
            for (var item of episode.sources) {
                item.backup = await getSourceHls(item.source)
                item.source = getProxy(item.source)
                sources.push(item)
            }
            res.render('watch', {
                settings,
                totalEp,
                proxyimg,
                url: reqUrl,
                pageTitle: anime.title + " Episode " + episode.number,
                isMobile,
                anime,
                episode,
                episodeList,
                recommend,
                sources
            })
        } catch (err) {
            console.error(err)
            res.render('error', {
                settings,
                pageTitle: 'Error',
                isMobile,
                isFooter: false
            });
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
                .cache(300, "ranking-" + sort + g)
            if (topRank.length === 0) {
                topRank = await Anime
                    .find({}, { _id: 0 })
                    .limit(50)
                    .sort(sort)
                    .select("title slug thumb anime_id")
                    .cache(300, "ranking-" + sort)
            }
            res.render('ranking', {
                settings,
                proxyimg,
                url: reqUrl,
                pageTitle: "Ranking",
                topRank,
                genres,
                isMobile
            })
        } catch (err) {
            console.error(err)
            res.render('error', {
                settings,
                pageTitle: 'Error',
                isMobile,
                isFooter: false
            });
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
                .cache(300, "recommend-calendar")

            var moreRecommend = await Anime
                .aggregate([{ $sample: { size: 9 } }])
                .sort({ favorites: -1 })
                .project("title slug thumbPortrait anime_id -_id")
                .cache(300, "recommendmore-calendar")

            res.render('calendar', {
                settings,
                proxyimg,
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
            console.error(err)
            res.render('error', {
                settings,
                pageTitle: 'Error',
                isMobile,
                isFooter: false
            });
        }
    },
    async getAnimeList(req, res) {
        try {
            var { settings, reqUrl, isMobile } = res.locals
            var animes = await Anime.find({}, { _id: 0 }).select("title anime_id slug").cache(300, "animelists")
            animes = alphabet(animes)
            res.render('animes-list', {
                settings,
                proxyimg,
                url: reqUrl,
                pageTitle: "Animes List",
                animes,
                isMobile
            })
        } catch (err) {
            res.render('error', {
                settings,
                pageTitle: 'Error',
                isMobile,
                isFooter: false
            });
        }
    },
    async suggestSearch(req, res) {
        try {
            var { q } = req.query
            if (/["]/.test(q)) {
                var regex = q.replace(/['"]+/g, '')
            } else {
                var regex = new RegExp(escapeRegex(q), 'gi')
            }
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
            }, { _id: 0 }).select("title slug anime_id").limit(5)
                .cache(60, "search-" + q)
            res.send({ success: true, result: animes })
        } catch (err) {
            res.send({ success: false, message: err.message })
        }
    },
    async searchAnime(req, res) {
        try {
            var { q } = req.query
            var { settings, reqUrl, isMobile } = res.locals
            if (/["]/.test(q)) {
                var regex = q.replace(/['"]+/g, '')
            } else {
                var regex = new RegExp(escapeRegex(q), 'gi')
            }
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
            }, { _id: 0 }).select("title thumb slug anime_id").limit(30)
                .cache(60, "search-result-" + q)
            counts = {}
            for (var item of animes) {
                var { anime_id } = item
                counts[anime_id] = await Episode.countDocuments({ anime_id })
            }
            res.render('search', {
                settings,
                proxyimg,
                query: q,
                url: reqUrl,
                pageTitle: "Anime Search",
                animes,
                counts,
                isMobile
            })
        } catch (err) {
            console.error(err)
            res.render('error', {
                settings,
                pageTitle: 'Error',
                isMobile,
                isFooter: false
            });
        }
    },
}