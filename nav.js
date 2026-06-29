// Mobile nav toggle. The hamburger (.nav-burger) shows under 640px and
// reveals the stacked .nav-links menu. No-ops on pages without a nav.
(function () {
  var burger = document.querySelector('.nav-burger');
  var links = document.getElementById('navLinks');
  if (!burger || !links) return;

  function setOpen(open) {
    burger.setAttribute('aria-expanded', String(open));
    links.classList.toggle('is-open', open);
    var label = burger.querySelector('.nav-burger-label');
    if (label) label.textContent = open ? 'Close' : 'Menu';
  }

  burger.addEventListener('click', function () {
    setOpen(burger.getAttribute('aria-expanded') !== 'true');
  });

  // Close after tapping a link, or on Escape.
  links.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
})();
