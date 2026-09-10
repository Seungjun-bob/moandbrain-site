/* 히어로 영상: 음소거/재생 토글 · prefers-reduced-motion이면 정지 + 포스터 */
(function () {
  document.querySelectorAll('[data-hero-video]').forEach(function (hero) {
    var v = hero.querySelector('video'); if (!v) return;
    var mute = hero.querySelector('[data-video-mute]'), play = hero.querySelector('[data-video-play]');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    v.muted = true;
    if (reduce) { v.pause(); v.removeAttribute('autoplay'); } else { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    function syncPlay() { if (play) { play.setAttribute('aria-label', v.paused ? '영상 재생' : '영상 일시정지'); play.dataset.state = v.paused ? 'paused' : 'playing'; } }
    function syncMute() { if (mute) { mute.setAttribute('aria-label', v.muted ? '소리 켜기' : '소리 끄기'); mute.dataset.state = v.muted ? 'muted' : 'sound'; } }
    if (mute) mute.addEventListener('click', function () { v.muted = !v.muted; syncMute(); });
    if (play) play.addEventListener('click', function () { if (v.paused) v.play(); else v.pause(); syncPlay(); });
    v.addEventListener('play', syncPlay); v.addEventListener('pause', syncPlay); syncPlay(); syncMute();
  });
})();
