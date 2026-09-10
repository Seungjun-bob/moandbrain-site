/* 메가메뉴: 데스크톱 hover(열기 150ms · 닫기 250ms) + focus · Escape / 모바일 하위 메뉴 토글 */
(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll('.nav-item[data-menu]'));
  if (!items.length) return;
  var desktop = window.matchMedia('(min-width: 1200px)'); var timers = new WeakMap();
  function setBtn(li, on) { var b = li.querySelector('.submenu-toggle-btn'); if (b) b.setAttribute('aria-expanded', on ? 'true' : 'false'); }
  function open(li) { items.forEach(function (o) { if (o !== li) close(o, true); }); li.classList.add('is-open'); setBtn(li, true); document.body.classList.add('menu-open'); }
  function close(li, keep) { li.classList.remove('is-open'); setBtn(li, false); if (!keep && !document.querySelector('.nav-item.is-open') && !document.body.classList.contains('nav-mobile-open')) document.body.classList.remove('menu-open'); }
  function clearT(li) { var t = timers.get(li); if (t) { clearTimeout(t); timers.delete(li); } }
  items.forEach(function (li) {
    if (!li.querySelector('.dropdown-menu')) return;
    li.addEventListener('mouseenter', function () { if (!desktop.matches) return; clearT(li); timers.set(li, setTimeout(function () { open(li); }, 150)); });
    li.addEventListener('mouseleave', function () { if (!desktop.matches) return; clearT(li); timers.set(li, setTimeout(function () { close(li); }, 250)); });
    li.addEventListener('focusin', function () { if (desktop.matches) { clearT(li); open(li); } });
    li.addEventListener('focusout', function (e) { if (desktop.matches && !li.contains(e.relatedTarget)) close(li); });
    var btn = li.querySelector('.submenu-toggle-btn');
    if (btn) btn.addEventListener('click', function () { if (li.classList.contains('is-open')) close(li, true); else open(li); if (!desktop.matches) document.body.classList.add('menu-open'); });
    var link = li.querySelector('.nav-link');
    if (link) link.addEventListener('click', function (e) { if (!desktop.matches && !li.classList.contains('is-open')) { e.preventDefault(); open(li); } });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { items.forEach(function (li) { close(li); }); document.body.classList.remove('menu-open'); } });
  document.addEventListener('click', function (e) { if (desktop.matches && !e.target.closest('.main-menu')) items.forEach(function (li) { close(li); }); });
})();
