/* 헤더 동작: 띠배너 회전·닫기 · 스크롤 그림자 · 모바일 드로어(헤더 바로 아래에 붙임) · 현재 페이지 표시 · 모바일 아래 고정 바 (푸터 접이식은 accordion.js) */
(function () {
  var html = document.documentElement;

  // ── 띠배너: 메시지 회전(5초) · 좌우 화살표 · hover/focus 시 정지 · 닫기(세션 동안 유지)
  try { if (sessionStorage.getItem('mb-banner') === 'closed') html.dataset.banner = 'closed'; } catch (e) {}
  var banner = document.querySelector('[data-header-banner]');
  if (banner) {
    var msgs = Array.prototype.slice.call(banner.querySelectorAll('.header-banner__msg'));
    var cur = Math.max(0, msgs.findIndex(function (m) { return m.classList.contains('is-active'); }));
    var timer = null;
    function show(i) {
      cur = (i + msgs.length) % msgs.length;
      msgs.forEach(function (m, k) { m.classList.toggle('is-active', k === cur); });
      banner.dataset.index = String(cur);
    }
    function start() { stop(); if (msgs.length > 1) timer = setInterval(function () { show(cur + 1); }, 5000); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    var prev = banner.querySelector('[data-banner-prev]'), next = banner.querySelector('[data-banner-next]');
    if (prev) prev.addEventListener('click', function () { show(cur - 1); start(); });
    if (next) next.addEventListener('click', function () { show(cur + 1); start(); });
    banner.addEventListener('mouseenter', stop); banner.addEventListener('mouseleave', start);
    banner.addEventListener('focusin', stop); banner.addEventListener('focusout', start);
    var close = banner.querySelector('.header-banner__close');
    if (close) close.addEventListener('click', function () {
      html.dataset.banner = 'closed'; stop();
      try { sessionStorage.setItem('mb-banner', 'closed'); } catch (e) {}
      syncDrawerTop();
    });
    show(cur); start();
  }

  // ── 스크롤 그림자
  var header = document.getElementById('site-header');
  function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // ── 모바일 드로어: 배너가 스크롤로 사라지거나 닫혀도 항상 헤더 바로 아래에 붙도록 top 을 실측한다
  var toggler = document.querySelector('.navbar-toggler');
  var backdrop = document.querySelector('[data-menu-backdrop]');
  function syncDrawerTop() {
    if (!header) return;
    var b = Math.max(0, Math.round(header.getBoundingClientRect().bottom));
    html.style.setProperty('--drawer-top', b + 'px');
  }
  function setDrawer(open) {
    if (open) syncDrawerTop();
    document.body.classList.toggle('nav-mobile-open', open);
    if (toggler) { toggler.setAttribute('aria-expanded', open ? 'true' : 'false'); toggler.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기'); }
    if (backdrop) backdrop.classList.toggle('is-drawer', open);
    if (open) { document.body.classList.add('menu-open'); } else { document.querySelectorAll('.nav-item.is-open').forEach(function (li) { li.classList.remove('is-open'); var b = li.querySelector('.submenu-toggle-btn'); if (b) b.setAttribute('aria-expanded', 'false'); }); document.body.classList.remove('menu-open'); }
  }
  if (toggler) toggler.addEventListener('click', function () { setDrawer(!document.body.classList.contains('nav-mobile-open')); });
  if (backdrop) backdrop.addEventListener('click', function () { setDrawer(false); document.querySelectorAll('.nav-item.is-open').forEach(function (li) { li.classList.remove('is-open'); }); document.body.classList.remove('menu-open'); });
  window.addEventListener('resize', function () { if (window.innerWidth >= 1200) setDrawer(false); else if (document.body.classList.contains('nav-mobile-open')) syncDrawerTop(); });
  window.addEventListener('scroll', function () { if (document.body.classList.contains('nav-mobile-open')) syncDrawerTop(); }, { passive: true });
  syncDrawerTop();

  // ── 예약 CTA 바(sticky)가 화면 아래에 붙어 있는 동안만 body.cta-stuck (카카오 플로팅을 위로)
  var ctaBar = document.querySelector('[data-cta-bar]');
  function syncCta() { if (!ctaBar) return; var r = ctaBar.getBoundingClientRect(); var stuck = getComputedStyle(ctaBar).display !== 'none' && Math.round(r.bottom) >= window.innerHeight - 1; document.body.classList.toggle('cta-stuck', stuck); }
  if (ctaBar) { window.addEventListener('scroll', syncCta, { passive: true }); window.addEventListener('resize', syncCta); syncCta(); }

  // ── 모바일 아래 고정 바: 메인에서는 첫 화면(영상 · 네이버 예약 버튼)이 절반 넘게 보이는 동안 숨는다 → 지나면 나타난다 (09-site.css body.mbar-wait · 10/8)
  var hero = document.querySelector('.h-hero');
  if (hero && document.querySelector('.m-bar') && 'IntersectionObserver' in window) {
    document.body.classList.add('mbar-wait');
    new IntersectionObserver(function (es) { document.body.classList.toggle('mbar-wait', es[0].intersectionRatio >= 0.5); }, { threshold: [0.5] }).observe(hero);
  }

  // ── 현재 페이지 표시
  var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-link').forEach(function (a) {
    var href = (a.getAttribute('href') || '').split('#')[0].toLowerCase();
    if (href && href === here) a.setAttribute('aria-current', 'page');
  });
})();
