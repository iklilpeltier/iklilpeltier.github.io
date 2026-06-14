/* =========================================================
   Portfolio Iklil Peltier — Interactions
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Année du footer ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Thème clair / sombre ---------- */
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
  }
  // Préférence système au premier chargement (pas de stockage : non supporté ici)
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");

  if (toggle) {
    toggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  /* ---------- Header : bordure au scroll ---------- */
  var header = document.getElementById("header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var menuBtn = document.getElementById("menu-btn");
  var mobileMenu = document.getElementById("mobile-menu");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", function () {
      var open = mobileMenu.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileMenu.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Apparition au scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Barres de compétences (animation à l'apparition) ---------- */
  var bars = document.querySelectorAll(".bar > i");
  if ("IntersectionObserver" in window) {
    var barObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.style.width = (el.getAttribute("data-w") || 0) + "%";
          barObserver.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    bars.forEach(function (b) { barObserver.observe(b); });
  } else {
    bars.forEach(function (b) { b.style.width = (b.getAttribute("data-w") || 0) + "%"; });
  }

  /* ---------- Bilans par année ---------- */
  var bilans = {
    "1": {
      stats: [
        ["10+", "Projets réalisés"],
        ["5", "Langages découverts"],
        ["SAS", "Coup de cœur"],
        ["2025", "Alternance signée"]
      ],
      html: [
        ["Pourquoi ce BUT ?", "Après avoir étudié en détail le programme du BUT Science des Données, j'ai senti qu'il correspondait à mes intérêts et aux compétences développées au lycée. Titulaire d'un bac général avec les spécialités Mathématiques et NSI, j'avais déjà un goût prononcé pour les données, la logique et la programmation : le BUT était la suite naturelle."],
        ["Bilan global", "Cette première année a été très positive, sur le plan académique comme personnel. Je me suis senti à l'aise avec les contenus, même s'il fallait faire preuve de rigueur et d'implication. Les statistiques et l'outil SAS ont été mes disciplines préférées ; la communication et certains aspects de la programmation du second semestre, plus exigeants."],
        ["Autonomie et organisation", "Au-delà des langages, j'ai gagné en autonomie. Vivre seul, loin du cadre du lycée, m'a obligé à structurer mes journées, mieux gérer mon temps et travailler de façon plus indépendante."],
        ["Objectifs atteints", "Mes deux objectifs de l'année — valider mon année et décrocher une alternance — ont été atteints. Je suis particulièrement fier du tableau de bord du concours DataViz, mené avec sérieux et motivation."],
        ["Et la suite", "L'an prochain, je poursuis le BUT en alternance, contrat signé, sur le parcours EMS qui allie analyse statistique approfondie et programmation."]
      ]
    },
    "2": {
      stats: [
        ["Malakoff Humanis", "Mon alternance"],
        ["EMS", "Mon parcours"],
        ["5", "Nouveaux outils"],
        ["2026 →", "Cap sur la 3ᵉ année"]
      ],
      html: [
        ["Une année charnière : l'entrée en alternance", "Cette deuxième année marque un vrai changement de dimension : depuis le 1ᵉʳ septembre 2025, je suis en alternance chez Malakoff Humanis, sur le parcours EMS (Expertise Mathématique et Statistique). Je passe d'un apprentissage essentiellement académique à une mise en pratique de la donnée dans un cadre professionnel, sur des problématiques réelles."],
        ["Mon évolution depuis la première année", "L'autonomie que j'avais commencé à construire en première année s'est confirmée et renforcée en entreprise. Je suis plus à l'aise pour mener un travail de bout en bout, de la donnée brute à la restitution. Le rythme exigeant de l'alternance m'a aussi appris à mieux prioriser et à m'adapter à des attentes professionnelles."],
        ["Sur le plan académique", "L'année se passe plutôt bien. J'ai rencontré quelques difficultés en mathématiques, mais j'obtiens de meilleurs résultats dans les matières plus appliquées comme les statistiques, qui restent mon point fort."],
        ["Nouveaux outils maîtrisés", "J'ai élargi ma boîte à outils avec SAP Business Objects, Tableau, R Shiny, Docker et QGIS. Les SAÉ m'ont aussi fait progresser sur deux méthodes de fond : les plans d'expériences et les séries temporelles."],
        ["Projets marquants", "Deux SAÉ se distinguent cette année : l'optimisation d'une recette par plans d'expériences (modélisation sous R, R² > 0,95) et une étude économétrique de séries temporelles pour prévoir le cours de l'uranium sur douze mois."],
        ["Le rythme de l'alternance", "L'alternance se passe à merveille. Je suis en entreprise pendant les vacances de la Toussaint, de Noël et d'hiver, puis de fin mars à fin août — une organisation qui me laisse le temps d'approfondir mes missions tout en suivant ma formation."],
        ["Où j'en suis et la suite", "Aujourd'hui, mon objectif est clair : réussir cette année et poursuivre ma troisième année de BUT, toujours en alternance chez Malakoff Humanis, pour continuer à monter en compétences dans la data."]
      ]
    },
    "3": {
      stats: null,
      empty: ["Bilan à venir", "Ma troisième année débute en 2026. Je publierai ici mon bilan une fois l'année lancée — revenez bientôt."]
    }
  };

  var body = document.getElementById("bilan-body");
  var statsEl = document.getElementById("bilan-stats");
  var tabs = document.querySelectorAll(".year-tab");

  function renderBilan(year) {
    var data = bilans[year];
    if (!data || !body || !statsEl) return;

    if (data.empty) {
      body.innerHTML =
        '<div class="bilan-empty"><p class="big">' + data.empty[0] + "</p><p>" + data.empty[1] + "</p></div>";
      statsEl.innerHTML = "";
      statsEl.style.display = "none";
      return;
    }

    body.innerHTML = data.html.map(function (b) {
      return "<h4>" + b[0] + "</h4><p>" + b[1] + "</p>";
    }).join("");

    statsEl.style.display = "";
    statsEl.innerHTML = data.stats.map(function (s) {
      return '<div class="stat"><b>' + s[0] + "</b><span>" + s[1] + "</span></div>";
    }).join("");
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("is-active"); t.removeAttribute("aria-selected"); });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
      renderBilan(tab.getAttribute("data-year"));
    });
  });

  // Affichage par défaut : 2e année
  renderBilan("2");

  /* ---------- Smooth scroll avec compensation du header ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var id = this.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });
})();
