/* 홈 움직임 (10/8 대표 "스크롤 · 애니메이션이 없어 밋밋하다" → docs/07 3-6): 점포 영상 짧은 루프 2곳 + 사진 자리 잡기(화면에 들어올 때 1.04 → 1, 한 번)
   글자 · 구역이 떠오르는 등장 효과는 넣지 않는다. 동작 줄이기 설정이면 아무것도 하지 않는다(영상은 포스터, 사진은 제자리) · 스크립트가 없어도 내용은 다 보인다 */
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('js-motion');
  var settle = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); settle.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.h-settle').forEach(function (el) { settle.observe(el); });
  // 영상: 화면에 1/4 넘게 보일 때만 재생, 벗어나면 멈춤 (배터리 · 데이터)
  var loops = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else { v.pause(); }
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('video[data-loop]').forEach(function (v) { v.muted = true; loops.observe(v); });
})();
