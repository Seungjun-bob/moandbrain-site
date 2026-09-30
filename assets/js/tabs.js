/* 절 탭 (하위 페이지 · 12-sub.css .s-tabs): 한 번에 한 절만 보인다.
   - 절 주소(#id)로 들어오면 그 절이 있는 탭을 연다 (메인 · 표에서 오는 링크가 절 id 를 가리킨다)
   - 스크립트가 꺼져 있으면 절이 모두 펼쳐져 보인다 (숨김은 여기서만 건다)
   - 검수 모드가 아니면 내용이 없는 절의 탭은 CSS 가 감춘다 → 보이는 첫 탭부터 연다
   - 탭을 누르면 밑줄이 그 탭으로 옮겨 가고 내용이 옅게 올라온다 (처음 열릴 때는 움직이지 않는다) */
(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-tab]'));
  if (!tabs.length) return;
  var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('href').slice(1)); });
  var row = tabs[0].closest('.s-tabs'), cur = 0;
  if (row) row.classList.add('is-js');   // 밑줄을 줄 하나로 바꾼다 (12-sub.css)
  function shown(t) { return getComputedStyle(t).display !== 'none'; }
  function line() {   // 밑줄 하나를 지금 탭 아래로
    if (!row) return;
    row.style.setProperty('--tab-x', tabs[cur].offsetLeft + 'px');
    row.style.setProperty('--tab-w', tabs[cur].offsetWidth + 'px');
  }
  function show(i, moved) {
    cur = i;
    tabs.forEach(function (t, k) {
      if (k === i) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
      if (panels[k]) { panels[k].hidden = k !== i; panels[k].classList.remove('is-entering'); }
    });
    line();
    if (moved && panels[i]) { void panels[i].offsetWidth; panels[i].classList.add('is-entering'); }
  }
  function fromHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (!id) return -1;
    var el = document.getElementById(id);
    if (!el) return -1;
    for (var k = 0; k < panels.length; k++) if (panels[k] && (panels[k] === el || panels[k].contains(el))) return shown(tabs[k]) ? k : -1;
    return -1;
  }
  var byHash = fromHash();
  var start = byHash >= 0 ? byHash : Math.max(0, tabs.findIndex(shown));
  show(start);
  if (row) {
    requestAnimationFrame(function () { requestAnimationFrame(function () { row.classList.add('is-ready'); }); });   // 첫 자리는 움직임 없이 잡는다
    window.addEventListener('resize', line);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(line);   // 글꼴이 바뀌면 글자 폭이 달라진다
  }
  panels.forEach(function (p) { if (p) p.addEventListener('animationend', function () { p.classList.remove('is-entering'); }); });
  if (byHash >= 0) window.addEventListener('load', function () { window.scrollTo(0, 0); });   // 탭 줄이 보이게 페이지 처음에서 시작
  tabs.forEach(function (t, k) {
    t.addEventListener('click', function (e) {
      e.preventDefault(); show(k, k !== cur);
      try { history.replaceState(null, '', '#' + panels[k].id); } catch (err) {}
      var head = document.querySelector('.s-head');
      if (head && head.getBoundingClientRect().top < 0) head.scrollIntoView();
    });
  });
  window.addEventListener('hashchange', function () { var k = fromHash(); if (k >= 0) show(k, k !== cur); });
})();
