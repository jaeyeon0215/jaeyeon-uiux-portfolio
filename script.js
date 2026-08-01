function rescale() {
  document.querySelectorAll('.slide').forEach(function (slide) {
    var s = slide.clientWidth / 1920;
    slide.style.setProperty('--s', s);
    slide.style.height = Math.round(1080 * s) + 'px';
  });
}

window.addEventListener('resize', rescale);
window.addEventListener('load', rescale);
document.addEventListener('DOMContentLoaded', rescale);

// progress bar + active nav dot
function onScroll() {
  var doc = document.documentElement;
  var scrollTop = window.scrollY || doc.scrollTop;
  var height = doc.scrollHeight - doc.clientHeight;
  var pct = height > 0 ? (scrollTop / height) * 100 : 0;
  var fill = document.getElementById('topbar-fill');
  if (fill) fill.style.width = pct + '%';

  var slides = document.querySelectorAll('.slide');
  var dots = document.querySelectorAll('#navdots a');
  var mid = scrollTop + window.innerHeight / 2;
  slides.forEach(function (slide, i) {
    var top = slide.offsetTop, bottom = top + slide.offsetHeight;
    if (mid >= top && mid < bottom && dots[i]) {
      dots.forEach(function (d) { d.classList.remove('active'); });
      dots[i].classList.add('active');
    }
  });
}
window.addEventListener('scroll', onScroll);
window.addEventListener('load', onScroll);

setTimeout(rescale, 300); // after webfonts settle

// dropdown nav (click-to-toggle, works alongside CSS :hover on desktop)
document.querySelectorAll('.dropdown-toggle').forEach(function (toggle) {
  toggle.addEventListener('click', function (e) {
    e.preventDefault();
    var dropdown = toggle.closest('.dropdown');
    var wasOpen = dropdown.classList.contains('open');
    document.querySelectorAll('.dropdown.open').forEach(function (d) { d.classList.remove('open'); });
    if (!wasOpen) dropdown.classList.add('open');
  });
});
document.addEventListener('click', function (e) {
  if (!e.target.closest('.dropdown')) {
    document.querySelectorAll('.dropdown.open').forEach(function (d) { d.classList.remove('open'); });
  }
});
document.querySelectorAll('.dropdown-menu a').forEach(function (link) {
  link.addEventListener('click', function () {
    document.querySelectorAll('.dropdown.open').forEach(function (d) { d.classList.remove('open'); });
  });
});
