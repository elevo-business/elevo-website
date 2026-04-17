/* ELEVO — Shared JS */
(function () {
  'use strict';

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.addEventListener('load', function () { window.scrollTo(0, 0); });

  // Lucide icons
  function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
  document.addEventListener('DOMContentLoaded', initIcons);

  // Header scroll effect
  var header = document.querySelector('.header');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 10) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
    var progress = document.querySelector('.scroll-progress');
    if (progress) {
      var h = document.documentElement;
      var pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      progress.style.width = Math.max(0, Math.min(100, pct)) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile burger + nav dropdowns
  document.addEventListener('click', function (e) {
    var burger = e.target.closest('.burger');
    if (burger) {
      var nav = document.querySelector('.nav');
      if (nav) nav.classList.toggle('open');
      return;
    }
    var trigger = e.target.closest('[data-dropdown]');
    if (trigger) {
      e.preventDefault();
      var item = trigger.closest('.nav-item');
      if (item) {
        document.querySelectorAll('.nav-item.open').forEach(function (i) { if (i !== item) i.classList.remove('open'); });
        item.classList.toggle('open');
      }
      return;
    }
    if (!e.target.closest('.nav-item')) {
      document.querySelectorAll('.nav-item.open').forEach(function (i) { i.classList.remove('open'); });
    }
  });

  // Scroll reveal
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // Counters
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-count') || '0');
    var dur = 1400;
    var start = performance.now();
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    function tick(now) {
      var p = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = prefix + (target % 1 === 0 ? Math.round(val) : val.toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCounter(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(function (el) { co.observe(el); });
  }

  // FAQ accordion
  document.addEventListener('click', function (e) {
    var q = e.target.closest('.faq-q');
    if (!q) return;
    var item = q.closest('.faq-item');
    if (item) item.classList.toggle('open');
  });

  // Legal overlays
  document.addEventListener('click', function (e) {
    var open = e.target.closest('[data-overlay]');
    if (open) {
      e.preventDefault();
      var id = open.getAttribute('data-overlay');
      var ov = document.getElementById(id);
      if (ov) { ov.classList.add('open'); document.body.style.overflow = 'hidden'; }
      return;
    }
    var close = e.target.closest('.overlay-close, [data-overlay-close]');
    if (close) {
      var parent = close.closest('.overlay');
      if (parent) { parent.classList.remove('open'); document.body.style.overflow = ''; }
      return;
    }
    if (e.target.classList && e.target.classList.contains('overlay')) {
      e.target.classList.remove('open'); document.body.style.overflow = '';
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.overlay.open').forEach(function (ov) { ov.classList.remove('open'); });
      document.body.style.overflow = '';
    }
  });

  // Cookie consent
  var CONSENT_KEY = 'elevo_consent_v1';
  function showCookie() {
    var el = document.querySelector('.cookie');
    if (el) el.classList.add('show');
  }
  function hideCookie() {
    var el = document.querySelector('.cookie');
    if (el) el.classList.remove('show');
  }
  function setConsent(val) {
    try { localStorage.setItem(CONSENT_KEY, val); } catch (e) {}
    hideCookie();
    if (val === 'granted' && typeof gtag === 'function') {
      gtag('consent', 'update', { ad_storage: 'granted', analytics_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' });
    }
  }
  document.addEventListener('DOMContentLoaded', function () {
    var saved = null;
    try { saved = localStorage.getItem(CONSENT_KEY); } catch (e) {}
    if (!saved) showCookie();
    var accept = document.querySelector('[data-cookie-accept]');
    var reject = document.querySelector('[data-cookie-reject]');
    if (accept) accept.addEventListener('click', function () { setConsent('granted'); });
    if (reject) reject.addEventListener('click', function () { setConsent('denied'); });
  });

  // UTM helpers
  function getUTM() {
    var p = new URLSearchParams(window.location.search);
    var out = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid'].forEach(function (k) {
      var v = p.get(k); if (v) out[k] = v;
    });
    return out;
  }

  // Form handler
  async function submitForm(form) {
    var status = form.querySelector('.form-status');
    var btn = form.querySelector('[type=submit]');
    var hp = form.querySelector('input[name="_hp"]');
    var ts = form.querySelector('input[name="_ts"]');
    if (hp && hp.value) return;
    if (ts && ts.value) {
      var started = parseInt(ts.value, 10);
      if (Date.now() - started < 1500) return;
    }
    var data = {};
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || el.name.startsWith('_')) return;
      data[el.name] = el.value;
    });
    data.topic = data.topic || form.getAttribute('data-topic') || 'Kontakt';
    data.page = window.location.pathname;
    data.utm = getUTM();
    if (btn) { btn.disabled = true; btn.setAttribute('data-label', btn.textContent); btn.textContent = 'Wird gesendet...'; }
    if (status) { status.className = 'form-status'; status.textContent = ''; }
    try {
      var res = await fetch('https://api.elevo.solutions/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('http ' + res.status);
      if (status) { status.className = 'form-status ok'; status.textContent = 'Danke. Wir melden uns innerhalb von 24 Stunden.'; }
      form.reset();
      if (typeof gtag === 'function') { gtag('event', 'generate_lead', { topic: data.topic }); }
    } catch (err) {
      if (status) { status.className = 'form-status err'; status.textContent = 'Da ist etwas schiefgelaufen. Schreib uns direkt an hallo@elevo.solutions.'; }
    } finally {
      if (btn) { btn.disabled = false; if (btn.getAttribute('data-label')) btn.textContent = btn.getAttribute('data-label'); }
    }
  }
  document.addEventListener('submit', function (e) {
    var form = e.target.closest('[data-form="elevo"]');
    if (!form) return;
    e.preventDefault();
    submitForm(form);
  });
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-form="elevo"]').forEach(function (f) {
      var ts = f.querySelector('input[name="_ts"]'); if (ts) ts.value = String(Date.now());
    });
  });

  // Digital-Check Quiz
  var QUIZ = {
    questions: [
      { key: 'branche', title: 'In welcher Branche bist du unterwegs?', options: [
        { label: 'Handwerk & Bau', v: 'handwerk' },
        { label: 'Gastro & Hospitality', v: 'gastro' },
        { label: 'Beratung & Dienstleistung', v: 'beratung' },
        { label: 'Handel & E-Commerce', v: 'handel' },
        { label: 'Industrie & Produktion', v: 'industrie' },
        { label: 'Andere', v: 'other' }
      ]},
      { key: 'status', title: 'Wie sieht deine aktuelle Website aus?', options: [
        { label: 'Keine Website', v: 'none', score: 3 },
        { label: 'Alt & unübersichtlich', v: 'old', score: 3 },
        { label: 'Okay, aber bringt nichts', v: 'mid', score: 2 },
        { label: 'Neu, aber ohne Prozesse', v: 'new', score: 2 }
      ]},
      { key: 'pain', title: 'Wo drückt der Schuh am meisten?', options: [
        { label: 'Zu wenig Anfragen', v: 'leads', score: 2 },
        { label: 'Manuelle Prozesse fressen Zeit', v: 'manual', score: 3 },
        { label: 'Nicht sichtbar bei Google', v: 'seo', score: 2 },
        { label: 'Sieht nicht professionell aus', v: 'look', score: 2 }
      ]},
      { key: 'goal', title: 'Was willst du in den nächsten 12 Monaten erreichen?', options: [
        { label: 'Mehr qualifizierte Anfragen', v: 'leads' },
        { label: 'Weniger manuellen Aufwand', v: 'auto' },
        { label: 'Neuen Markenauftritt', v: 'brand' },
        { label: 'Skalieren & Prozesse bauen', v: 'scale' }
      ]},
      { key: 'budget', title: 'Welche Investitionsgröße ist realistisch?', options: [
        { label: 'Unter 5.000 €', v: 's', score: 1 },
        { label: '5.000 – 15.000 €', v: 'm', score: 2 },
        { label: '15.000 – 40.000 €', v: 'l', score: 3 },
        { label: '40.000 € +', v: 'xl', score: 3 }
      ]}
    ],
    answers: {},
    step: 0
  };

  function renderQuiz() {
    var container = document.getElementById('quiz');
    if (!container) return;
    var total = QUIZ.questions.length;
    var pct = ((QUIZ.step) / total) * 100;
    var bar = container.querySelector('.quiz-bar > div');
    if (bar) bar.style.width = pct + '%';

    container.querySelectorAll('.quiz-step').forEach(function (s, i) {
      s.classList.toggle('active', i === QUIZ.step && QUIZ.step < total);
    });
    var result = container.querySelector('.quiz-result');
    if (QUIZ.step >= total) {
      if (result) { result.classList.add('active'); computeResult(result); }
    } else if (result) {
      result.classList.remove('active');
    }
  }

  function computeResult(resultEl) {
    var score = 0;
    QUIZ.questions.forEach(function (q) {
      var a = QUIZ.answers[q.key];
      if (!a) return;
      var opt = q.options.find(function (o) { return o.v === a; });
      if (opt && opt.score) score += opt.score;
    });
    var stufe = 1, title = 'Stufe 1 — Fundament schaffen', desc = 'Eine fokussierte Website, die Vertrauen aufbaut und Anfragen bringt. Start: 3–6 Wochen live.', ref = 'akropolis', refLabel = 'Akropolis Restaurant';
    if (score >= 8) { stufe = 3; title = 'Stufe 3 — Skalieren & automatisieren'; desc = 'Website + Prozessdigitalisierung + laufende Betreuung. Du willst wachsen ohne im Tagesgeschäft zu ertrinken.'; ref = 'greenchild'; refLabel = 'Greenchild Investment'; }
    else if (score >= 5) { stufe = 2; title = 'Stufe 2 — Sichtbar werden'; desc = 'Neue Website plus SEO-Fundament. Der richtige Schritt wenn du bereits etabliert bist, aber online nicht stattfindest.'; ref = 'zuma-lounge'; refLabel = 'ZUMA Lounge'; }
    resultEl.innerHTML = '<span class="badge">Deine Empfehlung</span>' +
      '<h3>' + title + '</h3>' +
      '<p>' + desc + '</p>' +
      '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:22px;">' +
        '<a class="btn btn-primary" href="/audit.html">Kostenlosen Audit starten</a>' +
        '<a class="btn btn-secondary" href="/referenzen/' + ref + '.html">Fall ansehen: ' + refLabel + '</a>' +
      '</div>';
    if (typeof gtag === 'function') gtag('event', 'quiz_complete', { stufe: stufe, score: score });
  }

  document.addEventListener('click', function (e) {
    var opt = e.target.closest('.quiz-option');
    if (opt) {
      var step = opt.closest('.quiz-step');
      var key = step.getAttribute('data-key');
      var v = opt.getAttribute('data-value');
      QUIZ.answers[key] = v;
      step.querySelectorAll('.quiz-option').forEach(function (o) { o.classList.remove('selected'); });
      opt.classList.add('selected');
      setTimeout(function () { QUIZ.step++; renderQuiz(); }, 260);
      return;
    }
    if (e.target.closest('[data-quiz-back]')) { if (QUIZ.step > 0) { QUIZ.step--; renderQuiz(); } }
    if (e.target.closest('[data-quiz-restart]')) { QUIZ.step = 0; QUIZ.answers = {}; renderQuiz(); }
  });

  document.addEventListener('DOMContentLoaded', function () {
    var container = document.getElementById('quiz');
    if (!container) return;
    var inner = container.querySelector('.quiz-inner');
    if (!inner) return;
    var html = '<div class="quiz-bar"><div></div></div>';
    QUIZ.questions.forEach(function (q, i) {
      html += '<div class="quiz-step' + (i === 0 ? ' active' : '') + '" data-key="' + q.key + '">' +
        '<div class="quiz-nav"><span class="meta">Frage ' + (i + 1) + ' von ' + QUIZ.questions.length + '</span>' +
          (i > 0 ? '<button type="button" class="btn btn-sm btn-secondary" data-quiz-back>Zurück</button>' : '') +
        '</div>' +
        '<h3>' + q.title + '</h3>' +
        '<div class="quiz-options">' +
          q.options.map(function (o) { return '<button type="button" class="quiz-option" data-value="' + o.v + '">' + o.label + '</button>'; }).join('') +
        '</div>' +
      '</div>';
    });
    html += '<div class="quiz-result"></div>';
    inner.innerHTML = html;
    renderQuiz();
  });

})();
