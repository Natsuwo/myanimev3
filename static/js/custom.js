var myanimeResize = false
function carouselCallback(id, slide, lg, md, sm, xs) {
    $(document).ready(function () {
        $('#' + id).slick({
            infinite: false,
            dots: false,
            lazyLoad: 'progressive',
            slidesToShow: slide,
            slidesToScroll: slide,
            nextArrow: `<a class="ma-carousel-next" href="#" role="button"><span class="ma-carousel-next-icon"></span><span class="sr-only">Next</span></a>`,
            prevArrow: `<a class="ma-carousel-prev" href="#" role="button" style="display:inline-flex;"><span class="ma-carousel-prev-icon"></span><span class="sr-only">Previous</span></a>`,
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
    // $("#sidebar-close").click(function () {
    //     $(".page-wrapper").removeClass("toggled");
    // });
    $("#ma-overlay").click(function () {
        if ($("#sidebar-toggler").attr('data-trigger') == 'true') {
            $("#sidebar-toggler").attr('data-trigger', 'false');
            $(".page-wrapper").removeClass("toggled");
            $(this).toggle();
        }
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
});

$(document).ready(function () {
    var pathname = window.location.pathname;
    var { search } = window.location
    $('.ma-ranking-type-tablist li a[href="' + pathname + '"]').parent().addClass('active');
    $('#select-menu-1 li a[href="' + search + '"]').parent().addClass('selected');
    var rankMenuTextPc = $('#select-menu-1 > li.selected a').text() || "All";
    var rankMenuTextMb = $('.ma-select-menu-mobile-select option[value="' + search + '"]').text() || "All";
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
        $(".ma-navbar-search-icon").addClass("btn p-0 ma-search-button").attr('data-searching', 'false');
        $(".ma-navbar-search-input").addClass("ma-navbar-search-input-collapsed").removeClass("ma-navbar-search-input");
        if (myanimeResize === false) {
            myanimeResize = true
            $('.ma-search-button').on("click", function () {
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
        $(".ma-navbar-search-icon").removeClass("btn p-0 ma-search-button").removeAttr('data-searching').prop("onclick", null).off("click");
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

$(function () {
    var searchResult = []
    var old_value = ""
    $("#ma-search-input").autocomplete({
        source: function (value, event) {
            var { term } = value
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
            $("#ma-search-input").val(ui.item.title);
            $(".ma-navbar-search-area").submit();
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
