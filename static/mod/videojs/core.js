function myAnimePlayer(id) {
    var player = videojs(id || "player")
    player.watermark({
        image: "/imgs/icons/logo-player.svg",
        url: "https://www.myanime.co",
        width: "200px"
    })
    return player
}

function switchLangs(langs) {
    var LSB = videojs.getComponent('MenuButton');
    var MenuItem = videojs.getComponent('MenuItem');
    videojs.getComponent('Player').prototype.setSource = function (source) {
        var options = {
            autoplay: false,
            preload: "auto",
            type: "video/mp4",
            src: "https://www.googleapis.com/drive/v3/files/" + source + "?alt=media&supportsTeamDrives=true&key=AIzaSyDtV2YN9J2TYCIvO688nsToWj7LtJvqLyo"
        };
        player.src(options);
        player.Resume({
            uuid: window.location.pathname
        });

    };

    videojs.MenuItemTest = videojs.extend(MenuItem, {
        constructor: function (player, options, onClickListener) {
            this.onClickListener = onClickListener;
            MenuItem.call(this, player, options);
            this.on('click', this.onClick);
            this.on('touchstart', this.onClick);
        },
        onClick: function () {
            this.onClickListener(this);
            var selected = this.options_.source;
            player.setSource(selected);
        }
    });

    var LangSwitch = videojs.extend(LSB, {
        constructor: function () {
            LSB.apply(this, arguments);
            this.addClass('vjs-icon-captions');
            this.addClass('ma-lang-icon');
        },
        handleClick: function () {
            if (this.buttonPressed_) {
                this.unpressButton();
            } else {
                this.pressButton();
            }
        },
        createItems: function () {
            var menuItems = [];

            if (!langs.length) {
                return [];
            }

            var onClickUnselectOthers = function (clickedItem) {
                menuItems.map(function (item) {
                    if ($(item.el()).hasClass('vjs-selected')) {
                        $(item.el()).removeClass('vjs-selected');
                    }
                });
                $(clickedItem.el()).addClass('vjs-selected');
            };

            for (var i = 0; i < langs.length; i++) {
                var lang = langs[i]
                var item = new videojs.MenuItemTest(this.player_, {
                    tabIndex: i,
                    label: lang.subtitle,
                    source: lang.source,
                    class: 'vjs-menu-item'
                }, onClickUnselectOthers);

                if (lang.subtitle === 'EN') {
                    $(item.el()).addClass('vjs-selected');
                }

                item.addClass(`vjs-${lang.subtitle}-menu-item`);
                menuItems.push(item);
            }
            return menuItems
        }
    });
    videojs.registerComponent('LangSwitch', LangSwitch);
    player.getChild('controlBar').addChild('LangSwitch', {}, 10);
}

function loadAds(player) {
    var options = { adTagUrl: BB.getVASTUrl(2008513) }
    player.ima(options)
    var contentPlayer = document.getElementById('content_video_html5_api')
    if ((navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/Android/i)) &&
        contentPlayer.hasAttribute('controls')) {
        contentPlayer.removeAttribute('controls')
    }
    var initAdDisplayContainer = function () {
        player.ima.initializeAdDisplayContainer()
        wrapperDiv.removeEventListener(startEvent, initAdDisplayContainer)
    }
    var startEvent = 'click'
    if (navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/Android/i)) {
        startEvent = 'touchend'
    }
    var wrapperDiv = document.getElementById('player')
    wrapperDiv.addEventListener(startEvent, initAdDisplayContainer)
}