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

  /* ---------------- i18n ---------------- */

  var zh = {
    'nav.about': '关于', 'nav.stack': '技术栈', 'nav.projects': '项目', 'nav.journey': '经历', 'nav.contact': '联系',
    'hero.status': '正在寻找实习与合作机会',
    'hero.hi': '你好，我是',
    'hero.desc': '<strong>马来西亚理工大学（UTM）</strong>软件工程专业学生。我用 <strong>Flutter</strong> 开发跨平台应用，用 <strong>Next.js 与 TypeScript</strong> 构建现代 Web 产品，用 <strong>Python 与 FastAPI</strong> 打造 AI 驱动的后端——从想法一路到上线。',
    'hero.cta1': '查看项目', 'hero.cta3': '联系我',
    'hero.s1': '公开仓库', 'hero.s2': '语言与框架', 'hero.s3': '个 Flutter 应用',
    'about.eyebrow': '01 · 关于我',
    'about.title': '把想法变成真正有人用的软件。',
    'about.p1': '我是 <strong>HUANG BOSHENG</strong>，来自中国珠海，在 UTM 攻读计算机科学（<strong>软件工程</strong>方向）。我从 C++ 和数据结构起步，逐渐走向完整产品的开发。',
    'about.p2': '现在我的工作覆盖全栈：移动端用 <strong>Flutter + Firebase</strong>，Web 端用 <strong>Next.js / React + TypeScript</strong>，智能后端用 <strong>Python / FastAPI</strong> 搭配 PostgreSQL、Redis 与大模型 API。我也探索过 <strong>鸿蒙 HarmonyOS（ArkTS）</strong>原生开发。',
    'about.p3': '我享受整个过程——分析需求、设计系统、编写整洁的代码，再用 Docker 和云服务把它交付上线。写软件对我来说不只是任务，更是真正的乐趣。',
    'about.f1t': '教育', 'about.f1d': 'UTM 计算机科学学士（软件工程）',
    'about.f2t': '所在地', 'about.f2d': '马来西亚新山 · 来自中国珠海',
    'about.f3t': '方向', 'about.f3d': '全栈 Web、跨平台移动端、AI 应用',
    'about.f4t': '语言', 'about.f4d': '中文（母语）· 英语（CET-4）',
    'stack.eyebrow': '02 · 技术栈', 'stack.title': '我用来构建产品的工具。', 'stack.desc': '全部来自我 GitHub 上的真实项目，而不只是一堆流行词。',
    'stack.mobile': '移动端', 'stack.mobileD': '跨平台与原生',
    'stack.frontend': '前端', 'stack.frontendD': '现代 Web 界面',
    'stack.backend': '后端', 'stack.backendD': 'API、队列与服务',
    'stack.ai': 'AI 与大模型工程', 'stack.aiD': '让模型在真实产品中发挥作用',
    'stack.pipe': '提示词流水线', 'stack.rules': '规则推理引擎',
    'stack.data': '数据', 'stack.dataD': 'SQL、NoSQL 与缓存',
    'stack.devops': 'DevOps 与云', 'stack.devopsD': '部署并稳定运行',
    'stack.cs': '基础与工具', 'stack.csD': '一切的起点',
    'stack.dsa': '数据结构与算法', 'stack.sad': '系统分析与设计',
    'proj.eyebrow': '03 · 精选作品', 'proj.title': '我做过的项目。', 'proj.desc': '从 AI SaaS 平台到 Flutter 应用和小游戏——按兴趣筛选。',
    'proj.all': '全部', 'proj.ai': 'AI', 'proj.web': 'Web', 'proj.mobile': '移动端',
    'p.code': '源码', 'p.team': '团队项目', 'p.collection': '合集',
    'p1.t': '企业邮箱 AI 托管系统',
    'p1.d': 'AI 驱动的 SaaS：自动对企业邮件进行分类、检索知识库、生成回复，并按可配置规则进行路由。',
    'p1.h1': 'IMAP → ARQ 队列 → 处理流水线 → SMTP，全异步架构',
    'p1.h2': '基于 PostgreSQL 16 + pgvector 的 RAG 知识检索',
    'p1.h3': '敏感词防护：高风险邮件自动转入人工队列',
    'p1.h4': 'Docker Compose + Caddy 一键部署',
    'p2.t': 'AI 电商设计 Agent',
    'p2.d': '为电商卖家生成商品宣传图的 AI Agent MVP，基于场景路由工作流和设计规则库。',
    'p3.t': '任务管理系统',
    'p3.d': '支持分类、优先级、筛选与统计看板的全栈任务管理应用。我负责“创建任务”功能，并在前端表单与 API 层双重校验。',
    'p4.t': 'SmartWeather 智能天气预警',
    'p4.d': '传感器数据经由规则推理引擎识别洪水、风暴、热浪等风险，并展示可追溯的决策路径。',
    'p5.t': 'iBites · 健康食谱社区',
    'p5.d': '浏览、收藏与分享健康食谱的社区应用，并提供管理员审核与数据分析后台。',
    'p6.t': 'WaterDo 番茄钟待办',
    'p6.d': '轻量级番茄钟与待办应用，支持 Web、移动端与桌面端，气泡式任务面板、Google 登录与 Lottie 动画。',
    'p7.t': '韩语键盘',
    'p7.d': '鸿蒙原生韩语学习与输入应用，支持手写识别、离线/在线词典与引导教程。',
    'p8.t': '宝可梦点击进化',
    'p8.d': '一款点击小游戏：移动目标、连击倍率、动态天气、道具系统、传说宝可梦与粒子特效。',
    'p9.t': '宿舍管理系统',
    'p9.d': '学生注册、预订房间与管理个人资料的 Web 系统，附带管理员后台与访问日志。',
    'p10.t': 'Flutter 应用实验室',
    'p10.d': '一系列探索不同主题的 Flutter 应用：实时聊天、Gemini AI 聊天机器人、仿携程旅行界面、购物车与 Firebase 集成。',
    'p11.t': '课程作业与基础',
    'p11.d': 'C++ 编程技术、数据结构与算法、离散结构与系统分析——夯实基础的那些作业。',
    'jr.eyebrow': '04 · 经历', 'jr.title': '我的成长路线。',
    'jr.1t': 'AI 应用与全栈工程', 'jr.1d': '使用 FastAPI、pgvector 与 Next.js 构建大模型驱动的 SaaS 产品，并转向基于 Cloudflare 的现代 TypeScript 工具链。',
    'jr.2t': '移动开发', 'jr.2d': '基于 Firebase 开发了 8 个以上 Flutter 应用，并探索了 ArkTS 鸿蒙原生开发。',
    'jr.3t': 'Web 编程', 'jr.3d': '用 PHP 与 MySQL 完成第一个完整 Web 系统，之后是网络编程与数据结构项目。',
    'jr.4t': '马来西亚理工大学（UTM）', 'jr.4d': '计算机科学学士（软件工程）。修读编程技术、离散结构、系统分析与设计等课程。',
    'jr.5d': '预科课程 · GPA 3.5 · 高级学术英语测试：6 分。',
    'jr.6date': '高中', 'jr.6t': '珠海市第一中学', 'jr.6d': '理科 · 图书馆副馆长 · 红十字会成员 · 数学奖项。',
    'cw.eyebrow': '05 · 课程', 'cw.title': '大一 · 第二学期',
    'c1.t': '技术与信息系统', 'c1.d': '分析、构建与管理信息系统——技术、人和流程的结合。',
    'c2.t': '编程技术 II', 'c2.d': '进阶 C++：面向对象设计、问题求解与高效编程。',
    'c3.t': '离散结构', 'c3.d': '算法、数据结构与软件背后的数学基础。',
    'c4.t': '系统分析与设计', 'c4.d': '理解用户与业务需求，设计高效满足需求的系统。',
    'c.more': '查看作业',
    'gh.eyebrow': '06 · 开源', 'gh.title': 'GitHub 动态。',
    'ct.eyebrow': '07 · 联系', 'ct.title': '一起打造<span class="grad-text">出色</span>的作品吧。',
    'ct.desc': '无论是实习、外包项目，还是聊聊 Flutter 与 AI——我的邮箱随时欢迎你。',
    'ct.btn': '打个招呼', 'ct.phone': '电话',
    'ft.made': '在新山用心设计与构建。'
  };

  var roles = {
    en: ['Full-Stack Developer', 'Flutter Developer', 'AI Application Builder', 'Software Engineering @ UTM'],
    zh: ['全栈开发者', 'Flutter 开发者', 'AI 应用构建者', 'UTM 软件工程学生']
  };

  var en = {};
  $$('[data-i18n]').forEach(function (el) { en[el.getAttribute('data-i18n')] = el.textContent; });
  $$('[data-i18n-html]').forEach(function (el) { en[el.getAttribute('data-i18n-html')] = el.innerHTML; });

  var lang = store('lang') || ((navigator.language || '').toLowerCase().indexOf('zh') === 0 ? 'zh' : 'en');
  var langBtn = $('#langToggle');

  function applyLang(l) {
    var dict = l === 'zh' ? zh : en;
    $$('[data-i18n]').forEach(function (el) {
      var v = dict[el.getAttribute('data-i18n')];
      if (v != null) el.textContent = v;
    });
    $$('[data-i18n-html]').forEach(function (el) {
      var v = dict[el.getAttribute('data-i18n-html')];
      if (v != null) el.innerHTML = v;
    });
    root.setAttribute('lang', l === 'zh' ? 'zh-CN' : 'en');
    langBtn.textContent = l === 'zh' ? 'EN' : '中';
    lang = l;
    updateFilterCounts();
    restartTyping();
  }

  langBtn.addEventListener('click', function () {
    var next = lang === 'zh' ? 'en' : 'zh';
    store('lang', next);
    applyLang(next);
  });

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
    var list = roles[lang] || roles.en;
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
      var done = function () { showToast(lang === 'zh' ? '邮箱已复制 ✓' : 'Email copied to clipboard ✓'); };
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
  applyLang(lang);
})();
