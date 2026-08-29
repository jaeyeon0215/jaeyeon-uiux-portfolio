function rescale() {
  document.querySelectorAll('.slide').forEach(function (slide) {
    if (!slide.querySelector('.canvas')) return; // responsive slides size themselves
    var s = slide.clientWidth / 1920;
    slide.style.setProperty('--s', s);
    slide.style.height = Math.round(1080 * s) + 'px';
  });
}

window.addEventListener('resize', rescale);
window.addEventListener('load', rescale);
document.addEventListener('DOMContentLoaded', rescale);

// visible slides only (a slide inside a hidden .project-detail group, or a
// hidden main-page slide, has no layout)
function getVisibleSlides() {
  return Array.prototype.filter.call(document.querySelectorAll('.slide'), function (slide) {
    if (slide.hidden) return false;
    var group = slide.closest('.project-detail');
    return !group || !group.hidden;
  });
}

// progress bar + active nav dot
function onScroll() {
  var doc = document.documentElement;
  var scrollTop = window.scrollY || doc.scrollTop;
  var height = doc.scrollHeight - doc.clientHeight;
  var pct = height > 0 ? (scrollTop / height) * 100 : 0;
  var fill = document.getElementById('topbar-fill');
  if (fill) fill.style.width = pct + '%';

  var slides = getVisibleSlides();
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

// --- landing page vs. project detail routing ---
// The card grid on slide 1 links straight to a project's slides (e.g. #slide-3),
// but those slides live inside a hidden .project-detail wrapper by default so
// they never show up while scrolling the main page — only on click.
var SLIDE_TO_GROUP = {};
var GROUP_SLIDES = {
  'detail-recloset': ['slide-3', 'slide-4', 'slide-5', 'slide-6', 'slide-7', 'slide-8', 'slide-9'],
  'detail-campulse': ['slide-10', 'slide-11', 'slide-12', 'slide-13', 'slide-14', 'slide-15', 'slide-16'],
  'detail-spilltea': ['slide-17', 'slide-18', 'slide-19', 'slide-20', 'slide-21', 'slide-22', 'slide-23'],
  'detail-spotify': ['spotify-1', 'spotify-2', 'spotify-3', 'spotify-4', 'spotify-5']
};
Object.keys(GROUP_SLIDES).forEach(function (groupId) {
  GROUP_SLIDES[groupId].forEach(function (slideId) { SLIDE_TO_GROUP[slideId] = groupId; });
});
var MAIN_SLIDE_IDS = ['slide-1', 'slide-2', 'project-cards', 'slide-philosophy', 'slide-25'];
// slide-1/slide-2/project-cards/slide-philosophy are the landing page proper;
// slide-25 (contact) stays visible as a closing section under every project too.
var MAIN_PAGE_ONLY_IDS = ['slide-1', 'slide-2', 'project-cards', 'slide-philosophy'];

function buildNavDots(slideIds) {
  var nav = document.getElementById('navdots');
  if (!nav) return;
  nav.innerHTML = slideIds.map(function (id) { return '<a href="#' + id + '"></a>'; }).join('');
}

function showMainPage() {
  document.querySelectorAll('.project-detail').forEach(function (group) { group.hidden = true; });
  MAIN_PAGE_ONLY_IDS.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.hidden = false;
  });
  buildNavDots(MAIN_SLIDE_IDS);
}

function showProjectDetail(groupId) {
  document.querySelectorAll('.project-detail').forEach(function (group) {
    group.hidden = (group.id !== groupId);
  });
  MAIN_PAGE_ONLY_IDS.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.hidden = true;
  });
  buildNavDots(GROUP_SLIDES[groupId].concat(['slide-25']));
}

function handleHashNav() {
  var targetId = location.hash.replace('#', '');
  var groupId = SLIDE_TO_GROUP[targetId];
  if (groupId) {
    showProjectDetail(groupId);
  } else {
    showMainPage();
  }
  rescale();
  requestAnimationFrame(function () {
    var target = targetId && document.getElementById(targetId);
    if (target) target.scrollIntoView();
    onScroll();
  });
}

window.addEventListener('hashchange', handleHashNav);
document.addEventListener('DOMContentLoaded', handleHashNav);

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
