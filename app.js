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

/* ============================================================
   THEME CLAIR / SOMBRE
   ============================================================ */
function initTheme(){
  const html = document.documentElement;
  const saved = localStorage.getItem("isz-theme");
  if(saved === "light" || saved === "dark") html.dataset.theme = saved;

  const icon = $("#tIcon");
  const paint = () => {
    // L'icône devient un soleil en thème sombre, une lune en thème clair.
    if(html.dataset.theme === "light"){
      icon.innerHTML = '<path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/><circle cx="12" cy="12" r="4"/>';
    }else{
      icon.innerHTML = '<path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8z"/>';
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if(meta) meta.setAttribute("content", html.dataset.theme === "light" ? "#F4F7FB" : "#0B132B");
  };
  paint();

  $("#tBtn").addEventListener("click", () => {
    html.dataset.theme = html.dataset.theme === "light" ? "dark" : "light";
    localStorage.setItem("isz-theme", html.dataset.theme);
    paint();
  });
}

/* ============================================================
   NAVIGATION : MENU MOBILE, LIEN ACTIF, RETOUR EN HAUT
   ============================================================ */
function initNav(){
  const nav = $("#nav");
  const burger = $("#burger");

  const closeMenu = () => {
    nav.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  };
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(open));
  });
  $("#bnMenu").addEventListener("click", () => {
    burger.click();
  });
  nav.addEventListener("click", e => {
    if(e.target.tagName === "A") closeMenu();
  });

  // Lien actif selon la section visible
  const sections = $$("main section[id]");
  const setActive = id => {
    $$("#nav a").forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + id));
    $$("#bn a").forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + id));
  };
  if("IntersectionObserver" in window){
    const o = new IntersectionObserver(es => {
      es.forEach(e => { if(e.isIntersecting) setActive(e.target.id); });
    }, {rootMargin: "-45% 0px -50% 0px"});
    sections.forEach(s => o.observe(s));
  }

  const top = $("#top");
  top.addEventListener("click", () => window.scrollTo({top: 0, behavior: "smooth"}));
  window.addEventListener("scroll", () => {
    top.classList.toggle("show", window.scrollY > 600);
  }, {passive: true});

  $("#year").textContent = new Date().getFullYear();
}

/* ============================================================
   RECHERCHE GLOBALE
   ============================================================ */
function initSearch(){
  const wrap = $("#sWrap");
  const input = $("#sInput");
  const out = $("#sResults");
  const btn = $("#sBtn");

  // Index construit à partir des titres et des textes de la page.
  const index = [];
  $$("main section[id]").forEach(sec => {
    const secTitle = (sec.querySelector("h2")?.textContent || sec.id).trim();
    sec.querySelectorAll("h3, .gl-item dt").forEach(h => {
      const card = h.closest(".card, .gl-item");
      const txt = card ? card.textContent.replace(/\s+/g, " ").trim() : h.textContent;
      index.push({sec: sec.id, title: h.textContent.trim(), text: txt, sub: secTitle});
    });
    sec.querySelectorAll(".tl li").forEach(li => {
      index.push({
        sec: sec.id,
        title: li.querySelector(".yr")?.textContent || "Date clé",
        text: li.textContent.replace(/\s+/g, " ").trim(),
        sub: secTitle
      });
    });
  });

  const toggle = force => {
    const open = typeof force === "boolean" ? force : !wrap.classList.contains("open");
    wrap.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
    if(open){ input.focus(); }
    else { input.value = ""; out.innerHTML = ""; }
  };
  btn.addEventListener("click", () => toggle());

  const render = q => {
    const nq = norm(q);
    if(nq.length < 2){ out.innerHTML = '<li class="s-empty">Tapez au moins deux lettres.</li>'; return; }
    const hits = index
      .map(it => ({...it, hit: norm(it.text).includes(nq) || norm(it.title).includes(nq)}))
      .filter(it => it.hit)
      .slice(0, 9);

    if(!hits.length){
      out.innerHTML = '<li class="s-empty">Aucun résultat. Essayez « biais », « Turing » ou « RGPD ».</li>';
      return;
    }
    out.innerHTML = hits.map(it => {
      const cut = it.text.length > 96 ? it.text.slice(0, 96).trim() + "…" : it.text;
      return `<li><a href="#${esc(it.sec)}" data-close="1"><b>${esc(it.title)}</b><small>${esc(it.sub)} — ${esc(cut)}</small></a></li>`;
    }).join("");
    $$("#sResults a").forEach(a => a.addEventListener("click", () => toggle(false)));
  };

  input.addEventListener("input", () => render(input.value));
  document.addEventListener("keydown", e => {
    if(e.key === "Escape" && wrap.classList.contains("open")) toggle(false);
    // Raccourci « / » pour ouvrir la recherche
    if(e.key === "/" && !wrap.classList.contains("open") && document.activeElement.tagName !== "INPUT"){
      e.preventDefault(); toggle(true);
    }
  });
}

/* ============================================================
   QUIZ
   ============================================================ */
function initQuiz(){
  let i = 0, score = 0, locked = false, done = false;
  const qText = $("#qText"), qOpts = $("#qOpts"), qFb = $("#qFb");
  const qCount = $("#qCount"), qScoreTop = $("#qScoreTop"), qBar = $("#qBar");
  const next = $("#qNext");

  const paint = () => {
    locked = false; done = false;
    const q = QUIZ[i];
    qText.textContent = q.q;
    qFb.textContent = "";
    qCount.textContent = `Question ${i + 1} / ${QUIZ.length}`;
    qScoreTop.textContent = `Score : ${score}`;
    qBar.style.width = ((i) / QUIZ.length * 100) + "%";
    next.textContent = i === QUIZ.length - 1 ? "Voir le résultat" : "Question suivante";
    next.disabled = false;

    qOpts.innerHTML = "";
    q.o.forEach((txt, idx) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "q-opt";
      b.textContent = txt;
      b.addEventListener("click", () => pick(idx, b));
      qOpts.appendChild(b);
    });
  };

  const pick = (idx, btn) => {
    if(locked) return;
    locked = true;
    const q = QUIZ[i];
    const opts = $$(".q-opt", qOpts);
    opts.forEach((b, k) => {
      b.disabled = true;
      if(k === q.a) b.classList.add("good");
    });
    if(idx === q.a){
      score++;
      qFb.textContent = "Bonne réponse. " + q.e;
    }else{
      btn.classList.add("bad");
      qFb.textContent = "Réponse incorrecte. " + q.e;
    }
    qScoreTop.textContent = `Score : ${score}`;
  };

  next.addEventListener("click", () => {
    if(done) return;
    if(i < QUIZ.length - 1){ i++; paint(); return; }
    // Fin du quiz : on affiche le bilan
    done = true;
    qBar.style.width = "100%";
    qCount.textContent = "Terminé";
    $("#qScoreEnd").textContent = `Résultat : ${score} / ${QUIZ.length}`;
    qText.textContent = score >= 6 ? "Très bon niveau : le chapitre est acquis." : "À consolider : relisez le cours puis recommencez.";
    qOpts.innerHTML = "";
    qFb.textContent = score >= 6
      ? "Vous maîtrisez les notions principales."
      : "Concentrez-vous sur la chronologie et sur la différence entre hallucination et biais.";
    next.disabled = true;
  });

  $("#qReset").addEventListener("click", () => {
    i = 0; score = 0; done = false;
    $("#qScoreEnd").textContent = "";
    paint();
  });

  paint();
}

/* ============================================================
   ISZ AI : CONVERSATION
   ============================================================ */
function initChat(){
  const log = $("#log"), form = $("#chatForm"), input = $("#chatInput"), sugg = $("#sugg");
  const KEY = "isz-chat-history";
  let history = [];

  const addMsg = (who, text, save = true) => {
    const d = document.createElement("div");
    d.className = "msg " + (who === "me" ? "me" : "bot");
    d.textContent = text;
    if(who === "bot"){
      const meta = document.createElement("span");
      meta.className = "meta";
      meta.textContent = "ISZ AI — réponse locale";
      d.appendChild(meta);
    }
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    if(save){ history.push({who, text}); persist(); }
  };

  const persist = () => {
    try{ localStorage.setItem(KEY, JSON.stringify(history.slice(-40))); }catch(e){}
  };

  const suggestions = ["C'est quoi le machine learning ?", "Explique le biais", "Comment réviser ?"];
  const paintSugg = () => {
    sugg.innerHTML = "";
    suggestions.forEach(s => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = s;
      b.addEventListener("click", () => send(s));
      sugg.appendChild(b);
    });
  };

  let busy = false;
  const send = q => {
    const text = String(q || "").trim();
    if(!text || busy) return;
    addMsg("me", text);
    input.value = "";
    busy = true;

    const bubble = document.createElement("div");
    bubble.className = "msg bot typing";
    bubble.textContent = "ISZ AI réfléchit";
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;

    setTimeout(() => {
      const res = answer(text);
      bubble.remove();
      addMsg("bot", res.text);
      busy = false;
    }, 420);
  };

  form.addEventListener("submit", e => {
    e.preventDefault();
    send(input.value);
  });

  // Les 3 boutons rapides en haut du chat
  $$(".quick button").forEach(b => {
    b.addEventListener("click", () => send(b.dataset.q));
  });

  $("#clearChat").addEventListener("click", () => {
    history = [];
    try{ localStorage.removeItem(KEY); }catch(e){}
    log.innerHTML = "";
    addMsg("bot", "Historique effacé. Posez une nouvelle question quand vous voulez.", false);
  });

  // Restauration de la conversation précédente
  let restored = false;
  try{ restored = JSON.parse(localStorage.getItem(KEY) || "[]"); }catch(e){ restored = []; }
  if(Array.isArray(restored) && restored.length){
    restored.forEach(m => {
      const d = document.createElement("div");
      d.className = "msg " + (m.who === "me" ? "me" : "bot");
      d.textContent = m.text;
      log.appendChild(d);
    });
    history = restored;
  }else{
    addMsg("bot", "Bonjour ! Je suis ISZ AI, l'assistant de ce cours.\n\nPosez-moi une question sur l'intelligence artificielle, ou utilisez l'un des trois boutons ci-dessus.", false);
  }
  paintSugg();
}

/* ============================================================
   MODE PRESENTATION
   ============================================================ */
function initPres(){
  const box = $("#pres"), body = $("#presBody"), count = $("#presCount");
  const slides = [
    {t:"L'intelligence artificielle", b:"Des techniques qui permettent à une machine de percevoir, raisonner, apprendre et décider.<ul><li>IA faible : spécialisée, disponible aujourd'hui.</li><li>IA forte : hypothétique, non réalisée.</li></ul>"},
    {t:"Repères historiques", b:"<ul><li>1950 : test de Turing.</li><li>1956 : conférence de Dartmouth.</li><li>1997 : Deep Blue bat Kasparov.</li><li>2012 : deep learning en reconnaissance d'images.</li><li>2022 : essor de l'IA générative.</li></ul>"},
    {t:"Comment ça apprend", b:"<ul><li>Supervisé : exemples étiquetés.</li><li>Non supervisé : regroupements sans étiquettes.</li><li>Renforcement : récompense et pénalité.</li></ul>"},
    {t:"Limites à connaître", b:"<ul><li>Hallucinations : réponses fausses mais assurées.</li><li>Biais : déséquilibres hérités des données.</li><li>Boîte noire : décisions difficiles à expliquer.</li></ul>"},
    {t:"Enjeux éthiques", b:"<ul><li>Protection des données personnelles (RGPD).</li><li>Responsabilité en cas d'erreur.</li><li>Empreinte énergétique des grands modèles.</li></ul>"}
  ];
  let k = 0;

  const paint = () => {
    body.innerHTML = `<h3>${slides[k].t}</h3><div class="slide-body">${slides[k].b}</div>`;
    count.textContent = `${k + 1} / ${slides.length}`;
    $("#presPrev").disabled = k === 0;
    $("#presNext").textContent = k === slides.length - 1 ? "Terminer" : "Suivant";
  };
  const open = () => { k = 0; box.classList.add("on"); document.body.style.overflow = "hidden"; paint(); };
  const close = () => { box.classList.remove("on"); document.body.style.overflow = ""; };

  $("#pBtn").addEventListener("click", open);
  $("#presX").addEventListener("click", close);
  $("#presPrev").addEventListener("click", () => { if(k > 0){ k--; paint(); } });
  $("#presNext").addEventListener("click", () => {
    if(k < slides.length - 1){ k++; paint(); } else close();
  });
  document.addEventListener("keydown", e => {
    if(!box.classList.contains("on")) return;
    if(e.key === "Escape") close();
    if(e.key === "ArrowRight" && k < slides.length - 1){ k++; paint(); }
    if(e.key === "ArrowLeft" && k > 0){ k--; paint(); }
  });
}

/* ============================================================
   INITIALISATION
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  renderChips();
  renderEnc();
  renderBib();
  renderGloss();
  initTheme();
  initNav();
  initSearch();
  initQuiz();
  initChat();
  initPres();
  initCounters();
  initTyped();
  initParticles();
  initRipple();
  observeAll();
  revealFallback();
});
