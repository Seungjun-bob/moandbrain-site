/* 접이식: <details> 기반. [data-accordion-group] 안에서는 하나만 열림.
   열고 닫을 때 본문 높이가 움직인다(0.3초) — 동작 줄이기 설정이면 바로 바뀐다. 스크립트가 없으면 <details> 그대로 동작한다.
   모바일 푸터의 사이트맵 접이식도 같은 방식으로 움직인다. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var OPT = { duration: 300, easing: 'cubic-bezier(.4, 0, .2, 1)' };

  // el 의 높이를 0 ↔ 제 높이로 움직인다. 끝나면 done()
  function slide(el, open, done) {
    var cs = getComputedStyle(el), now = null;
    if (el._slide) {   // 움직이는 도중에 다시 누르면 지금 높이에서 이어 간다
      now = { height: cs.height, paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom, opacity: cs.opacity };
      el._slide.onfinish = null; el._slide.cancel(); el._slide = null;
    }
    if (reduce.matches || !el.animate) { el.style.overflow = ''; if (done) done(); return; }
    var full = { height: el.offsetHeight + 'px', paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom, opacity: 1 };
    var none = { height: '0px', paddingTop: '0px', paddingBottom: '0px', opacity: 0 };
    el.style.overflow = 'hidden';
    var a = el.animate(open ? [now || none, full] : [now || full, none], OPT);
    el._slide = a;
    a.onfinish = function () { el._slide = null; el.style.overflow = ''; if (done) done(); };
  }

  // ── <details>: 요약 줄 아래를 한 덩이로 감싸 그 덩이의 높이를 움직인다
  function panel(d) {
    var p = d.querySelector(':scope > .h-acc__panel');
    if (p) return p;
    p = document.createElement('div'); p.className = 'h-acc__panel';
    Array.prototype.slice.call(d.children).forEach(function (c) { if (c.tagName !== 'SUMMARY') p.appendChild(c); });
    d.appendChild(p); return p;
  }
  function open(d) {
    d.classList.remove('is-closing'); d.open = true;
    slide(panel(d), true);
  }
  function close(d) {
    if (!d.open || d.classList.contains('is-closing')) return;
    d.classList.add('is-closing');   // 아이콘은 닫히기 시작할 때 + 로 돌아온다 (11-home.css)
    slide(panel(d), false, function () { d.open = false; d.classList.remove('is-closing'); });
  }
  document.querySelectorAll('details.h-acc__item').forEach(function (d) {
    var group = d.closest('[data-accordion-group]');
    var summary = d.querySelector('summary');
    if (!summary) return;
    summary.addEventListener('click', function (e) {
      e.preventDefault();
      if (d.open && !d.classList.contains('is-closing')) { close(d); return; }
      if (group) group.querySelectorAll('details').forEach(function (o) { if (o !== d) close(o); });
      open(d);
    });
    // 누르지 않고 열린 경우(페이지 안 찾기 등)에도 묶음에서는 하나만 열어 둔다
    d.addEventListener('toggle', function () {
      if (!d.open || !group) return;
      group.querySelectorAll('details').forEach(function (o) { if (o !== d) close(o); });
    });
  });

  // ── 푸터 사이트맵 (모바일에서만 접이식 — 04-footer.css)
  document.querySelectorAll('.footer-item .title button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.footer-item'), list = item.querySelector('.menu-footer');
      var on = !item.classList.contains('is-open') || item.classList.contains('is-closing');
      btn.setAttribute('aria-expanded', on ? 'true' : 'false');
      if (on) { item.classList.remove('is-closing'); item.classList.add('is-open'); if (list) slide(list, true); }
      else if (list) { item.classList.add('is-closing'); slide(list, false, function () { item.classList.remove('is-open', 'is-closing'); }); }
      else item.classList.remove('is-open');
    });
  });
})();
