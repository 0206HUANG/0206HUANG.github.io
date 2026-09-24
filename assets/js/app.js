/* HUANG BOSHENG — Portfolio interactions (vanilla JS, no dependencies) */
(function () {
  'use strict';

  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function store(key, val) {
    try {
      if (val === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, val);
    } catch (e) { return null; }
  }

  /* ---------------- Typing roles ---------------- */

  var roles = ['Full-Stack Developer', 'Flutter Developer', 'AI Application Builder', 'Software Engineering @ UTM'];

  /* ---------------- Theme ---------------- */

  $('#themeToggle').addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    store('theme', next);
    $('meta[name="theme-color"]').setAttribute('content', next === 'light' ? '#f7f8fb' : '#07090f');
    refreshGithubCards();
  });

  /* ---------------- Typing effect ---------------- */

  var typedEl = $('#typed'), typeTimer = null;

  function restartTyping() {
    clearTimeout(typeTimer);
    var list = roles;
    if (reduceMotion) { typedEl.textContent = list[0]; return; }
    var i = 0, pos = 0, deleting = false;
    (function tick() {
      var word = list[i];
      pos += deleting ? -1 : 1;
      typedEl.textContent = word.slice(0, pos);
      var delay = deleting ? 38 : 80;
      if (!deleting && pos === word.length) { deleting = true; delay = 1800; }
      else if (deleting && pos === 0) { deleting = false; i = (i + 1) % list.length; delay = 350; }
      typeTimer = setTimeout(tick, delay);
    })();
  }

  /* ---------------- Mobile menu ---------------- */

  var menuBtn = $('#menuToggle'), links = $('#navLinks');
  menuBtn.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });
  $$('a', links).forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });

  /* ---------------- Scroll: nav, progress, back-to-top ---------------- */

  var nav = $('#nav'), progress = $('.scroll-progress'), toTop = $('#toTop'), ticking = false;
  function onScroll() {
    var y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
    nav.classList.toggle('scrolled', y > 20);
    progress.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    toTop.classList.toggle('show', y > 700);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });

  /* ---------------- Active section highlight ---------------- */

  var navMap = {};
  $$('a', links).forEach(function (a) { navMap[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        $$('a', links).forEach(function (a) { a.classList.remove('active'); });
        var id = e.target.id === 'coursework' || e.target.id === 'github' ? 'journey' : e.target.id;
        if (navMap[id]) navMap[id].classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id], main header[id]').forEach(function (s) { spy.observe(s); });
  }

  /* ---------------- Reveal on scroll ---------------- */

  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------------- Counters ---------------- */

  function countUp(el) {
    var target = +el.getAttribute('data-count'), start = null, dur = 1400;
    if (reduceMotion) { el.textContent = target; return; }
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } });
    });
    $$('[data-count]').forEach(function (el) { cio.observe(el); });
  } else {
    $$('[data-count]').forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  }

  /* ---------------- Project filter ---------------- */

  var projects = $$('.project'), filters = $$('.filter');

  function updateFilterCounts() {
    filters.forEach(function (f) {
      var key = f.getAttribute('data-filter');
      var n = key === 'all' ? projects.length : projects.filter(function (p) {
        return p.getAttribute('data-cat').split(' ').indexOf(key) > -1;
      }).length;
      var c = f.querySelector('.count');
      if (!c) { c = document.createElement('span'); c.className = 'count'; f.appendChild(c); }
      c.textContent = n;
    });
  }

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-filter');
      filters.forEach(function (f) { f.classList.toggle('active', f === btn); });
      projects.forEach(function (p) {
        var show = key === 'all' || p.getAttribute('data-cat').split(' ').indexOf(key) > -1;
        p.classList.toggle('hide', !show);
        p.classList.remove('pop');
        if (show) { p.classList.add('in'); void p.offsetWidth; p.classList.add('pop'); }
      });
    });
  });


  /* ---------------- Card spotlight + cursor glow ---------------- */

  var glow = $('.cursor-glow');
  if (window.matchMedia && matchMedia('(pointer: fine)').matches && !reduceMotion) {
    document.addEventListener('pointermove', function (e) {
      glow.style.opacity = 1;
      glow.style.transform = 'translate(' + (e.clientX - 240) + 'px,' + (e.clientY - 240) + 'px)';
    }, { passive: true });
    $$('.card').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------------- Marquee duplication ---------------- */

  var track = $('.marquee-track');
  if (track) track.innerHTML += track.innerHTML;

  /* ---------------- Copy email ---------------- */

  var toast = $('#toast'), toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }
  $$('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () { showToast('Email copied to clipboard ✓'); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { location.href = 'mailto:' + text; });
      } else {
        location.href = 'mailto:' + text;
      }
    });
  });

  /* ---------------- GitHub stat cards follow the theme ---------------- */

  function refreshGithubCards() {
    var dark = root.getAttribute('data-theme') !== 'light';
    var theme = dark
      ? '&title_color=22d3ee&text_color=c9d4e3&icon_color=818cf8&ring=22d3ee&fire=f472b6&currStreakNum=e6edf6&sideNums=e6edf6&currStreakLabel=22d3ee&sideLabels=9aa6b8&dates=647084&stroke=334155'
      : '&title_color=0891b2&text_color=334155&icon_color=6366f1&ring=0891b2&fire=db2777&currStreakNum=0f172a&sideNums=0f172a&currStreakLabel=0891b2&sideLabels=475569&dates=7b8799&stroke=cbd5e1';
    $$('.gh-img').forEach(function (img) {
      img.src = img.getAttribute('data-src') + theme;
      img.onerror = function () {
        img.closest('.gh-card').style.display = 'none';
        // Hide the whole section if every stats service is unreachable
        if (!$$('.gh-card').some(function (c) { return c.style.display !== 'none'; })) $('#github').style.display = 'none';
      };
    });
  }
  refreshGithubCards();

  /* ---------------- Init ---------------- */

  $('#year').textContent = new Date().getFullYear();
  updateFilterCounts();
  restartTyping();
})();
