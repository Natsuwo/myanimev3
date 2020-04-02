!function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ?
            n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
    n.queue = []; t = b.createElement(e); t.async = !0;
    t.src = v; s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s)
}(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '2606921149565067');
fbq('track', 'PageView');

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'UA-128377757-1');

var myanimeResize = false
function carouselCallback(id, slide, lg, md, sm, xs) {
    $(document).ready(function () {
        $('#' + id).slick({
            infinite: false,
            dots: false,
            lazyLoad: 'ondemand',
            slidesToShow: slide,
            slidesToScroll: slide,
            nextArrow: '<a class="ma-carousel-next" href="#" role="button"><span class="ma-carousel-next-icon"></span><span class="sr-only">Next</span></a>',
            prevArrow: '<a class="ma-carousel-prev" href="#" role="button" style="display:inline-flex;"><span class="ma-carousel-prev-icon"></span><span class="sr-only">Previous</span></a>',
            responsive: [
                {
                    breakpoint: 1600,
                    settings: {
                        slidesToShow: lg || 4,
                        slidesToScroll: lg || 4,
                    }
                },
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: md || 3,
                        slidesToScroll: md || 3,
                    }
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: sm || 2,
                        slidesToScroll: sm || 2,
                    }
                },
                {
                    breakpoint: 576,
                    settings: {
                        slidesToShow: xs || 1,
                        slidesToScroll: xs || 1,
                    }
                }
            ]
        });
    });
}

jQuery(function ($) {

    $(".sidebar-dropdown > a").click(function () {
        $(".sidebar-submenu").slideUp(200);
        if (
            $(this)
                .parent()
                .hasClass("active")
        ) {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
                .parent()
                .removeClass("active");
        } else {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
                .next(".sidebar-submenu")
                .slideDown(200);
            $(this)
                .parent()
                .addClass("active");
        }
    });

    // Sidebar 1
    $("#sidebar-close").click(function () {
        $(".page-wrapper").removeClass("toggled");
    });
    $("#ma-overlay").click(function () {
        if ($("#sidebar-toggler").attr('data-trigger') == 'true') {
            $("#sidebar-toggler").attr('data-trigger', 'false');
            $(".page-wrapper").removeClass("toggled");
            $(this).toggle();
        }
    });

    $("#sidebar-toggler").click(function () {
        if ($(this).attr('data-trigger') == 'true') {
            $(this).attr('data-trigger', 'false');
            $(".page-wrapper").removeClass("toggled");
            $("#ma-overlay").toggle();
        } else {
            $(this).attr('data-trigger', 'true');
            $(".page-wrapper").addClass("toggled");
            $("#ma-overlay").toggle();
        }
        // $(".page-wrapper").addClass("toggled");
    });

    $("#ma-dropdown-details").click(function () {
        var contentId = ".ma-episode-section-details-mobile"
        if ($(contentId).attr('aria-hidden') == 'true') {
            var maxHeight = $('.ma-episode-details-readmore-block').height()
            $(contentId).attr('aria-hidden', 'false');
            $(this).removeClass("ma-episode-details-dropdown-collapsed");
            $(contentId).css("height", maxHeight + 100);
        } else {
            $(contentId).attr('aria-hidden', 'true');
            $(this).addClass("ma-episode-details-dropdown-collapsed");
            $(contentId).css("height", "");
        }
    });

    $(".ma-readmore-button-mobile").click(function () {
        $(".ma-anime-description-content-mobile").removeClass("ma-anime-description-content-mobile-collapsed");
        $(".ma-anime-description-content-mobile").css("height", "");
        $(".ma-readmore-button-wrapper").remove();
    });

});

$(document).ready(function () {
    // Loadmore
    var _COUNTLIST = 1
    var _TYPE = null
    var _PATHNAME = window.location.pathname.split("/")
    if (_PATHNAME.length > 2 && _PATHNAME[2] === "alerts") {
        _TYPE = "alert"
    }
    if (_PATHNAME.length > 2 && _PATHNAME[2] === "lists") {
        _TYPE = "mylist"
    }
    if (_TYPE) {
        $(window).scroll(function () {
            if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10 && _TYPE) {
                _COUNTLIST++
                var request = $.ajax({
                    url: `/api/user/loadlist/?page=${_COUNTLIST}&type=${_TYPE}`,
                    method: 'GET',
                    contentType: "application/json; charset=utf-8",
                    processData: false
                })
                request.done(function (resp) {
                    if (resp.data.length) {
                        $.each(resp.data, function (index, item) {
                            var { anime_id, title, slug, thumb } = item
                            $('#ma-itemList')
                                .append(`<li class="ma-mylist-animeList-item"><a class="ma-link-block" href="/anime/${anime_id}/${slug}"><div class="ma-mylist-animeList-inner"><div class="ma-mylist-animeList-item-thumbnail"><div class="ma-m-thumbnail ma-m-thumbnail-loaded"><img class="ma-m-thumbnail-image" alt="BNA" srcset="${thumb}?w=192&h=108&amp;q=85&f=webp 1x, ${thumb}?w=384&h=216&q=85&f=webp 2x" loading="lazy" src="${thumb}?w=192&h=108&q=85&f=webp"><div class="ma-m-thumbnail-play ma-m-thumbnail-play-desktop"><span class="ma-m-play-icon"><svg class="ma-symbol" aria-label="" width="100%" height="100%" role="img" focusable="false"><use xlink:href="/imgs/icons/playback.svg?v=v20.227.5#svg-body"></use></svg></span></div></div></div><div class="ma-mylist-animeList-item-details"><p class="ma-mylist-animeList-item-entity-title">${title}</p></div><div class="ma-mylist-animeList-item-delete"><div class="ma-mylist-animeList-item-delete-button" type="button" onclick="event.stopPropagation();event.preventDefault();removeMyList(this,'${title}','${anime_id}')"><svg class="ma-symbol" aria-label="Delete" width="100%" height="100%" role="img" focusable="false"><use xlink:href="/imgs/icons/delete.svg#svg-body"></use></svg></div></div></div></a></li>`);
                        });
                    } else {
                        _TYPE = null
                    }
                }).fail(function (data) {
                    _TYPE = null
                })
            }
        });
    }
    // End Loadmore
    var pathname = window.location.pathname;
    var searchAnime = window.location.search
    $('.ma-mobile-sidebar-menu-drawer div a[href="' + pathname + '"]').addClass('active');
    $('.ma-ranking-type-tablist li a[href="' + pathname + '"]').parent().addClass('active');
    $('#select-menu-1 li a[href="' + searchAnime + '"]').parent().addClass('selected');
    var rankMenuTextPc = $('#select-menu-1 > li.selected a').text() || "All";
    var rankMenuTextMb = $('.ma-select-menu-mobile-select option[value="' + searchAnime + '"]').text() || "All";
    $('.ma-select-menu-mobile-label-text').text(rankMenuTextMb)
    $('.ma-select-menu-desktop-label').text(rankMenuTextPc)

    $(window).trigger('resize');
    $('#ma-readmore-button').on("click", function () {
        var contentId = "#ma-readmore-content-info"
        var maxHeight = $('.ma-readmore').height()
        if ($(contentId).attr('data-trigger') === 'false') {
            $(this).text("Show less")
            $(contentId).attr('data-trigger', 'true');
            $(contentId).addClass("ma-readmore-expanded-info");
            $(contentId).css("max-height", maxHeight + 100);
        } else {
            $(this).text("Show more")
            $(contentId).attr('data-trigger', 'false');
            $(contentId).removeClass("ma-readmore-expanded-info");
            $(contentId).css("max-height", "");
        }
    });

    $(document).click(function (event) {
        var clickover = $(event.target);
        var _opened = $(".collapse").hasClass("collapse show");
        if (_opened === true && !clickover.hasClass("btn ma-select-menu-desktop-button")) {
            $("div.btn.ma-select-menu-desktop-button").click();
        }
    });
});

$(window).scroll(function () {
    var scroll = $(window).scrollTop();
    if (scroll >= 100) {
        $(".ma-navbar").addClass("ma-navbar-scroll");
    } else {
        $(".ma-navbar").removeClass("ma-navbar-scroll");
    }
});

$(window).resize(function () {
    var width = $(window).width();
    if (width <= 1024) {
        $("#ma-search-icon").addClass("btn p-0 ma-search-button").attr('data-searching', 'false');
        $(".ma-navbar-search-input").addClass("ma-navbar-search-input-collapsed").removeClass("ma-navbar-search-input");
        if (myanimeResize === false) {
            myanimeResize = true
            $('#ma-search-icon').on("click", function () {
                if ($(this).attr('data-searching') === 'false') {
                    $(this).attr('data-searching', 'true');
                    $(".ma-navbar").addClass("ma-navbar-searching");
                    $(".ma-search-bar").addClass("ma-search-bar-full").removeClass("ma-non-list");
                    $(".ma-navbar-search-input-collapsed").addClass("ma-searching-input");
                    $(".ma-navbar-search-area").addClass("ma-navbar-search-area-searching");
                } else {
                    $(this).attr('data-searching', 'false');
                    $(".ma-navbar").removeClass("ma-navbar-searching");
                    $(".ma-search-bar").removeClass("ma-search-bar-full").addClass("ma-non-list");
                    $(".ma-navbar-search-input-collapsed").removeClass("ma-searching-input");
                    $(".ma-navbar-search-area").removeClass("ma-navbar-search-area-searching");
                }

            });
        }

    } else {
        $("#ma-search-icon").removeClass("btn p-0 ma-search-button").removeAttr('data-searching').prop("onclick", null).off("click");
        $(".ma-navbar").removeClass("ma-navbar-searching");
        $(".ma-search-bar").removeClass("ma-search-bar-full").addClass("ma-non-list");
        $(".ma-navbar-search-input-collapsed").removeClass("ma-searching-input");
        $(".ma-navbar-search-area").removeClass("ma-navbar-search-area-searching");
        $(".ma-navbar-search-input-collapsed").addClass("ma-navbar-search-input").removeClass("ma-navbar-search-input-collapsed");
        myanimeResize = false
    }
});

function windowPopup(url, width, height) {
    var left = (screen.width / 2) - (width / 2),
        top = (screen.height / 2) - (height / 2);
    window.open(
        url,
        "",
        "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left
    );
}

function socialShare(type, text, url) {
    if (text) text = encodeURIComponent(text)
    url = encodeURIComponent(url)
    if (type === "twit") {
        var url = "https://twitter.com/intent/tweet/?text=" + text + "&url=" + url + "&button_hashtag=myanime&via=myanime_co"
        windowPopup(url, 600, 480);
    }

    if (type === "fb") {
        var url = "https://www.facebook.com/sharer/sharer.php?u=" + url + ""
        windowPopup(url, 600, 480);
    }

    if (type === "line") {
        var url = "https://social-plugins.line.me/lineit/share?url=" + url + ""
        windowPopup(url, 600, 480);
    }
}

function myListAlert(type, title, anime_id, user_id) {
    var form = {
        title,
        anime_id,
        user_id
    }
    var request = $.ajax({
        url: '/user/' + type,
        method: 'PUT',
        data: JSON.stringify(form),
        contentType: "application/json; charset=utf-8",
        processData: false
    })
    request.done(function (resp) {
        var isDisabled = resp.disabled || false
        changeAlertMyList(type, isDisabled)
        snackBar(!isDisabled, resp.message)
    }).fail(function (data) {
        snackBar(false, data.responseJSON.error)
    })
}

function changeAlertMyList(type, isDisabled) {
    var svg = document.getElementById("ma-" + type).getElementsByTagName('use')[0];
    var _BUTTON = $("#ma-" + type + " .ma-" + type + "-button")
    var icon = "alarm_clock_"
    if (type === "mylist")
        icon = ""
    if (isDisabled) {
        _BUTTON.removeClass("active")
        svg.href.baseVal = `/imgs/icons/${icon}plus.svg?v=v20.227.5#svg-body`;
        return;
    } else {
        _BUTTON.addClass("active")
        svg.href.baseVal = `/imgs/icons/${icon}checkmark.svg?v=v20.227.5#svg-body`;
        return;
    }
}

function snackBar(bl, string) {
    var x = $("#my-noti");
    x.text(string);
    var istrue = bl ? '' : 'error';
    x.removeClass("done")
    x.addClass(`show ${istrue}`);
    setTimeout(function () {
        x.addClass("done")
        x.removeClass(`show ${istrue}`)
        return;
    }, 5000);
}

function removeMyList(e, title, anime_id) {
    var _TYPE = null
    var _PATHNAME = window.location.pathname.split("/")
    if (_PATHNAME.length > 2 && _PATHNAME[2] === "alerts") {
        _TYPE = "alert"
    }
    if (_PATHNAME.length > 2 && _PATHNAME[2] === "lists") {
        _TYPE = "mylist"
    }
    var form = {
        title,
        anime_id
    }
    var request = $.ajax({
        url: '/user/' + _TYPE,
        method: 'PUT',
        data: JSON.stringify(form),
        contentType: "application/json; charset=utf-8",
        processData: false
    })
    request.done(function (resp) {
        var isDisabled = resp.disabled || false
        $(e).parents('li').remove();
        snackBar(!isDisabled, resp.message)
    }).fail(function (data) {
        snackBar(false, data.responseJSON.error)
    })
}

$(function () {
    var searchResult = []
    var old_value = ""
    $("#ma-search-input").autocomplete({
        source: function (value, event) {
            var term = value.term
            if (term === old_value) {
                return event(searchResult)
            } else {
                $.ajax({
                    type: 'GET',
                    url: '/search/queries?q=' + term,
                    success: function (resp) {
                        var result = []
                        $.each(resp.result, function (index, val) {
                            val.label = val.title;
                            result.push(val);
                        });
                        searchResult = result
                        old_value = term
                        return event(result);
                    }
                })
            }
        },
        select: function (event, ui) {
            var pathname = '/anime/' + ui.item.anime_id + '/' + ui.item.slug + ''
            window.location.pathname = pathname
        },
        position: {
            my: "left top+10",
            at: "left bottom",
            collision: "none"
        }
    }).bind('focus', function () {
        $(this).autocomplete("search");
    });
});
