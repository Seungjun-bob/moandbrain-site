/* 메인 아카데미 넘기기(C9): 화살표로 한 칸씩 · 손가락으로 밀기(scroll-snap) · 끝에서는 화살표 흐리게 */
(function () {
  document.querySelectorAll('[data-track]').forEach(function (wrap) {
    var track = wrap.querySelector('.h-track'); if (!track) return;
    var prev = wrap.querySelector('[data-prev]'), next = wrap.querySelector('[data-next]');
    function step() { var c = track.firstElementChild; var gap = parseFloat(getComputedStyle(track).columnGap) || 0; return c ? c.getBoundingClientRect().width + gap : track.clientWidth; }
    function sync() { if (prev) prev.disabled = track.scrollLeft <= 2; if (next) next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2; }
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
    track.addEventListener('scroll', sync, { passive: true }); window.addEventListener('resize', sync); sync();
  });
})();
