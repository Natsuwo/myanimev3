require('dotenv').config()
const app = require('./app')(__dirname)
const server = require('http').Server(app)
const port = process.env.PORT || 4000
// const io = require('socket.io')(server)
// require('./socketio')(io)
server.listen(port);






var axios = require('axios')
function dupSource(source, type, audio, subtitle) {
    var dup = false
    if (source.type === type
        && source.audio === audio
        && source.subtitle === subtitle) {
        dup = true
    }
    return dup
}
function changeToSlug(str) {
    var title, slug;
    //Lấy text từ thẻ input title 
    title = str;
    //Đổi chữ hoa thành chữ thường
    slug = title;
    //Đổi ký tự có dấu thành không dấu
    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    slug = slug.replace(/đ/gi, 'd');
    //Xóa các ký tự đặt biệt
    slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\[|\]|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
    //Đổi khoảng trắng thành ký tự gạch ngang
    slug = slug.replace(/ /gi, "_");
    //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
    //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
    slug = slug.replace(/\-\-\-\-\-/gi, '_');
    slug = slug.replace(/\-\-\-\-/gi, '_');
    slug = slug.replace(/\-\-\-/gi, '_');
    slug = slug.replace(/\-\-/gi, '_');
    //Xóa các ký tự gạch ngang ở đầu và cuối
    slug = '@' + slug + '@';
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');
    //In slug ra textbox có id “slug”
    return encodeURIComponent(slug)
}

function changeLang(lang) {
    var result
    switch (lang) {
        case "Japanese":
            result = "JP";
            break;
        case "English":
            result = "EN";
            break;
        case "Chinese":
            result = "CN";
            break;
        case "Vietnamese":
            result = "VN";
            break;
    }
    return result
}

async function createEpisode(episodes, anime_id) {
    var Episode = require('./models/Episode')
    for (var episode of episodes) {
        var { sources, views, title, number, thumbnail } = episode
        var isHas = await Episode.findOne({ anime_id, number })
        if (isHas) {
            continue;
        } else {
            await Episode.create({ anime_id, views, sources, caption: title, number, thumbnail })
            console.log('Create episode ' + number + ' for anime ' + anime_id)
        }
    }
}

async function abc() {
    var Anime = require('./models/Anime')
    var resp = await axios.get('http://localhost:3000/api/get-animes')
    var respmeta = await axios.get('http://localhost:3000/api/get-animemeta')
    var respep = await axios.get('http://localhost:3000/api/get-episodes')
    var animes = resp.data.data
    var animemeta = respmeta.data.data
    var episodes = respep.data.data
    var count = 0
    for (var anime of animes) {
        count++
        console.log('Upload anime ' + count)
        var { anime_id, title, followers, thumbnail, description, type, studios, premiered, season, studios, cover, views } = anime
        var slug = changeToSlug(title)
        var isHas = await Anime.findOne({ slug, title })

        var thumbPortrait = "";
        var thumb = "";
        var sources = []
        var favorites = followers
        var en_title = animemeta.filter(x => x.anime_id === anime_id && x.meta_key === "en_title")
        en_title = en_title.length === 1 ? en_title[0].meta_value : ""
        var jp_title = animemeta.filter(x => x.anime_id === anime_id && x.meta_key === "jp_title")
        jp_title = jp_title.length === 1 ? jp_title[0].meta_value : ""
        var genres = animemeta.filter(x => x.anime_id === anime_id && x.meta_key === "genre")
        genres = genres.length === 1 ? genres[0].meta_value : []
        var episode = episodes.filter(x => x.anime_id === anime_id)

        episode.forEach(function (item) {
            var existing = sources.filter(function (v, i) {
                return v.number == item.number;
            });
            item.audio = changeLang(item.audio)
            item.subtitle = changeLang(item.subtitle)
            var itemSource = {
                source: item.source,
                type: item.type,
                audio: item.audio,
                subtitle: item.subtitle
            }
            if (existing.length) {
                var existingIndex = sources.indexOf(existing[0]);
                sources[existingIndex].sources.push(itemSource)
            } else {
                if (typeof item.source == 'string') {
                    item.sources = []
                    item.sources.push(itemSource)
                }
                sources.push(item);
            }
        });

        if (isHas) {
            var newAnimeId = isHas.anime_id
            await createEpisode(sources, newAnimeId)
            continue;
        };
        thumbPortrait = thumbnail
        if (cover) {
            thumb = cover
        } else {
            thumb = thumbPortrait
        }
        var animeCreate = await Anime.create({
            title, slug, en_title, jp_title, type, premiered,
            genres, season, studios, description, thumb, thumbPortrait, favorites, views
        })
        var newAnimeId = animeCreate.anime_id
        await createEpisode(sources, newAnimeId)
    }
}

// abc()
