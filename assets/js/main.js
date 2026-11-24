/* Prestat Services — interactions du site */
(() => {
  const doc = document.documentElement;
  doc.classList.remove("no-js");

  /* ==========================================================
     STATISTIQUES DE VISITE (Umami)
     Coller ici l'identifiant du site fourni par Umami
     (Paramètres > Sites web > Modifier > « Website ID »).
     Tant que la valeur est vide, aucune statistique n'est envoyée.
     ========================================================== */
  const UMAMI_ID = "";
  const SITE_DOMAINS = "www.prestat-services-elagage.fr,prestat-services-elagage.fr";
  if (UMAMI_ID) {
    const sc = document.createElement("script");
    sc.defer = true;
    sc.src = "https://cloud.umami.is/script.js";
    sc.dataset.websiteId = UMAMI_ID;
    sc.dataset.domains = SITE_DOMAINS; // ne compte que le vrai site, pas les aperçus
    document.head.appendChild(sc);
  }
  const track = (name, data) => { try { window.umami && window.umami.track(name, data); } catch { /* statistiques indisponibles */ } };
  const page = () => (location.pathname.split("/").pop() || "index.html").replace(".html", "") || "index";
  const where = (el) => {
    const zones = [[".topbar", "Bandeau du haut"], [".site-header", "En-tête"], [".mobile-menu", "Menu mobile"], [".mobile-bar", "Barre du bas (mobile)"],
      [".fab", "Bouton flottant"], [".site-footer", "Pied de page"], [".cta", "Encadré d'appel"], [".hero", "Haut de l'accueil"],
      [".page-hero", "Haut de page"], [".contact-cards", "Cartes contact"], [".mega", "Menu Services"], [".zone-side, #town-hits", "Zone d'intervention"]];
    for (const [sel, name] of zones) if (el.closest(sel)) return name;
    return "Contenu de la page";
  };
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a) return;
    const href = a.getAttribute("href");
    const info = { emplacement: where(a), page: page() };
    if (href.startsWith("tel:")) track("Clic Appeler", info);
    else if (href.startsWith("mailto:")) track(/devis/i.test(decodeURIComponent(href)) ? "Clic E-mail devis" : "Clic E-mail", info);
    else if (/contact\.html.*#devis/.test(href)) track("Clic Formulaire de devis", info);
    else if (/^https?:/.test(href) && !href.includes(location.host)) track("Lien externe", { lien: href, page: page() });
  }, true);
  document.querySelectorAll(".faq details").forEach((d) => d.addEventListener("toggle", () => {
    if (d.open) track("Question consultée", { question: d.querySelector("summary").textContent.trim() });
  }));
  document.querySelectorAll("details.zone-more").forEach((d) => d.addEventListener("toggle", () => {
    if (d.open) track("Liste dépliée", { liste: d.querySelector("summary").textContent.trim() });
  }));




  /* ---------- Chaque nouvelle page s'ouvre tout en haut ----------
     (sauf si le lien vise une section précise, ex. contact.html#devis).
     scrollIntoView fait aussi remonter la fenêtre qui contient le site
     quand il est affiché dans un cadre (aperçu). */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  const goTop = () => {
    if (location.hash && document.querySelector(location.hash)) return;
    window.scrollTo(0, 0);
    const first = document.querySelector(".topbar") || document.querySelector(".site-header");
    if (first) { try { first.scrollIntoView({ block: "start", behavior: "instant" }); } catch { first.scrollIntoView(true); } }
  };
  goTop();
  window.addEventListener("pageshow", goTop);

  /* ---------- Boutons Appeler / E-mail ----------
     Sur le vrai site, les liens tel: et mailto: ouvrent directement le téléphone
     et la messagerie. Quand le site est affiché dans un cadre (aperçu), le cadre
     bloque ces liens : on les ouvre alors via une nouvelle fenêtre. */
  const framed = (() => { try { return window.self !== window.top; } catch { return true; } })();
  const openApp = (href) => {
    if (!framed) { window.location.href = href; return; }
    const w = window.open(href, "_blank");
    if (!w) window.location.href = href;
  };
  if (framed) {
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="tel:"], a[href^="mailto:"]');
      if (!a) return;
      e.preventDefault();
      openApp(a.getAttribute("href"));
    });
  }

  /* ---------- En-tête qui se compacte au défilement ---------- */
  const header = document.querySelector(".site-header");
  const fab = document.querySelector(".fab");
  const onScroll = () => {
    const y = window.scrollY;
    header && header.classList.toggle("is-scrolled", y > 20);
    fab && fab.classList.toggle("is-visible", y > 500);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  const burger = document.querySelector(".burger");
  const menu = document.getElementById("mobile-menu");
  const setMenu = (open) => {
    if (!burger || !menu) return;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    menu.classList.toggle("is-open", open);
    menu.toggleAttribute("inert", !open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  if (burger && menu) {
    menu.setAttribute("inert", "");
    burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
    window.matchMedia("(min-width: 1101px)").addEventListener("change", (m) => m.matches && setMenu(false));
  }

  /* ---------- Méga-menu Services (clic / tactile / clavier) ---------- */
  document.querySelectorAll(".nav__item--mega").forEach((item) => {
    const btn = item.querySelector("button");
    btn.addEventListener("click", () => {
      const open = !item.classList.contains("is-open");
      item.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
    item.addEventListener("mouseleave", () => { item.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); });
    document.addEventListener("click", (e) => { if (!item.contains(e.target)) { item.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); } });
    item.addEventListener("keydown", (e) => { if (e.key === "Escape") { item.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); btn.focus(); } });
  });

  /* ---------- Apparition au défilement ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Compteurs animés ---------- */
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const co = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target; co.unobserve(el);
        const end = +el.dataset.count, suffix = el.dataset.suffix || "", prefix = el.dataset.prefix || "";
        if (reduce) { el.textContent = prefix + end + suffix; return; }
        const t0 = performance.now(), dur = 1400;
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / dur), eased = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + Math.round(end * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    counters.forEach((c) => co.observe(c));
  }

  /* ---------- Galerie : filtres + visionneuse ---------- */
  const items = [...document.querySelectorAll(".gallery__item")];
  const filters = document.querySelectorAll("[data-filter]");
  filters.forEach((chip) => {
    chip.addEventListener("click", () => {
      const f = chip.dataset.filter;
      filters.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      track("Filtre galerie", { filtre: chip.textContent.replace(/\d+/g, "").trim() });
      items.forEach((it) => it.classList.toggle("is-hidden", f !== "all" && !it.dataset.cat.split(" ").includes(f)));
    });
  });

  const lb = document.getElementById("lightbox");
  if (lb && items.length) {
    const img = lb.querySelector("img"), cap = lb.querySelector(".lightbox__caption"), cnt = lb.querySelector(".lb-count");
    let list = [], idx = 0;
    const show = (i) => {
      idx = (i + list.length) % list.length;
      const it = list[idx], thumb = it.querySelector("img");
      img.src = it.dataset.full || thumb.getAttribute("src").replace("-800.webp", "-1600.webp");
      img.alt = thumb.alt;
      cap.textContent = it.querySelector("figcaption")?.textContent || thumb.alt;
      cnt.textContent = `${idx + 1} / ${list.length}`;
      img.style.animation = "none"; img.offsetHeight; img.style.animation = "";
    };
    items.forEach((it) => it.addEventListener("click", () => {
      list = items.filter((x) => !x.classList.contains("is-hidden") && x.closest("[data-gallery]") === it.closest("[data-gallery]"));
      show(list.indexOf(it));
      lb.showModal();
      track("Photo agrandie", { photo: cap.textContent, page: page() });
    }));
    lb.querySelector(".lb-prev").addEventListener("click", () => show(idx - 1));
    lb.querySelector(".lb-next").addEventListener("click", () => show(idx + 1));
    lb.querySelector(".lb-close").addEventListener("click", () => lb.close());
    lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lightbox__stage")) lb.close(); });
    lb.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") show(idx - 1); if (e.key === "ArrowRight") show(idx + 1); });
    let x0 = null;
    lb.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }

  /* ---------- Zone d'intervention : recherche commune / hameau / code postal ---------- */
  const search = document.getElementById("town-search");
  if (search) {
    const out = document.getElementById("town-result");
    const hits = document.getElementById("town-hits");
    const norm = (s) => s.toLowerCase().replace(/œ/g, "oe").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\bst\b/g, "saint").replace(/\bste\b/g, "sainte").replace(/[^a-z0-9]+/g, " ").trim();
    const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const data = [...document.querySelectorAll(".zl")].map((li) => ({
      n: li.dataset.n, d: +li.dataset.d, k: li.dataset.k, p: li.dataset.p || "", cp: li.dataset.cp || "", key: norm(li.dataset.n),
    }));
    const label = { commune: "commune", hameau: "hameau", "lieu-dit": "lieu-dit", "ancienne commune": "ancienne commune" };
    let searchTimer;
    search.addEventListener("input", () => {
      const raw = search.value.trim(), q = norm(raw);
      clearTimeout(searchTimer);
      hits.innerHTML = "";
      if (q.length < 2) { out.textContent = ""; out.className = "search-result"; return; }
      const isCp = /^\d{2,5}$/.test(q);
      const found = data.filter((x) => isCp ? x.cp.startsWith(q) : x.key.includes(q))
        .map((x) => ({ ...x, score: (x.key === q ? 0 : x.key.startsWith(q) ? 1 : 2) + (x.k === "commune" ? 0 : 0.5) }))
        .sort((a, b) => a.score - b.score || a.d - b.d);
      if (!found.length) {
        out.textContent = "Lieu non trouvé dans notre liste. Appelez-nous : si vous êtes à environ 40 km de Romilly-sur-Seine, nous venons sûrement !";
        out.className = "search-result ko";
        searchTimer = setTimeout(() => track("Recherche commune", { recherche: raw, resultat: "Non trouvée" }), 1500);
        return;
      }
      out.textContent = found.length > 1 ? `✓ Bonne nouvelle : nous intervenons dans ces ${found.length} lieux !` : "✓ Bonne nouvelle : nous intervenons chez vous !";
      out.className = "search-result ok";
      searchTimer = setTimeout(() => track("Recherche commune", { recherche: raw, resultat: "Trouvée", lieu: found[0].n }), 1500);
      const max = 8;
      hits.innerHTML = found.slice(0, max).map((x) => {
        const sub = x.k === "commune" ? `commune${x.cp ? " · " + x.cp : ""}` : `${label[x.k] || x.k} · ${esc(x.p)}`;
        return `<li><svg class="icon"><use href="#i-check"/></svg><span><strong>${esc(x.n)}</strong><br><span>${sub}</span></span><em>${x.d} km</em></li>`;
      }).join("") + (found.length > max ? `<li class="more">+ ${found.length - max} autres résultats, précisez votre recherche</li>` : "");
    });
  }

  /* ---------- Formulaire de devis → e-mail pré-rempli ---------- */
  const form = document.getElementById("devis-form");
  if (form) {
    const params = new URLSearchParams(location.search);
    const pre = params.get("service");
    if (pre) form.querySelectorAll('input[name="service"]').forEach((c) => { if (c.dataset.slug === pre) c.checked = true; });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const d = new FormData(form);
      const services = d.getAll("service");
      const lines = [
        "Bonjour,",
        "",
        "Je souhaite obtenir un devis gratuit.",
        "",
        `Nom : ${d.get("nom")}`,
        `Téléphone : ${d.get("tel")}`,
        d.get("email") ? `E-mail : ${d.get("email")}` : null,
        `Commune : ${d.get("commune")}`,
        services.length ? `Prestation(s) : ${services.join(", ")}` : null,
        "",
        "Description des travaux :",
        d.get("message"),
        "",
        "Merci et à bientôt.",
      ].filter((l) => l !== null);
      const subject = `Demande de devis${services.length ? " – " + services.join(", ") : ""} – ${d.get("commune")}`;
      track("Demande de devis (formulaire)", { prestations: services.join(", ") || "Non précisé", commune: d.get("commune") });
      openApp(`mailto:prestatservices10@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`);
      const ok = document.getElementById("form-ok");
      if (ok) ok.hidden = false;
    });
  }

  /* ---------- Copier l'adresse e-mail ---------- */
  document.querySelectorAll("[data-copy]").forEach((b) => {
    b.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(b.dataset.copy);
        track("Copie adresse e-mail", { page: page() });
        const t = b.textContent; b.textContent = "Adresse copiée ✓";
        setTimeout(() => (b.textContent = t), 2000);
      } catch { /* presse-papiers indisponible */ }
    });
  });

  /* ---------- Année du pied de page ---------- */
  document.querySelectorAll("[data-year]").forEach((y) => (y.textContent = new Date().getFullYear()));
})();
