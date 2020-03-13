var player = videojs('player');
var options = { id: 'player', adTagUrl: BB.getVASTUrl(2008513) };
player.ima(options);

var contentPlayer = document.getElementById('content_video_html5_api');
if ((navigator.userAgent.match(/iPad/i) ||
  navigator.userAgent.match(/Android/i)) &&
  contentPlayer.hasAttribute('controls')) {
  contentPlayer.removeAttribute('controls');
}

var initAdDisplayContainer = function () {
  player.ima.initializeAdDisplayContainer();
  wrapperDiv.removeEventListener(startEvent, initAdDisplayContainer);
}

var startEvent = 'click';
if (navigator.userAgent.match(/iPhone/i) ||
  navigator.userAgent.match(/iPad/i) ||
  navigator.userAgent.match(/Android/i)) {
  startEvent = 'touchend';
}

var wrapperDiv = document.getElementById('player');
wrapperDiv.addEventListener(startEvent, initAdDisplayContainer);
