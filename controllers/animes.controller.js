const axios = require('axios')
const Mobile = require('../helpers/is-mobile')
module.exports = {
    async getIndex(req, res) {
        var isMobile = Mobile(req)
        var currentSeason = {}
        var items = [
            {
                item_id: 1,
                slug: "189-17",
                img_url: "https://hayabusa.io/abema/series/189-17/thumb.v1583134503.png",
                title: "Chi Baku Shounen Hanako Kun"
            },
            {
                item_id: 2,
                slug: "26-87",
                img_url: "https://hayabusa.io/abema/series/26-87/thumb.v1583130903.png",
                title: "Darwin's Game"
            },
            {
                item_id: 3,
                slug: "15-2",
                img_url: "https://hayabusa.io/abema/series/15-2/thumb.v1582287314.png",
                title: "Kingdom Season 1"
            },
            {
                item_id: 4,
                slug: "54-42",
                img_url: "https://hayabusa.io/abema/series/54-42/thumb.v1583133946.png",
                title: "Interspecies Reviewers"
            },
            {
                item_id: 5,
                slug: "54-44",
                img_url: "https://hayabusa.io/abema/series/54-44/thumb.v1583133947.png",
                title: "Interspecies Reviewers Ura-Opt ver"
            },
            {
                item_id: 6,
                slug: "12-18",
                img_url: "https://hayabusa.io/abema/series/12-18/thumb.v1583219462.png",
                title: "Crayon Shin-chan"
            },
            {
                item_id: 7,
                slug: "26-75",
                img_url: "https://hayabusa.io/abema/series/26-75/thumb.v1582171511.png",
                title: "Kimetsu no Yaiba"
            },
            {
                item_id: 8,
                slug: "26-82",
                img_url: "https://hayabusa.io/abema/series/26-82/thumb.v1583212208.png",
                title: "Nanatsu no Taizai"
            }
        ]
        currentSeason.caption = "Current Season"
        currentSeason.items = items
        var options = {
            'method': 'GET',
            'headers': {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
                'accept': 'application/json, text/plain, */*',
                'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXYiOiJlYzNhOWYzZS1mZjhhLTQ4MjAtYmM3Yi1iOGY2M2QxZThlNDgiLCJleHAiOjIxNDc0ODM2NDcsImlzcyI6ImFiZW1hLmlvL3YxIiwic3ViIjoiOXh0SlNGM2haU1hiVE0ifQ.pwoaObCY_6KxryCvK0iUzW2lSiqBT3sIytonHAdnpAA',
            }
        };
        var feaRes = await axios('https://api.abema.io/v1/video/genres/animation/features/premium?type=program,series,slot', options)
        var { features } = feaRes.data
        res.render('index', {
            isMobile,
            currentSeason,
            features,
        })
    },
    async getAnime(req, res) {
        var isMobile = Mobile(req)
        var { slug } = req.params
        res.render('anime', {
            isMobile
        })
    },
    async getEpisode(req, res) {
        var isMobile = Mobile(req)
        var { episode_id } = req.params
        var episodeList = {}
        var items = [
            {
                item_id: 1,
                slug: "189-17",
                img_url: "https://hayabusa.io/abema/series/189-17/thumb.v1583134503.png",
                title: "Chi Baku Shounen Hanako Kun"
            },
            {
                item_id: 2,
                slug: "26-87",
                img_url: "https://hayabusa.io/abema/series/26-87/thumb.v1583130903.png",
                title: "Darwin's Game"
            },
            {
                item_id: 3,
                slug: "15-2",
                img_url: "https://hayabusa.io/abema/series/15-2/thumb.v1582287314.png",
                title: "Kingdom Season 1"
            },
            {
                item_id: 4,
                slug: "54-42",
                img_url: "https://hayabusa.io/abema/series/54-42/thumb.v1583133946.png",
                title: "Interspecies Reviewers"
            },
            {
                item_id: 5,
                slug: "54-44",
                img_url: "https://hayabusa.io/abema/series/54-44/thumb.v1583133947.png",
                title: "Interspecies Reviewers Ura-Opt ver"
            },
            {
                item_id: 6,
                slug: "12-18",
                img_url: "https://hayabusa.io/abema/series/12-18/thumb.v1583219462.png",
                title: "Crayon Shin-chan"
            },
            {
                item_id: 7,
                slug: "26-75",
                img_url: "https://hayabusa.io/abema/series/26-75/thumb.v1582171511.png",
                title: "Kimetsu no Yaiba"
            },
            {
                item_id: 8,
                slug: "26-82",
                img_url: "https://hayabusa.io/abema/series/26-82/thumb.v1583212208.png",
                title: "Nanatsu no Taizai"
            }
        ]
        episodeList.caption = "Episode List"
        episodeList.items = items
        res.render('watch', {
            isMobile,
            episodeList,
        })
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