/* =========================================================
   ATLAS CLEAN — Interactions (JavaScript natif, sans dépendance)
   ========================================================= */
(function () {
  "use strict";

  var CFG = window.SITE_CONFIG || { contact: {}, social: {}, company: {} };
  var doc = document.documentElement;
  doc.classList.remove("no-js");
  doc.classList.add("js");

  /* Textes de l'interface (prêts pour une future traduction) */
  var STRINGS = {
    fr: {
      toComplete: "À compléter",
      required: "Ce champ est obligatoire.",
      phoneInvalid: "Indiquez un numéro valide (ex. 06 12 34 56 78 ou +212 6 12 34 56 78).",
      emailInvalid: "Indiquez une adresse e-mail valide.",
      dateInvalid: "Choisissez une date à partir d'aujourd'hui.",
      formErrors: "Certains champs doivent être corrigés avant de continuer.",
      copied: "Message copié",
      copyFail: "Sélectionnez le texte puis copiez-le manuellement.",
      waIntro: "Bonjour, je souhaite obtenir un devis pour vos services de nettoyage.",
      waTitle: "*Demande de devis*",
      waFields: {
        name: "Nom", phone: "Téléphone", email: "E-mail", service: "Prestation",
        city: "Ville", surface: "Surface estimée", frequency: "Fréquence",
        date: "Date souhaitée", message: "Informations complémentaires"
      },
      waThanks: "Merci."
    }
  };
  var lang = (doc.getAttribute("lang") || CFG.defaultLang || "fr").slice(0, 2);
  var T = STRINGS[lang] || STRINGS.fr;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Liens propres : compatibilité ouverture locale / aperçu ----------
     Sur l'hébergement final (siteUrl renseigné), /services/ fonctionne nativement.
     En local (file://) ou en aperçu, on ajoute index.html pour que chaque lien s'ouvre. */
  (function fixLinks() {
    var onProd = false;
    try { onProd = !!CFG.siteUrl && new URL(CFG.siteUrl).host === location.host; } catch (e) {}
    if (onProd) return;
    $$("a[href]").forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href || /^(https?:|mailto:|tel:|#|javascript:|data:)/i.test(href)) return;
      var m = href.match(/^([^?#]*)([?#].*)?$/);
      var path = m[1], rest = m[2] || "";
      if (path === "" ) return;
      if (path.slice(-1) === "/") a.setAttribute("href", path + "index.html" + rest);
      else if (path === "." || path === "..") a.setAttribute("href", path + "/index.html" + rest);
    });
  })();

  /* ---------- Données de configuration ---------- */
  function setText(key, value) {
    $$('[data-cfg="' + key + '"]').forEach(function (el) {
      if (value) { el.textContent = value; el.classList.remove("placeholder-val"); }
      else { el.textContent = el.getAttribute("data-placeholder") || T.toComplete; el.classList.add("placeholder-val"); }
    });
  }
  var c = CFG.contact || {};
  setText("phone", c.phone);
  setText("email", c.email);
  setText("address", c.address);
  setText("hours", c.hours);
  setText("company-name", (CFG.company || {}).name);
  $$('[data-cfg-href="phone"]').forEach(function (a) {
    if (c.phone) a.setAttribute("href", "tel:" + c.phone.replace(/[^\d+]/g, ""));
    else a.removeAttribute("href");
  });
  $$('[data-cfg-href="email"]').forEach(function (a) {
    if (c.email) a.setAttribute("href", "mailto:" + c.email);
    else a.removeAttribute("href");
  });
  $$("[data-social]").forEach(function (a) {
    var url = (CFG.social || {})[a.getAttribute("data-social")];
    if (url) { a.setAttribute("href", url); a.setAttribute("target", "_blank"); a.setAttribute("rel", "noopener"); }
    else { a.setAttribute("href", "#"); a.setAttribute("aria-disabled", "true"); a.setAttribute("title", a.getAttribute("aria-label") + " (lien à compléter)");
      a.addEventListener("click", function (e) { e.preventDefault(); }); }
  });
  $$(".demo-bar").forEach(function (el) { if (CFG.demoMode === false) el.remove(); });
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- En-tête ---------- */
  var header = $(".site-header");
  var toTop = $(".to-top");
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (toTop) toTop.classList.toggle("is-visible", y > 700);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    var target = $("#main"); if (target) target.focus({ preventScroll: true });
  });

  /* ---------- Menu mobile ---------- */
  var toggle = $(".menu-toggle");
  var menu = $("#mobile-menu");
  var lastFocus = null;
  function focusables(root) {
    return $$('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', root)
      .filter(function (el) { return el.offsetParent !== null; });
  }
  function openMenu() {
    lastFocus = document.activeElement;
    menu.classList.add("is-open"); menu.removeAttribute("inert"); menu.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
    var f = focusables(menu); if (f[1]) setTimeout(function () { f[1].focus(); }, 50);
  }
  function closeMenu(restore) {
    menu.classList.remove("is-open"); menu.setAttribute("inert", ""); menu.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    if (restore !== false && lastFocus) lastFocus.focus();
  }
  if (toggle && menu) {
    menu.setAttribute("inert", "");
    toggle.addEventListener("click", function () { menu.classList.contains("is-open") ? closeMenu() : openMenu(); });
    $$("[data-close-menu]", menu).forEach(function (b) { b.addEventListener("click", function () { closeMenu(); }); });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { closeMenu(false); }); });
    menu.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closeMenu(); return; }
      if (e.key !== "Tab") return;
      var f = focusables(menu); if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    window.addEventListener("resize", function () { if (window.innerWidth >= 1120 && menu.classList.contains("is-open")) closeMenu(false); });
  }

  /* ---------- Apparition au défilement ---------- */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
    /* Sécurité : tout afficher si l'observateur ne s'est pas déclenché */
    setTimeout(function () { reveals.forEach(function (el) { if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-in"); }); }, 1200);
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- FAQ ---------- */
  $$(".faq-item").forEach(function (item, i) {
    var btn = $(".faq-btn", item), panel = $(".faq-panel", item);
    if (!btn || !panel) return;
    var id = panel.id || ("faq-panel-" + i);
    panel.id = id; btn.setAttribute("aria-controls", id);
    function set(open) {
      item.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      panel.setAttribute("aria-hidden", open ? "false" : "true");
      if (open) panel.removeAttribute("inert"); else panel.setAttribute("inert", "");
    }
    set(item.classList.contains("is-open"));
    btn.addEventListener("click", function () { set(!item.classList.contains("is-open")); });
  });

  /* ---------- Galerie : filtres + visionneuse ---------- */
  var gallery = $("[data-gallery]");
  if (gallery) {
    var items = $$(".g-item", gallery);
    var filterBtns = $$(".filter-btn");
    filterBtns.forEach(function (b) {
      var f = b.getAttribute("data-filter");
      var n = f === "all" ? items.length : items.filter(function (it) { return it.getAttribute("data-cat") === f; }).length;
      var cnt = $(".count", b); if (cnt) cnt.textContent = n;
      b.addEventListener("click", function () {
        filterBtns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        items.forEach(function (it) { it.hidden = !(f === "all" || it.getAttribute("data-cat") === f); });
        var live = $("#gallery-status"); if (live) live.textContent = (f === "all" ? items.length : n) + " visuel(s) affiché(s)";
      });
    });

    var lb = $("#lightbox");
    var lbImg = lb && $(".lb-stage img", lb);
    var lbCap = lb && $(".lb-caption", lb);
    var lbCount = lb && $(".lb-counter", lb);
    var current = 0, opener = null;
    function visibleItems() { return items.filter(function (it) { return !it.hidden; }); }
    function show(idx) {
      var vis = visibleItems(); if (!vis.length) return;
      current = (idx + vis.length) % vis.length;
      var it = vis[current], img = $("img", it);
      lbImg.src = img.getAttribute("data-full") || img.currentSrc || img.src;
      lbImg.alt = img.alt;
      lbCap.innerHTML = "";
      var t = document.createElement("span"); t.textContent = it.getAttribute("data-title") || img.alt;
      var s = document.createElement("small"); s.textContent = (it.getAttribute("data-cat-label") || "") + " · Visuel de démonstration";
      lbCap.appendChild(t); lbCap.appendChild(s);
      lbCount.textContent = (current + 1) + " / " + vis.length;
    }
    function openLb(item) {
      opener = $(".g-btn", item);
      show(visibleItems().indexOf(item));
      if (typeof lb.showModal === "function") lb.showModal(); else lb.setAttribute("open", "");
      document.body.classList.add("menu-open");
      var close = $("[data-lb-close]", lb); if (close) close.focus();
    }
    function closeLb() {
      if (typeof lb.close === "function" && lb.open) lb.close(); else lb.removeAttribute("open");
    }
    if (lb) {
      lb.addEventListener("close", function () { document.body.classList.remove("menu-open"); if (opener) opener.focus(); });
      items.forEach(function (it) { $(".g-btn", it).addEventListener("click", function () { openLb(it); }); });
      $("[data-lb-close]", lb).addEventListener("click", closeLb);
      $("[data-lb-prev]", lb).addEventListener("click", function () { show(current - 1); });
      $("[data-lb-next]", lb).addEventListener("click", function () { show(current + 1); });
      lb.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") { e.preventDefault(); show(current - 1); }
        if (e.key === "ArrowRight") { e.preventDefault(); show(current + 1); }
        if (e.key === "Escape" && !lb.showModal) closeLb();
      });
      $(".lb-stage", lb).addEventListener("click", function (e) { if (e.target === e.currentTarget) closeLb(); });
      var sx = null;
      lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
      lb.addEventListener("touchend", function (e) {
        if (sx === null) return; var dx = e.changedTouches[0].clientX - sx;
        if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1)); sx = null;
      });
    }
  }

  /* ---------- Carte des zones ---------- */
  $$("[data-zone]").forEach(function (li) {
    var key = li.getAttribute("data-zone");
    function on(state) {
      li.classList.toggle("is-active", state);
      $$('.city[data-city="' + key + '"]').forEach(function (c) { c.classList.toggle("is-active", state); });
    }
    li.addEventListener("mouseenter", function () { on(true); });
    li.addEventListener("mouseleave", function () { on(false); });
    li.addEventListener("focusin", function () { on(true); });
    li.addEventListener("focusout", function () { on(false); });
  });

  /* ---------- WhatsApp ---------- */
  var waNumber = String((CFG.contact || {}).whatsapp || "").replace(/\D/g, "");
  var modal = $("#wa-modal");
  function waUrl(msg) { return "https://wa.me/" + waNumber + "?text=" + encodeURIComponent(msg); }
  function openDemo(msg) {
    if (!modal) return;
    $("pre", modal).textContent = msg;
    if (typeof modal.showModal === "function") modal.showModal(); else modal.setAttribute("open", "");
  }
  function sendWhatsApp(msg) {
    if (waNumber.length >= 9) {
      var w = window.open(waUrl(msg), "_blank", "noopener");
      if (!w) location.href = waUrl(msg);
    } else {
      openDemo(msg);
    }
  }
  $$("[data-wa]").forEach(function (el) {
    if (waNumber.length >= 9 && el.tagName === "A") { el.setAttribute("href", waUrl(CFG.whatsappDefaultMessage || T.waIntro)); el.setAttribute("target", "_blank"); el.setAttribute("rel", "noopener"); }
    el.addEventListener("click", function (e) {
      if (waNumber.length >= 9 && el.tagName === "A") return;
      e.preventDefault(); sendWhatsApp(CFG.whatsappDefaultMessage || T.waIntro);
    });
  });
  if (modal) {
    $$("[data-modal-close]", modal).forEach(function (b) { b.addEventListener("click", function () { modal.close ? modal.close() : modal.removeAttribute("open"); }); });
    modal.addEventListener("click", function (e) { if (e.target === modal) modal.close(); });
    var copyBtn = $("[data-copy]", modal);
    if (copyBtn) copyBtn.addEventListener("click", function () {
      var pre = $("pre", modal), label = copyBtn.querySelector("span");
      var done = function (ok) { label.textContent = ok ? T.copied : T.copyFail; setTimeout(function () { label.textContent = "Copier le message"; }, 2500); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(pre.textContent).then(function () { done(true); }, function () { selectText(pre); done(false); });
      } else { selectText(pre); done(false); }
    });
  }
  function selectText(el) { var r = document.createRange(); r.selectNodeContents(el); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); }

  /* ---------- Formulaire de devis ---------- */
  $$("form[data-quote]").forEach(function (form) {
    var dateInput = $('input[type="date"]', form);
    var today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    var todayStr = today.toISOString().slice(0, 10);
    if (dateInput) dateInput.min = todayStr;

    /* Préselection depuis l'URL : ?service=bureaux */
    try {
      var params = new URLSearchParams(location.search);
      var svc = params.get("service");
      var sel = $('select[name="service"]', form);
      if (svc && sel) $$("option", sel).forEach(function (o) { if (o.getAttribute("data-key") === svc) sel.value = o.value; });
    } catch (e) {}

    function fieldOf(input) { return input.closest(".field"); }
    function setError(input, msg) {
      var f = fieldOf(input), err = f && $(".field-error", f);
      if (!f) return;
      f.classList.toggle("has-error", !!msg);
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      if (err) err.textContent = msg || "";
    }
    function validate(input) {
      var v = (input.value || "").trim();
      if (input.required && !v) return T.required;
      if (input.name === "phone" && v) {
        var digits = v.replace(/[\s.\-()]/g, "");
        if (!/^(\+212|00212|0)[5-7]\d{8}$/.test(digits) && !/^\+?\d{9,15}$/.test(digits)) return T.phoneInvalid;
      }
      if (input.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return T.emailInvalid;
      if (input.type === "date" && v && v < todayStr) return T.dateInvalid;
      return "";
    }
    var controls = $$("input, select, textarea", form).filter(function (el) { return el.name; });
    controls.forEach(function (el) {
      el.addEventListener("blur", function () { if (el.value || fieldOf(el).classList.contains("has-error")) setError(el, validate(el)); });
      el.addEventListener("input", function () { if (fieldOf(el).classList.contains("has-error")) setError(el, validate(el)); });
      el.addEventListener("change", function () { if (fieldOf(el).classList.contains("has-error")) setError(el, validate(el)); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstBad = null;
      controls.forEach(function (el) { var m = validate(el); setError(el, m); if (m && !firstBad) firstBad = el; });
      var alert = $(".form-alert", form);
      if (firstBad) {
        if (alert) { alert.hidden = false; alert.textContent = T.formErrors; }
        firstBad.focus();
        return;
      }
      if (alert) alert.hidden = true;

      var data = {};
      controls.forEach(function (el) { data[el.name] = (el.value || "").trim(); });
      if (data.date) {
        var p = data.date.split("-"); data.date = p[2] + "/" + p[1] + "/" + p[0];
      }
      var L = T.waFields, lines = [T.waIntro, "", T.waTitle];
      ["name", "phone", "email", "service", "city", "surface", "frequency", "date"].forEach(function (k) {
        if (data[k]) lines.push("• " + L[k] + " : " + data[k]);
      });
      if (data.message) { lines.push(""); lines.push(L.message + " :"); lines.push(data.message); }
      lines.push(""); lines.push(T.waThanks);
      sendWhatsApp(lines.join("\n"));
    });
  });
})();
