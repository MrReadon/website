// ===== Menu toggle (topbar floating nav) =====
const topbar = document.querySelector(".topbar");
const menuBtn = document.querySelector("[data-menu-btn]");
const nav = document.querySelector("[data-nav]");

if (menuBtn && topbar) {
  menuBtn.addEventListener("click", () => {
    topbar.classList.toggle("is-open");
  });

  // close on nav click
  nav?.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    topbar.classList.remove("is-open");
  });

  // close on outside click
  document.addEventListener("click", (e) => {
    const inside = e.target.closest(".topbar");
    if (!inside) topbar.classList.remove("is-open");
  });
}

// ===== Contact form demo =====
const form = document.querySelector("#contactForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // тут подключишь реальный обработчик (fetch на бек/письмо/telegram)
    alert("Sent (demo). Connect your backend here.");
    form.reset();
  });
}

// ===== Scroll Reveal (IntersectionObserver) =====
// ===== Scroll Reveal (IntersectionObserver) =====

// 1) точечно: то, что у тебя уже было + новые элементы
// ===== Scroll Reveal (IntersectionObserver) =====

// 1) точечно: то, что у тебя уже было + новые элементы
const revealEls = document.querySelectorAll(`
  .hero__arc, .h1, .hero__sub, .mosaic, .trustRow, .sectionTitle, .split, .capGrid, .metrics, .grid12,
  .processBook, .steps, .twoCol, .reviewsGrid, .faq, .pricing, .finalCta, .contact,

  /* NEW (cinema hero + extra blocks) */
  .heroCinema, .heroCinema__panel, .heroCinema__meta, .heroScroll,
  .trustBlock, .ctaRow,
  .portfolioMosaic, .work,
  .reviewsRail, .reviewsTitle, .reviewsDots,
  .contact__left, .contact__right,
  .footer
`);

// 2) авто-подхват: любые крупные блоки внутри секций,
// чтобы новые элементы “подхватывались” без правок списка.
const autoReveal = document.querySelectorAll(`
  .section > .container > *:not(script):not(style)
`);

const allReveal = Array.from(new Set([...revealEls, ...autoReveal]));

allReveal.forEach((el, i) => {
  el.classList.add("reveal");
  el.style.transitionDelay = `${Math.min(i * 35, 140)}ms`;
});

const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

allReveal.forEach(el => io.observe(el));

// ===== Hero Parallax (lightweight) =====
const arc = document.querySelector(".hero__arc");
let raf = null;

window.addEventListener("scroll", () => {
  if (!arc) return;
  if (raf) return;
  raf = requestAnimationFrame(() => {
    const y = window.scrollY || 0;
    arc.style.transform = `translateY(${y * 0.06}px)`;
    raf = null;
  });
}, { passive: true });

// ===== Hover Tilt (cards) =====
function tiltify(selector, maxDeg = 6) {
  document.querySelectorAll(selector).forEach(card => {
    card.style.transformStyle = "preserve-3d";
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = (py - 0.5) * -maxDeg;
      const ry = (px - 0.5) * maxDeg;
      card.style.transform = `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}
tiltify(".tile, .work");

// ===== Counters (stats count-up when visible) =====
function countUp(el, to, duration = 900) {
  const start = performance.now();
  const from = 0;
  const tick = (t) => {
    const p = Math.min((t - start) / duration, 1);
    const val = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))); // easeOutCubic
    el.textContent = val;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const statEls = document.querySelectorAll(".stat b");
const statsIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const b = e.target;
    const raw = b.textContent.trim();
    // ожидание формата типа "10+" / "90+" / "24"
    const num = parseInt(raw.replace(/\D/g, ""), 10);
    const suffix = raw.replace(/[0-9]/g, "");
    b.textContent = "0" + suffix;
    countUp(b, num);
    // вернуть суффикс после анимации
    setTimeout(() => { b.textContent = `${num}${suffix}`; }, 950);
    statsIO.unobserve(b);
  });
}, { threshold: 0.6 });

statEls.forEach(b => statsIO.observe(b));

// ===== Hero video parallax (light) =====
const heroVideo = document.querySelector(".heroVideo__media");
let pvRaf = null;

window.addEventListener("scroll", () => {
  if (!heroVideo) return;
  if (pvRaf) return;

  pvRaf = requestAnimationFrame(() => {
    const y = window.scrollY || 0;
    heroVideo.style.transform = `scale(1.05) translateY(${y * 0.04}px)`;
    pvRaf = null;
  });
}, { passive:true });

const hv = document.querySelector(".heroVideo--full .heroVideo__media");
let hvRaf = null;

window.addEventListener("scroll", () => {
  if (!hv) return;
  if (hvRaf) return;

  hvRaf = requestAnimationFrame(() => {
    const y = window.scrollY || 0;
    hv.style.transform = `scale(1.08) translateY(${y * 0.05}px)`;
    hvRaf = null;
  });
}, { passive:true });


const chips = document.querySelectorAll("[data-filter]");
const items = document.querySelectorAll(".work");

chips.forEach(chip => {
  chip.addEventListener("click", () => {

    chips.forEach(c => c.classList.remove("is-active"));
    chip.classList.add("is-active");

    const filter = chip.dataset.filter;

    items.forEach(item => {
      const tag = item.dataset.tag;

      if (filter === "all" || tag === filter) {
        item.style.display = "inline-block";
        setTimeout(() => {
          item.style.opacity = "1";
          item.style.transform = "scale(1)";
        }, 50);
      } else {
        item.style.opacity = "0";
        item.style.transform = "scale(.9)";
        setTimeout(() => {
          item.style.display = "none";
        }, 300);
      }
    });
  });
});

// ===== Services accordion (top opens down, bottom opens up) =====
const services = document.querySelector("[data-services]");
if (services) {
  const items = Array.from(services.querySelectorAll("[data-svc]"));

  const setPanelHeight = (item, open) => {
    const panel = item.querySelector("[data-svc-panel]");
    if (!panel) return;

    // reset
    panel.style.maxHeight = "0px";

    if (!open) return;

    // open: set maxHeight to scrollHeight
    const h = panel.scrollHeight;
    panel.style.maxHeight = h + "px";
  };

  const openItem = (item) => {
    items.forEach(it => {
      const open = it === item;
      it.classList.toggle("is-open", open);
      setPanelHeight(it, open);
    });

    // special: last item should open upward (like the ref)
    // we do it by reversing visual flow via translate + scroll into view
    const isLast = item === items[items.length - 1];
    if (isLast) {
      // keep header visible while expanding upward feel
      item.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  };

  // init heights
  items.forEach(it => setPanelHeight(it, it.classList.contains("is-open")));

  // click
  items.forEach(it => {
    const btn = it.querySelector("[data-svc-btn]");
    btn?.addEventListener("click", () => {
      const already = it.classList.contains("is-open");
      if (already) return; // как в рефе — обычно один открыт
      openItem(it);
    });
  });

  // on resize recalc current open
  window.addEventListener("resize", () => {
    const current = items.find(it => it.classList.contains("is-open"));
    if (current) setPanelHeight(current, true);
  });
}

(() => {
  const fallback = document.querySelector('.processBook__fallback');
  const stepsWrap = document.getElementById('processSteps');
  const stage = document.querySelector('.processBook__stage');
  const caption = document.querySelector('.processBook__caption');
  const capKicker = document.getElementById('capKicker');
  const capTitle  = document.getElementById('capTitle');
  const capText   = document.getElementById('capText');

  const slideA = document.getElementById('slideA');
  const slideB = document.getElementById('slideB');

  if (!stepsWrap || !slideA || !slideB) return;

  const steps = Array.from(stepsWrap.querySelectorAll('.step'));

  // 1) Данные: 1 индекс = 1 шаг = 1 картинка + тексты
  const data = [
    {
      img: "https://harvel.studio/wp-content/uploads/9-1.jpg",
      kicker: "01 — DISCOVERY",
      title: "References & scope alignment",
      text: "We collect references, confirm constraints, and define style targets."
    },
    {
      img: "https://harvel.studio/wp-content/uploads/GH_Harvel_Site_Preview.jpg",
      kicker: "02 — STYLEFRAMES",
      title: "Key frames & approvals",
      text: "We design key frames, iterate fast, and lock the look before production."
    },
    {
      img: "https://harvel.studio/wp-content/uploads/HOH_Harvel_Site_Preview.jpg",
      kicker: "03 — PRODUCTION",
      title: "Sprints, QA, revisions",
      text: "We produce in sprints with QA gates and structured revision rounds."
    },
    {
      img: "https://harvel.studio/wp-content/uploads/9-1.jpg",
      kicker: "04 — DELIVERY",
      title: "Sources + exports, naming",
      text: "We deliver layered sources and engine-ready exports with clean naming."
    }
  ];

  // если хочешь — можно брать тексты из data-атрибутов кнопок вместо массива,
  // но сейчас проще и стабильнее так (1 источник правды).

  let index = 0;
  let showingA = true;

  const AUTOPLAY_MS = 3200;
  const FADE_MS = 140;
  let timer = null;
  let paused = false;

  function setProgress(i){
    const p = (i / (data.length - 1)) * 100;
    stepsWrap.style.setProperty('--p', p.toFixed(2) + '%');
  }

  function setActiveStep(i){
    steps.forEach((s, n) => {
      const active = n === i;
      s.classList.toggle('is-active', active);
      s.setAttribute('aria-selected', active ? 'true' : 'false');
      s.tabIndex = active ? 0 : -1;
    });
  }

  function swapCaption(d){
    if (!caption) return;

    caption.classList.add('is-fadeout');
    window.setTimeout(() => {
      if (capKicker) capKicker.textContent = d.kicker;
      if (capTitle)  capTitle.textContent  = d.title;
      if (capText)   capText.textContent   = d.text;

      caption.classList.remove('is-fadeout');
      caption.classList.remove('is-swap');
      void caption.offsetWidth;
      caption.classList.add('is-swap');
    }, FADE_MS);
  }

  function swapImage(url){
    const active = showingA ? slideA : slideB;
    const next   = showingA ? slideB : slideA;

    // если url пустой — скрываем слой и не ломаемся
    if (!url){
      next.hidden = true;
      active.hidden = true;
      return;
    }

    next.hidden = false;
    next.src = url;

    next.onload = () => {
      if (fallback) fallback.classList.add('is-hidden');
    };
    next.onerror = () => {
      // если картинка не загрузилась — fallback оставляем
    };

    next.classList.add('slide--active');
    active.classList.remove('slide--active');
    active.classList.add('slide--out');

    window.setTimeout(() => {
      active.classList.remove('slide--out');
    }, 800);

    showingA = !showingA;
  }

  function go(i, {focus=false} = {}){
    i = (i + data.length) % data.length;
    index = i;

    const d = data[i];

    setActiveStep(i);
    setProgress(i);
    swapCaption(d);
    swapImage(d.img);

    if (focus) steps[i]?.focus();
  }

  function start(){
    if (timer) return;
    timer = window.setInterval(() => {
      if (paused) return;
      go(index + 1);
    }, AUTOPLAY_MS);
  }
  function stop(){
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  }
  function setPaused(v){ paused = v; }

  // pause on hover/focus
  stepsWrap.addEventListener('mouseenter', () => setPaused(true));
  stepsWrap.addEventListener('mouseleave', () => setPaused(false));
  stage && stage.addEventListener('mouseenter', () => setPaused(true));
  stage && stage.addEventListener('mouseleave', () => setPaused(false));
  stepsWrap.addEventListener('focusin', () => setPaused(true));
  stepsWrap.addEventListener('focusout', () => setPaused(false));

  // click step
  stepsWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.step');
    if (!btn) return;
    const i = steps.indexOf(btn);
    go(i, {focus:false});
    setPaused(true);
    setTimeout(() => setPaused(false), 1400);
  });

  // keyboard
  stepsWrap.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1, {focus:true}); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); go(index - 1, {focus:true}); }
  });

  // init from existing active button (если есть)
  const preset = steps.findIndex(s => s.classList.contains('is-active'));
  index = preset >= 0 ? preset : 0;

  go(index);
  if (fallback && (slideA.complete || slideB.complete)) fallback.classList.add('is-hidden');
  start();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });
})();

(() => {
  const section = document.getElementById('reviews');
  const rail = document.querySelector('[data-reviews]');
  const track = document.getElementById('reviewsTrack');
  const prevBtn = document.querySelector('[data-r-prev]');
  const nextBtn = document.querySelector('[data-r-next]');
  const dotsWrap = document.getElementById('reviewsDots');

  if (!rail || !track) return;

  const AUTOPLAY_MS = 3200;
  let timer = null;
  let paused = false;        // used for drag; hover uses stop/start
  let realCards = [];
  let realCount = 0;
  let clonesBefore = 0;
  let clonesAfter = 0;
  let index = 0;             // real index
  let page = 0;              // current page
  let pages = 1;

  const qsAll = (sel, root=document) => Array.from(root.querySelectorAll(sel));

   // --- smooth scroll (better than native behavior:smooth)
  let animRaf = 0;

  function easeInOutCubic(t){
    return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;
  }

  function animateScrollLeft(el, to, duration = 560){
    cancelAnimationFrame(animRaf);

    const from = el.scrollLeft;
    const delta = to - from;
    if (Math.abs(delta) < 0.5) {
      el.scrollLeft = to;
      return Promise.resolve();
    }

    rail.classList.add('is-turning'); // блокируем correctLoopIfNeeded()
    const start = performance.now();

    return new Promise(resolve => {
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = easeInOutCubic(t);
        el.scrollLeft = from + delta * eased;

        if (t < 1) {
          animRaf = requestAnimationFrame(tick);
        } else {
          rail.classList.remove('is-turning');
          // после анимации один раз выравниваем луп, но уже без рывка
          correctLoopIfNeeded();
          resolve();
        }
      };
      animRaf = requestAnimationFrame(tick);
    });
  }

  function getGapPx(el){
    const g = getComputedStyle(el).gap;
    return parseFloat(g || "0") || 0;
  }

  function cardStep(){
    const c = track.querySelector('.reviewCard');
    if (!c) return 0;
    return c.getBoundingClientRect().width + getGapPx(track);
  }

  function perPage(){
    const step = cardStep();
    if (!step) return 1;
    const w = rail.getBoundingClientRect().width;
    return Math.max(1, Math.floor(w / step));
  }

  function cleanupClones(){
    qsAll('[data-clone="1"]', track).forEach(n => n.remove());
  }

  function captureRealCards(){
    realCards = qsAll('.reviewCard', track).filter(n => n.dataset.clone !== "1");
    realCount = realCards.length;
  }

  function buildDots(){
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    for (let i = 0; i < pages; i++){
      const d = document.createElement('button');
      d.type = 'button';
      d.className = 'dot' + (i === page ? ' is-active' : '');
      d.setAttribute('aria-label', `Go to page ${i+1}`);
      d.addEventListener('click', () => goPage(i, true));
      dotsWrap.appendChild(d);
    }
  }

  function updateDots(){
    if (!dotsWrap) return;
    const dots = qsAll('.dot', dotsWrap);
    dots.forEach((d, i) => d.classList.toggle('is-active', i === page));
  }

  function buildLoop(){
    cleanupClones();
    captureRealCards();
    if (!realCount) return;

    const pp = perPage();
    clonesBefore = Math.min(pp, realCount);
    clonesAfter  = Math.min(pp, realCount);

    // prepend clones (tail)
    realCards.slice(realCount - clonesBefore).forEach(node => {
      const c = node.cloneNode(true);
      c.dataset.clone = "1";
      c.setAttribute('aria-hidden', 'true');
      track.insertBefore(c, track.firstChild);
    });

    // append clones (head)
    realCards.slice(0, clonesAfter).forEach(node => {
      const c = node.cloneNode(true);
      c.dataset.clone = "1";
      c.setAttribute('aria-hidden', 'true');
      track.appendChild(c);
    });

    pages = Math.max(1, Math.ceil(realCount / pp));
    index = 0;
    page = 0;

    const step = cardStep();
    track.scrollTo({ left: step * clonesBefore, behavior: 'auto' });

    buildDots();
    updateDots();
  }

  // --- loop correction (snap from clones to real area)
 function correctLoopIfNeeded(){
  // если идёт анимация перелистывания — не дёргаем позицию
  if (rail.classList.contains('is-turning')) return;

  const step = cardStep();
  if (!step) return;

  const left = track.scrollLeft;
  const minReal = step * clonesBefore;
  const maxReal = step * (clonesBefore + realCount - 1);

  if (left < minReal - step * 0.5 || left > maxReal + step * clonesAfter + step * 0.5){
    const offsetCards = Math.round(left / step);
    const realPos = (offsetCards - clonesBefore) % realCount;
    const normalized = (realPos + realCount) % realCount;

    track.scrollTo({ left: step * (clonesBefore + normalized), behavior: 'auto' });
    index = normalized;

    const pp = perPage();
    page = Math.floor(index / pp);
    updateDots();
  }
}

  // --- animated page change helper (always smooth + wipe)
  function animatePageChange(){
    rail.classList.remove('is-wiping');
    void rail.offsetWidth;
    rail.classList.add('is-wiping');
  }

   function goIndex(realIndex, smooth=true){
    const step = cardStep();
    const pp = perPage();
    if (!step) return;

    realIndex = (realIndex % realCount + realCount) % realCount;
    index = realIndex;

    page = Math.floor(index / pp);
    updateDots();

    const target = step * (clonesBefore + index);

    if (smooth){
      animatePageChange();
      animateScrollLeft(track, target, 560); // <-- вместо scrollTo smooth
    } else {
      track.scrollTo({ left: target, behavior: 'auto' });
    }
  }

  function goPage(p, smooth=true){
    const pp = perPage();
    pages = Math.max(1, Math.ceil(realCount / pp));
    p = (p % pages + pages) % pages;

    page = p;
    updateDots();

    const i = Math.min(p * pp, realCount - 1);
    goIndex(i, smooth);
  }

  // --- autoplay (page-based)
  function start(){
    if (timer || realCount <= 1) return;
    timer = setInterval(() => {
      if (paused) return;
      goPage(page + 1, true);
    }, AUTOPLAY_MS);
  }

  function stop(){
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  }

  // ✅ EXACTLY: hover on whole section stops autoplay
  const hoverTarget = section || rail;
  hoverTarget.addEventListener('mouseenter', () => stop());
  hoverTarget.addEventListener('mouseleave', () => start());
  hoverTarget.addEventListener('focusin', () => stop());
  hoverTarget.addEventListener('focusout', () => start());

  // buttons
  prevBtn && prevBtn.addEventListener('click', () => { stop(); goPage(page - 1, true); });
  nextBtn && nextBtn.addEventListener('click', () => { stop(); goPage(page + 1, true); });

  // drag / swipe (pauses via paused flag + stops timer)
  let isDown = false;
  let startX = 0;
  let startScroll = 0;

  rail.addEventListener('pointerdown', (e) => {
    isDown = true;
    rail.setPointerCapture(e.pointerId);
    startX = e.clientX;
    startScroll = track.scrollLeft;
    paused = true;
    stop();
  });

  rail.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    track.scrollLeft = startScroll - dx;
  });

  function snapToNearest(){
    const step = cardStep();
    if (!step) return;

    const offsetCards = Math.round(track.scrollLeft / step);
    const realPos = (offsetCards - clonesBefore) % realCount;
    const normalized = (realPos + realCount) % realCount;

    goIndex(normalized, true);
  }

  rail.addEventListener('pointerup', () => {
    if (!isDown) return;
    isDown = false;
    snapToNearest();
    paused = false;
    // autoplay вернётся при mouseleave, но если курсор уже не над секцией — запускаем
    const isHover = hoverTarget.matches(':hover');
    if (!isHover) start();
  });

  rail.addEventListener('pointercancel', () => {
    isDown = false;
    paused = false;
    const isHover = hoverTarget.matches(':hover');
    if (!isHover) start();
  });

  // scroll sync + correction
  let t = null;
  track.addEventListener('scroll', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      const step = cardStep();
      if (!step) return;

      const offsetCards = Math.round(track.scrollLeft / step);
      const realPos = (offsetCards - clonesBefore) % realCount;
      index = (realPos + realCount) % realCount;

      correctLoopIfNeeded();
    }, 90);
  });

  // rebuild on resize (pages depend on visible cards)
  let rt = null;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      const prevPage = page;
      buildLoop();
      goPage(prevPage, false);
      // if not hovered, keep autoplay
      const isHover = hoverTarget.matches(':hover');
      if (!isHover) start();
      else stop();
    }, 160);
  });

  // init
  track.style.overflowX = 'auto';

  buildLoop();
  goPage(0, false);
  // start only if not hovered
  if (!(hoverTarget.matches && hoverTarget.matches(':hover'))) start();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else {
      const isHover = hoverTarget.matches(':hover');
      if (!isHover) start();
    }
  });
})();

// subtle glow follow mouse (optional)
(function(){
  const cards = document.querySelectorAll('.ctaNeo__card, .formNeo, .contactNeo__left');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty('--mx', x.toFixed(2) + '%');
      card.style.setProperty('--my', y.toFixed(2) + '%');
    });
  });
})();
