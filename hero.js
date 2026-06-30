/* Hero problem rotator — cycles concrete problems under a fixed headline.
   The H1 claim never changes; only this line swaps, so the page reads the
   same on every visit while still feeling alive. Honors reduced-motion by
   leaving the first problem static. */
(function () {
  var el = document.querySelector('[data-hero-problem]');
  if (!el) return;

  var problems = [
    'your coffee’s cold again — and not the iced kind',
    'yet another login you’ll never use',
    'the platform the district bought that nobody opens',
    'the grading stack that never shrinks',
    'lunch eaten standing up in nine minutes',
    'the PD day that wastes everyone’s time',
    'running the room on four hours of sleep'
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
