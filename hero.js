/* Hero problem rotator — cycles concrete problems under a fixed headline.
   The H1 claim never changes; only this line swaps, so the page reads the
   same on every visit while still feeling alive. Honors reduced-motion by
   leaving the first problem static. */
(function () {
  var el = document.querySelector('[data-hero-problem]');
  if (!el) return;

  var problems = [
    'the PD day that wastes everyone’s time',
    'the binder no one opens',
    'the tool that doesn’t fit Tuesday',
    'feeling alone in the work',
    'theory that never survives a real classroom'
  ];

  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return; // first problem stays put

  var i = 0;
  var HOLD = 3000;   // time each problem is fully shown
  var FADE = 360;    // fade duration (matches CSS transition)

  setInterval(function () {
    el.classList.add('is-swapping');
    setTimeout(function () {
      i = (i + 1) % problems.length;
      el.textContent = problems[i];
      el.classList.remove('is-swapping');
    }, FADE);
  }, HOLD);
})();
