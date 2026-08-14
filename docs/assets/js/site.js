/* ═══════════════════════════════════════════════════════════════════
   Garfield Jubilee Association — behaviour
   Vanilla ES2020. No bundler, no framework, no dependencies.
   Everything degrades: with JS off the page is fully readable and the
   contact form still submits via its own mailto action.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var clamp = function (v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; };

  /* ────────────────────────────────────────────────────────────────
     Spring physics — the one piece framer-motion actually earned.
     Semi-implicit Euler with the same stiffness/damping/mass model,
     so the original's tuning values carry over unchanged.
     ──────────────────────────────────────────────────────────────── */

  function Spring(stiffness, damping, mass) {
    this.k = stiffness;
    this.c = damping;
    this.m = mass || 1;
    this.value = 0;
    this.velocity = 0;
    this.target = 0;
  }
  Spring.prototype.step = function (dt) {
    var a = (-this.k * (this.value - this.target) - this.c * this.velocity) / this.m;
    this.velocity += a * dt;
    this.value += this.velocity * dt;
    return this.value;
  };
  Spring.prototype.jump = function (v) {
    this.value = this.target = v;
    this.velocity = 0;
  };

  /* Single rAF loop driving every spring on the page. */
  var tickers = [];
  var running = false;
  var lastT = 0;

  function addTicker(fn) {
    tickers.push(fn);
    if (!running) {
      running = true;
      lastT = performance.now();
      requestAnimationFrame(frame);
    }
  }

  function frame(now) {
    var dt = clamp((now - lastT) / 1000, 0, 1 / 30);
    lastT = now;
    // Snapshot: a ticker may remove itself once it settles.
    var list = tickers.slice();
    for (var i = 0; i < list.length; i++) list[i](dt);
    if (tickers.length) requestAnimationFrame(frame);
    else running = false;
  }

  /* ────────────────────────────────────────────────────────────────
     whenInView — fire a callback once per element, the first time it
     scrolls into view. Used by the reveals, the scramble headings and
     the impact counters.

     IntersectionObserver alone is not quite enough: it reports state at
     frame boundaries, so a fast flick or a programmatic jump can carry
     an element past the viewport without ever producing an intersecting
     entry, leaving it stuck at opacity 0. The debounced scroll sweep is
     the backstop that guarantees nothing is stranded.
     ──────────────────────────────────────────────────────────────── */

  function whenInView(elements, options, onEnter) {
    var pending = elements.slice();
    if (!pending.length) return;

    if (!('IntersectionObserver' in window)) {
      pending.forEach(onEnter);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) fire(entry.target);
      });
    }, options);

    pending.forEach(function (el) { io.observe(el); });

    function fire(el) {
      var i = pending.indexOf(el);
      if (i < 0) return;
      pending.splice(i, 1);
      io.unobserve(el);
      onEnter(el);
      if (!pending.length) {
        window.removeEventListener('scroll', onScroll);
        io.disconnect();
      }
    }

    var timer = null;
    function onScroll() {
      clearTimeout(timer);
      timer = setTimeout(function () {
        var limit = window.innerHeight * 0.9;
        pending.slice().forEach(function (el) {
          if (el.getBoundingClientRect().top < limit) fire(el);
        });
      }, 160);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ────────────────────────────────────────────────────────────────
     Custom cursor + ambient glow
     ──────────────────────────────────────────────────────────────── */

  function initCursor() {
    if (reduced || !finePointer || window.innerWidth < 1024) return;

    var root = document.documentElement;
    var cursor = $('.cursor');
    var glow = $('.ambient-glow');
    if (!cursor) return;

    root.classList.add('cursor-active');

    var dotX = new Spring(2000, 80), dotY = new Spring(2000, 80);
    var ringX = new Spring(180, 28), ringY = new Spring(180, 28);
    var glowX = new Spring(60, 18), glowY = new Spring(60, 18);
    var placed = false;

    document.addEventListener('mousemove', function (e) {
      if (!placed) {
        placed = true;
        dotX.jump(e.clientX); dotY.jump(e.clientY);
        ringX.jump(e.clientX); ringY.jump(e.clientY);
        glowX.jump(e.clientX); glowY.jump(e.clientY);
        if (glow) glow.style.opacity = '1';
      }
      dotX.target = ringX.target = glowX.target = e.clientX;
      dotY.target = ringY.target = glowY.target = e.clientY;
    }, { passive: true });

    document.addEventListener('mouseover', function (e) {
      var interactive = e.target.closest && e.target.closest('a, button, input, textarea, select, [data-cursor]');
      root.classList.toggle('cursor-hover', !!interactive);
    }, { passive: true });

    document.addEventListener('mousedown', function () { root.classList.add('cursor-down'); }, { passive: true });
    document.addEventListener('mouseup', function () { root.classList.remove('cursor-down'); }, { passive: true });
    document.addEventListener('mouseleave', function () { cursor.style.opacity = '0'; }, { passive: true });
    document.addEventListener('mouseenter', function () { cursor.style.opacity = '1'; }, { passive: true });

    addTicker(function (dt) {
      cursor.style.setProperty('--dx', dotX.step(dt).toFixed(2) + 'px');
      cursor.style.setProperty('--dy', dotY.step(dt).toFixed(2) + 'px');
      cursor.style.setProperty('--rx', ringX.step(dt).toFixed(2) + 'px');
      cursor.style.setProperty('--ry', ringY.step(dt).toFixed(2) + 'px');
      if (glow) {
        glow.style.setProperty('--gx', glowX.step(dt).toFixed(1) + 'px');
        glow.style.setProperty('--gy', glowY.step(dt).toFixed(1) + 'px');
      }
    });
  }

  /* ────────────────────────────────────────────────────────────────
     Magnetic buttons — pull toward the cursor at 0.28 strength
     ──────────────────────────────────────────────────────────────── */

  function initMagnetic() {
    if (reduced || !finePointer) return;

    $$('[data-magnetic]').forEach(function (el) {
      var sx = new Spring(280, 22), sy = new Spring(280, 22);
      var active = false;
      var raf = null;

      function loop(dt) {
        sx.step(dt); sy.step(dt);
        el.style.transform = 'translate3d(' + sx.value.toFixed(2) + 'px,' + sy.value.toFixed(2) + 'px,0)';
        // Stop the loop once it has settled back at rest.
        if (!active && Math.abs(sx.value) < 0.05 && Math.abs(sy.value) < 0.05 &&
            Math.abs(sx.velocity) < 0.5 && Math.abs(sy.velocity) < 0.5) {
          el.style.transform = '';
          sx.jump(0); sy.jump(0);
          var i = tickers.indexOf(loop);
          if (i > -1) tickers.splice(i, 1);
          raf = null;
        }
      }

      function ensureLoop() { if (!raf) { raf = loop; addTicker(loop); } }

      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        sx.target = (e.clientX - (r.left + r.width / 2)) * 0.28;
        sy.target = (e.clientY - (r.top + r.height / 2)) * 0.28;
        active = true;
        ensureLoop();
      });

      el.addEventListener('mouseleave', function () {
        sx.target = 0; sy.target = 0;
        active = false;
        ensureLoop();
      });
    });
  }

  /* ────────────────────────────────────────────────────────────────
     Hero particles
     ──────────────────────────────────────────────────────────────── */

  var PARTICLES = [
    [2, 5, 8, 140, 3.5, 0.0],   [3, 12, 15, 190, 2.8, 1.2], [1, 19, 10, 130, 4.2, 0.5],
    [3, 26, 20, 200, 3.1, 2.0], [2, 33, 7, 160, 2.5, 0.8],  [4, 40, 18, 220, 3.8, 1.6],
    [2, 47, 12, 145, 4.5, 3.0], [3, 54, 25, 175, 2.9, 0.3], [1, 61, 6, 155, 3.6, 1.8],
    [2, 68, 14, 210, 2.6, 0.7], [3, 75, 22, 170, 4.1, 2.4], [2, 82, 9, 135, 3.3, 1.1],
    [1, 88, 17, 195, 2.7, 0.4], [3, 93, 11, 150, 4.4, 2.8], [2, 8, 28, 180, 3.0, 1.5],
    [4, 23, 5, 225, 2.4, 0.9],  [2, 37, 32, 165, 3.9, 2.2], [1, 51, 13, 125, 4.3, 0.6],
    [3, 64, 27, 185, 2.8, 1.9], [2, 78, 19, 215, 3.4, 3.2]
  ];

  function initParticles() {
    var host = $('.particles');
    if (!host || reduced) return;

    var frag = document.createDocumentFragment();
    PARTICLES.forEach(function (p) {
      var el = document.createElement('span');
      el.className = 'particle';
      el.style.width = el.style.height = p[0] + 'px';
      el.style.left = p[1] + '%';
      el.style.bottom = p[2] + '%';
      el.style.setProperty('--dist', p[3] + 'px');
      el.style.setProperty('--dur', p[4] + 's');
      el.style.setProperty('--delay', p[5] + 's');
      frag.appendChild(el);
    });
    host.appendChild(frag);
  }

  /* ────────────────────────────────────────────────────────────────
     Nav — scrolled state, mobile drawer
     ──────────────────────────────────────────────────────────────── */

  function initNav() {
    var nav = $('#nav');
    var toggle = $('#navToggle');
    var drawer = $('#navMobile');

    if (nav) {
      var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 40); };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    if (toggle && drawer) {
      var setOpen = function (open) {
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        drawer.classList.toggle('is-open', open);
      };
      toggle.addEventListener('click', function () {
        setOpen(toggle.getAttribute('aria-expanded') !== 'true');
      });
      drawer.addEventListener('click', function (e) {
        if (e.target.closest('a')) setOpen(false);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
          setOpen(false);
          toggle.focus();
        }
      });
    }
  }

  /* ────────────────────────────────────────────────────────────────
     Hero parallax + fade  (replaces useScroll/useTransform)
     ──────────────────────────────────────────────────────────────── */

  function initHeroScroll() {
    var hero = $('#hero');
    var bg = $('[data-parallax]');
    var content = $('[data-hero-fade]');
    if (!hero || reduced) return;

    var height = hero.offsetHeight;
    var pending = false;

    function update() {
      pending = false;
      var p = clamp(window.scrollY / height, 0, 1);
      if (bg) bg.style.setProperty('--parallax', (p * 35).toFixed(2) + '%');
      if (content) content.style.setProperty('--hero-opacity', (1 - clamp(p / 0.75, 0, 1)).toFixed(3));
    }

    window.addEventListener('scroll', function () {
      if (!pending) { pending = true; requestAnimationFrame(update); }
    }, { passive: true });

    window.addEventListener('resize', function () {
      height = hero.offsetHeight;
      update();
    }, { passive: true });

    update();
  }

  /* ────────────────────────────────────────────────────────────────
     Split text — wrap each character for the staggered hero entrance
     ──────────────────────────────────────────────────────────────── */

  function initSplitText() {
    $$('[data-split]').forEach(function (el) {
      var text = el.textContent.trim();
      if (reduced) { el.textContent = text; return; }

      var delay = el.getAttribute('data-split-delay') || 0;
      el.style.setProperty('--split-delay', delay + 'ms');
      el.setAttribute('aria-label', text);

      var frag = document.createDocumentFragment();
      for (var i = 0; i < text.length; i++) {
        var span = document.createElement('span');
        span.className = 'char';
        span.setAttribute('aria-hidden', 'true');
        span.style.setProperty('--i', i);
        span.textContent = text[i] === ' ' ? ' ' : text[i];
        frag.appendChild(span);
      }
      el.textContent = '';
      el.appendChild(frag);
    });
  }

  /* ────────────────────────────────────────────────────────────────
     Scroll reveals  (replaces whileInView + viewport once)
     ──────────────────────────────────────────────────────────────── */

  function initReveals() {
    var targets = $$('[data-reveal]').concat($$('[data-clip-reveal]'));
    if (!targets.length) return;

    if (reduced) {
      targets.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    targets.forEach(function (el) {
      var d = el.getAttribute('data-reveal-delay');
      if (d) el.style.setProperty('--rd', d + 'ms');
    });

    whenInView(targets, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }, function (el) {
      el.classList.add('is-in');
    });
  }

  /* ────────────────────────────────────────────────────────────────
     Scramble headings
     ──────────────────────────────────────────────────────────────── */

  function initScramble() {
    var nodes = $$('[data-scramble]');
    if (!nodes.length || reduced) return;

    var POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ·◆∆';

    function run(el) {
      var text = el.textContent;
      var revealed = 0;
      var timer = setInterval(function () {
        var out = '';
        for (var i = 0; i < text.length; i++) {
          var c = text[i];
          if (c === ' ' || c === '\n') { out += c; }
          else if (i < revealed) { out += c; }
          else { out += POOL[(Math.random() * POOL.length) | 0]; }
        }
        el.textContent = out;
        revealed += 0.38;
        if (revealed > text.length) {
          clearInterval(timer);
          el.textContent = text;
        }
      }, 45);
    }

    whenInView(nodes, { threshold: 0.3 }, run);
  }

  /* ────────────────────────────────────────────────────────────────
     3D tilt cards
     ──────────────────────────────────────────────────────────────── */

  function initTilt() {
    if (reduced || !finePointer) return;

    $$('[data-tilt]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var nx = (e.clientX - r.left) / r.width;
        var ny = (e.clientY - r.top) / r.height;
        el.style.setProperty('--tilt-x', ((ny - 0.5) * 10).toFixed(2) + 'deg');
        el.style.setProperty('--tilt-y', ((nx - 0.5) * -10).toFixed(2) + 'deg');
        el.style.setProperty('--spot-x', (nx * 100).toFixed(1) + '%');
        el.style.setProperty('--spot-y', (ny * 100).toFixed(1) + '%');
      });

      el.addEventListener('mouseenter', function () {
        el.classList.remove('is-shining');
        void el.offsetWidth;            // force reflow so the sweep replays
        el.classList.add('is-shining');
      });

      el.addEventListener('mouseleave', function () {
        el.style.setProperty('--tilt-x', '0deg');
        el.style.setProperty('--tilt-y', '0deg');
        el.style.setProperty('--spot-x', '50%');
        el.style.setProperty('--spot-y', '50%');
      });

      el.addEventListener('animationend', function () { el.classList.remove('is-shining'); });
    });
  }

  /* ────────────────────────────────────────────────────────────────
     Impact counters
     ──────────────────────────────────────────────────────────────── */

  function initCounters() {
    var nodes = $$('[data-count]');
    if (!nodes.length) return;

    function format(el, value) {
      var n = value === undefined ? Number(el.getAttribute('data-count')) : value;
      return el.getAttribute('data-count-plain') === 'true' ? String(n) : n.toLocaleString();
    }

    if (reduced) {
      nodes.forEach(function (el) { el.textContent = format(el); });
      return;
    }

    function count(el) {
      var target = Number(el.getAttribute('data-count'));
      var duration = 2000;
      var start = performance.now();

      (function step(now) {
        var t = clamp((now - start) / duration, 0, 1);
        if (t < 1) {
          el.textContent = format(el, Math.floor(target * t));
          requestAnimationFrame(step);
        } else {
          el.textContent = format(el, target);
          var value = el.closest('.stat__value');
          if (value) {
            value.classList.add('is-popped');
            setTimeout(function () { value.classList.remove('is-popped'); }, 500);
          }
        }
      })(start);
    }

    nodes.forEach(function (el) { el.textContent = format(el, 0); });
    whenInView(nodes, { threshold: 0.4 }, count);
  }

  /* ────────────────────────────────────────────────────────────────
     Testimonial carousel
     ──────────────────────────────────────────────────────────────── */

  function initQuotes() {
    var root = $('#quotes');
    if (!root) return;

    var slides = $$('.quote', root);
    var dotsHost = $('.quotes__dots', root);
    if (slides.length < 2) return;

    var index = 0;
    var timer = null;
    var DWELL = 6000;

    var dots = slides.map(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'quotes__dot';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', 'Testimonial ' + (i + 1) + ' of ' + slides.length);
      b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      b.appendChild(document.createElement('span'));
      b.addEventListener('click', function () { go(i, true); });
      dotsHost.appendChild(b);
      return b;
    });

    function go(next, manual) {
      if (next === index) return;
      var dir = next > index ? 1 : -1;

      // Outgoing slide leaves against the travel direction.
      var prev = slides[index];
      prev.style.setProperty('--from', (-dir * 60) + 'px');
      prev.classList.remove('is-active');

      index = (next + slides.length) % slides.length;

      // Park the incoming slide on the entry side with transitions off,
      // then let it animate in — otherwise it would slide in from
      // wherever it happened to be left by an earlier exit.
      var incoming = slides[index];
      incoming.style.transition = 'none';
      incoming.style.setProperty('--from', (dir * 60) + 'px');
      void incoming.offsetWidth;
      incoming.style.transition = '';
      incoming.classList.add('is-active');

      dots.forEach(function (d, i) { d.setAttribute('aria-selected', i === index ? 'true' : 'false'); });
      restartFill();
      if (manual) resetTimer();
    }

    /* The dot's fill bar is a CSS animation; replay it by reflowing. */
    function restartFill() {
      var bar = dots[index].firstChild;
      bar.style.animation = 'none';
      void bar.offsetWidth;
      bar.style.animation = '';
    }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(function () { go(index + 1); }, DWELL);
    }

    $$('[data-quote-step]', root).forEach(function (btn) {
      btn.addEventListener('click', function () {
        go(index + Number(btn.getAttribute('data-quote-step')), true);
      });
    });

    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { go(index - 1, true); }
      else if (e.key === 'ArrowRight') { go(index + 1, true); }
    });

    if (reduced) return;   // leave the first quote up, no autoplay

    /* Only run the autoplay while the carousel is actually on screen. */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        var visible = entries[0].isIntersecting;
        root.classList.toggle('is-paused', !visible);
        if (visible) { restartFill(); resetTimer(); }
        else { clearInterval(timer); }
      }, { threshold: 0.25 }).observe(root);
    } else {
      resetTimer();
    }
  }

  /* ────────────────────────────────────────────────────────────────
     Contact form

     With no backend available on GitHub Pages there are two paths:
       • data-endpoint set  → POST to a form relay (Formspree et al.)
       • otherwise          → hand off to the visitor's mail client
     Both share the sending / success states.
     ──────────────────────────────────────────────────────────────── */

  function initForm() {
    var form = $('#contactForm');
    var success = $('#formSuccess');
    var reset = $('#formReset');
    if (!form || !success) return;

    var errorBox = $('.form__error', form);
    var successCopy = $('p', success);
    var SENT_COPY = successCopy.textContent;
    var MAIL_COPY = 'Your message is ready in your email app — press send there and the ' +
                    'Garfield Jubilee team will get back to you within 1–2 business days.';

    function showError(msg) {
      form.classList.remove('is-sending');
      errorBox.textContent = msg;
      errorBox.hidden = false;
    }

    function showSuccess(viaMail) {
      form.classList.remove('is-sending');
      successCopy.textContent = viaMail ? MAIL_COPY : SENT_COPY;
      form.hidden = true;
      success.hidden = false;
      success.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot: only a bot fills a field it cannot see.
      if (form.elements.company && form.elements.company.value) return;

      errorBox.hidden = true;
      form.classList.add('is-sending');

      var data = new FormData(form);
      data.delete('company');
      var endpoint = form.getAttribute('data-endpoint');

      if (endpoint) {
        fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
          .then(function (res) {
            if (!res.ok) throw new Error('Request failed with status ' + res.status);
            showSuccess(false);
          })
          .catch(function () {
            showError('Something went wrong sending your message. Please email us directly at ' +
                      'info@garfieldjubilee.org or call (412) 665-5200.');
          });
        return;
      }

      // mailto hand-off
      var to = form.getAttribute('data-mailto') || 'info@garfieldjubilee.org';
      var subject = 'Website enquiry — ' + (data.get('interest') || 'General Inquiry');
      var body = [
        'Name: ' + (data.get('name') || ''),
        'Email: ' + (data.get('email') || ''),
        'Phone: ' + (data.get('phone') || '—'),
        'Interest: ' + (data.get('interest') || ''),
        '',
        data.get('message') || ''
      ].join('\n');

      var href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) +
                 '&body=' + encodeURIComponent(body);

      setTimeout(function () {
        window.location.href = href;
        showSuccess(true);
      }, 700);
    });

    if (reset) {
      reset.addEventListener('click', function () {
        form.reset();
        form.hidden = false;
        success.hidden = true;
        errorBox.hidden = true;
        var first = form.querySelector('input');
        if (first) first.focus();
      });
    }
  }

  /* ────────────────────────────────────────────────────────────────
     Odds and ends
     ──────────────────────────────────────────────────────────────── */

  function initMisc() {
    var year = $('#year');
    if (year) year.textContent = String(new Date().getFullYear());
  }

  /* ────────────────────────────────────────────────────────────────
     Boot
     ──────────────────────────────────────────────────────────────── */

  function init() {
    initSplitText();
    initParticles();
    initNav();
    initHeroScroll();
    initReveals();
    initScramble();
    initTilt();
    initMagnetic();
    initCounters();
    initQuotes();
    initForm();
    initCursor();
    initMisc();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
