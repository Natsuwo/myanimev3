const User = require('../models/User')
const Anime = require('../models/Anime')
module.exports = {
    async getMylist(req, res) {
        try {
            var { settings, reqUrl, isMobile, user } = res.locals
            if (user) {
                var list_id = user.myList || []
                var myList = await Anime
                    .find({ anime_id: { $in: list_id } }, { _id: 0 })
                    .limit(12)
                    .select("title thumb anime_id slug")
                myList = myList.sort((a, b) => list_id.indexOf(a.anime_id) -
                    list_id.indexOf(b.anime_id))
            }
            res.render('pages/auth/mylist', {
                pageTitle: "My Lists",
                myList,
                message: req.flash()
            })
        } catch (err) {
        }
    },
    async getMyAlert(req, res) {
        try {
            var { settings, reqUrl, isMobile, user } = res.locals
            if (user) {
                var list_id = user.myAlert || []
                var myAlert = await Anime
                    .find({ anime_id: { $in: list_id } }, { _id: 0 })
                    .limit(12)
                    .select("title thumb anime_id slug")
                myAlert = myAlert.sort((a, b) => list_id.indexOf(a.anime_id) -
                    list_id.indexOf(b.anime_id))
            }
            res.render('pages/auth/myalert', {
                pageTitle: "My Alerts",
                myAlert,
                message: req.flash()
            })
        } catch (err) {
        }
    },
    async addMyList(req, res) {
        try {
            var { user } = res.locals
            console.log(user)
            if (!user) throw Error("You are not signed in.")
            var { anime_id, title } = req.body
            var { user_id } = user
            user_id = parseInt(user_id)
            anime_id = parseInt(anime_id)
            if (user.user_id !== user_id || !user_id || !anime_id)
                throw Error("Something Wrong. Try again or contact the admin.")
            var isHas = await User.countDocuments({ myList: { $in: anime_id } })
            if (isHas) {
                await User.updateOne({ $pull: { myList: anime_id } })
                return res.send({ success: true, disabled: true, message: title + " removed in your list." })
            } else {
                await User.updateOne({ $push: { myList: { $each: [anime_id], $position: 0 } } })
                return res.send({ success: true, disabled: false, message: title + " added in your list." })
            }
        } catch (err) {
            res.status(403).send({ success: false, error: err.message })
        }
    },
    async addMyAlert(req, res) {
        try {
            var { user } = res.locals
            if (!user) throw Error("You are not signed in.")
            var { anime_id, title } = req.body
            var { user_id } = user
            user_id = parseInt(user_id)
            anime_id = parseInt(anime_id)
            if (user.user_id !== user_id || !user_id || !anime_id)
                throw Error("Something Wrong. Try again or contact the admin.")
            var isHas = await User.countDocuments({ myAlert: { $in: anime_id } })
            if (isHas) {
                await User.updateOne({ $pull: { myAlert: anime_id } })
                return res.send({ success: true, disabled: true, message: title + " turn off alert." })
            } else {
                await User.updateOne({ $push: { myAlert: { $each: [anime_id], $position: 0 } } })
                return res.send({ success: true, disabled: false, message: title + " turn on alert." })
            }

        } catch (err) {
            res.status(403).send({ success: false, error: err.message })
        }
    },
    async loadMyList(req, res) {
        try {
            var { user } = res.locals
            if (!user)
                throw Error("User are not signed in.")
            var { type, page } = req.query
            if (type === "alert")
                var list_id = user.myAlert || []
            else
                var list_id = user.myList || []
            if (list_id.length)
                list_id = list_id.slice((page - 1) * 12, page * 12)
            var items = await Anime
                .find({ anime_id: { $in: list_id } }, { _id: 0 })
                .limit(12)
                .select("title thumb anime_id slug")
            items = items
                .sort((a, b) => list_id.indexOf(a.anime_id) - list_id.indexOf(b.anime_id))
            res.send({ success: true, data: items })
        } catch (err) {
            res.status(404).send({ success: false, error: err.message })
        }
    }
}