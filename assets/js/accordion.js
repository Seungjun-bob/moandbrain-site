/* 아코디언: <details> 기반. [data-accordion-group] 안에서는 하나만 열림 */
(function () {
  document.querySelectorAll('[data-accordion-group]').forEach(function (group) {
    group.querySelectorAll('details').forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        group.querySelectorAll('details').forEach(function (o) { if (o !== d && o.open) o.open = false; });
      });
    });
  });
})();
