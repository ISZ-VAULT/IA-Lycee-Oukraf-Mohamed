/* ============================================================
   OUTILS D'AFFICHAGE
   ============================================================ */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

// Échappe le texte inséré dans le DOM.
function esc(s){
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

/* ============================================================
   APPARITION EN FONDU (observateur d'intersection)
   ============================================================ */
let io = null;
function observeAll(){
  if(!("IntersectionObserver" in window)){
    $$(".rv").forEach(el => el.classList.add("in"));
    return;
  }
  if(!io){
    io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if(en.isIntersecting){
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, {threshold: .12, rootMargin: "0px 0px -8% 0px"});
  }
  // On observe chaque élément encore masqué, y compris ceux créés dynamiquement.
  $$(".rv").forEach(el => {
    if(!el.classList.contains("in")) io.observe(el);
  });
}

// Filet de sécurité : plus aucune carte ne reste invisible après le chargement.
function revealFallback(){
  setTimeout(() => {
    $$(".rv").forEach(el => {
      const r = el.getBoundingClientRect();
      if(r.top < window.innerHeight && r.bottom > 0) el.classList.add("in");
    });
  }, 900);
}

/* ============================================================
   ENCYCLOPEDIE : RENDU ET FILTRES
   ============================================================ */
function renderEnc(){
  const box = $("#encg");
  const list = themes === "Tous" ? FICHES : FICHES.filter(f => f.th === themes);
  box.innerHTML = list.map(f => `
    <article class="card">
      <h3>${esc(f.t)}</h3>
      <p>${esc(f.d)}</p>
      <span class="tag">${esc(f.tag)}</span>
    </article>`).join("");
  observeAll();
}
let themes = "Tous";

function renderChips(){
  const all = ["Tous", ...Array.from(new Set(FICHES.map(f => f.th)))];
  $("#encChips").innerHTML = all.map(t =>
    `<button type="button" class="chip${t === "Tous" ? " on" : ""}" data-th="${esc(t)}">${esc(t)}</button>`
  ).join("");
  $$("#encChips .chip").forEach(b => {
    b.addEventListener("click", () => {
      themes = b.dataset.th;
      $$("#encChips .chip").forEach(x => x.classList.toggle("on", x === b));
      renderEnc(themes);
    });
  });
}

/* ============================================================
   BIBLIOTHEQUE ET GLOSSAIRE
   ============================================================ */
function renderBib(){
  $("#bibg").innerHTML = REFS.map((r, i) => `
    <article class="card">
      <div class="ref"><span class="num">${String(i + 1).padStart(2, "0")}</span><h3 style="min-height:0">${esc(r.t)}</h3></div>
      <p>${esc(r.d)}</p>
      <span class="tag">${esc(r.tag)}</span>
    </article>`).join("");
}

function renderGloss(){
  $("#gl").innerHTML = GLOSSAIRE.map(([t, d]) => `
    <div class="gl-item"><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join("");
}

/* ============================================================
   COMPTEURS ANIMES
   ============================================================ */
function initCounters(){
  const nums = $$("[data-count]");
  if(!nums.length) return;
  const run = el => {
    const target = Number(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || "";
    const dur = 1100;
    const start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if(p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if(!("IntersectionObserver" in window)){ nums.forEach(run); return; }
  const o = new IntersectionObserver(es => {
    es.forEach(e => {
      if(e.isIntersecting){ run(e.target); o.unobserve(e.target); }
    });
  }, {threshold: .4});
  nums.forEach(n => o.observe(n));
}

/* ============================================================
   MACHINE A ECRIRE (HERO)
   ============================================================ */
function initTyped(){
  const el = $("#typed");
  if(!el) return;
  const phrases = [
    "Comprendre les modèles qui apprennent.",
    "Distinguer promesses et limites réelles.",
    "Décoder les enjeux éthiques de l'IA.",
    "Réviser avec un assistant local."
  ];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduce){ el.textContent = phrases[0]; return; }
  let i = 0, j = 0, del = false;
  const tick = () => {
    const p = phrases[i];
    el.textContent = del ? p.slice(0, j--) : p.slice(0, j++);
    let wait = del ? 28 : 46;
    if(!del && j > p.length){ del = true; wait = 1600; }
    else if(del && j < 0){ del = false; j = 0; i = (i + 1) % phrases.length; wait = 320; }
    setTimeout(tick, wait);
  };
  tick();
}

/* ============================================================
   PARTICULES DU HERO (canvas léger)
   ============================================================ */
function initParticles(){
  const cv = $("#heroCanvas");
  if(!cv) return;
  const ctx = cv.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w = 0, h = 0, dpr = 1, pts = [], raf = null;

  const size = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = cv.clientWidth; h = cv.clientHeight;
    cv.width = Math.floor(w * dpr);
    cv.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(64, Math.max(22, Math.round(w / 26)));
    pts = Array.from({length: n}, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - .5) * .28,
      vy: (Math.random() - .5) * .28,
      r: Math.random() * 1.7 + .7
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    const light = document.documentElement.dataset.theme === "light";
    const dot = light ? "rgba(46,127,184,.55)" : "rgba(91,192,235,.75)";
    const line = light ? "rgba(46,127,184," : "rgba(91,192,235,";

    pts.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0 || p.x > w) p.vx *= -1;
      if(p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = dot;
      ctx.fill();

      for(let k = i + 1; k < pts.length; k++){
        const q = pts[k];
        const dx = p.x - q.x, dy = p.y - q.y;
        const d = Math.hypot(dx, dy);
        if(d < 120){
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = line + (0.16 * (1 - d / 120)).toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    });
    raf = requestAnimationFrame(draw);
  };

  size();
  if(reduce){
    // Version statique : un seul rendu, sans animation.
    pts.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(91,192,235,.6)"; ctx.fill();
    });
    return;
  }
  draw();
  window.addEventListener("resize", () => { size(); }, {passive: true});
  // Pause du rendu quand le hero n'est plus visible (économie de batterie).
  if("IntersectionObserver" in window){
    new IntersectionObserver(es => {
      es.forEach(e => {
        if(e.isIntersecting && !raf) raf = requestAnimationFrame(draw);
        else if(!e.isIntersecting && raf){ cancelAnimationFrame(raf); raf = null; }
      });
    }, {threshold: 0}).observe(cv);
  }
}

/* ============================================================
   ONDE AU CLIC SUR LES BOUTONS (ripple)
   ============================================================ */
function initRipple(){
  document.addEventListener("click", e => {
    const b = e.target.closest(".btn");
    if(!b) return;
    const r = b.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const s = document.createElement("span");
    s.className = "rip";
    s.style.width = s.style.height = size + "px";
    s.style.left = (e.clientX - r.left - size / 2) + "px";
    s.style.top = (e.clientY - r.top - size / 2) + "px";
    b.appendChild(s);
    setTimeout(() => s.remove(), 620);
  });
}