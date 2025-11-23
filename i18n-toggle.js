// i18n-toggle.js
(() => {
  // --- Icônes drapeaux (France et États-Unis) en SVG ---
  const FR_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" width="22" height="22" aria-hidden="true">
  <rect width="1" height="2" x="0" y="0" fill="#0055A4"/>
  <rect width="1" height="2" x="1" y="0" fill="#ffffff"/>
  <rect width="1" height="2" x="2" y="0" fill="#EF4135"/>
</svg>`;

  const US_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7410 3900" width="22" height="22" aria-hidden="true">
  <rect width="7410" height="3900" fill="#b22234"/>
  <g fill="#ffffff">
    <rect y="300" width="7410" height="300"/>
    <rect y="900" width="7410" height="300"/>
    <rect y="1500" width="7410" height="300"/>
    <rect y="2100" width="7410" height="300"/>
    <rect y="2700" width="7410" height="300"/>
    <rect y="3300" width="7410" height="300"/>
  </g>
  <rect width="2964" height="2100" fill="#3c3b6e"/>
  <rect x="60" y="60" width="7290" height="3780" fill="none" stroke="#ffffff" stroke-width="120" rx="120" ry="120"/>
</svg>`;

  // --- Traductions (HTML autorisé) ---
  const T = {
    fr: {
      title: "Moorea Dolphin Center",
      meta: "Annonce de transformation du Moorea Dolphin Center vers Moana Ora – Ocean Research Alliance.",
      p1: `<span class="intro">Chers amis,</span><br /><br />
        Créé en 1994, le Moorea Dolphin Center fermera ses portes le 31 décembre
        prochain pour laisser place à un <span class="highlight">sanctuaire-refuge</span>
        dont la gestion sera confiée à l’association
        <span class="highlight">MOANA ORA, Ocean Research Alliance</span>.<br />
        Hina et Kuokoa, nos deux grands dauphins, continueront d’être accompagnés
        avec la même attention et la même bienveillance, dans un cadre où respect,
        sécurité et bien-être resteront les valeurs fondatrices de Moana Ora.`,
      p2: `Nous remercions chaleureusement toutes celles et ceux qui, depuis plus de 30 ans,
        ont participé à nos programmes interactifs et éducatifs, contribuant à cette
        belle aventure humaine et animale. Cette nouvelle étape ouvre un nouveau chapitre
        de la relation entre l’homme et le vivant marin.`,
      p3: `Moana Ora vous donne rendez-vous en <span class="highlight">mars 2026</span>.<br/>
        Elle vous fera découvrir un lieu de rencontre, d’éducation
        et de découverte du monde marin, où histoire, nature, science et culture
        se mêleront harmonieusement.`,
      signature: `L’équipe du Moorea Dolphin Center`,
      cta: `Découvrez Moana Ora`,
      aria: `English version`,
    },
    en: {
      title: "Moorea Dolphin Center",
      meta: "Announcement of the Moorea Dolphin Center’s transition to Moana Ora – Ocean Research Alliance.",
      p1: `<span class="intro">Dear Friends,</span><br /><br />
        Founded in 1994, the Moorea Dolphin Center will close its doors on December 31
        to make way for a <span class="highlight">sanctuary-refuge</span>
        managed by the non-profit organization <span class="highlight">MOANA ORA, Ocean Research Alliance</span>.<br />
        Hina and Kuokoa, our two bottlenose dolphins, will continue to receive the same care and attention, in an environment where respect, safety and
        well-being will remain Moana Ora’s founding values.`,
      p2: `We warmly thank all of those who, for over 30 years, took part in our interactive and
        educational programs, contributing to this wonderful human–animal adventure.
        This new step marks the beginning of a new chapter in the relationship between humans and the marine world.`,
      p3: `Moana Ora looks forward to welcoming you in <span class="highlight">March 2026</span>.<br/> You will discover a place of connection, education, and exploration of the marine world, where history, nature, science, and culture blend harmoniously.`,
      signature: `The Moorea Dolphin Center team`,
      cta: `Discover Moana Ora`,
      aria: `Version française`,
    },
  };

  // --- Détection langue initiale ---
  const pref =
    localStorage.getItem("lang") ||
    (navigator.language || navigator.userLanguage || "fr").slice(0, 2);
  let lang = pref.startsWith("en") ? "en" : "fr";

  // --- Sélection des éléments du DOM ---
  const letter = document.querySelector(".letter");
  const paragraphs = letter ? letter.querySelectorAll("p") : [];
  const signatureEl = letter ? letter.querySelector(".signature") : null;
  const ctaEl = letter ? letter.querySelector("a.button") : null;

  // --- Création du bouton de bascule ---
  const toggleBtn = document.createElement("button");
  toggleBtn.className = "lang-toggle";
  toggleBtn.type = "button";
  toggleBtn.setAttribute("aria-live", "polite");
  toggleBtn.setAttribute("aria-label", T[lang].aria);
  toggleBtn.title = T[lang].aria;

  function setToggleIconFor(l) {
    toggleBtn.innerHTML = l === "fr" ? US_ICON : FR_ICON;
  }

  // --- Application du contenu traduit ---
  function applyLang(l) {
    const t = T[l];
    document.documentElement.setAttribute("lang", l);
    document.title = t.title;

    const metaDesc =
      document.querySelector('meta[name="description"]') ||
      (() => {
        const m = document.createElement("meta");
        m.setAttribute("name", "description");
        document.head.appendChild(m);
        return m;
      })();
    metaDesc.setAttribute("content", t.meta);

    if (paragraphs[0]) paragraphs[0].innerHTML = t.p1;
    if (paragraphs[1]) paragraphs[1].innerHTML = t.p2;
    if (paragraphs[2]) paragraphs[2].innerHTML = t.p3;
    if (signatureEl) signatureEl.textContent = t.signature;
    if (ctaEl) ctaEl.textContent = t.cta;

    toggleBtn.setAttribute("aria-label", t.aria);
    toggleBtn.title = t.aria;

    setToggleIconFor(l);
  }

  // --- Insertion du bouton dans la carte ---
  if (letter) letter.appendChild(toggleBtn);

  // --- Ajuste la carte pour garder les mêmes proportions (desktop) ---
  function fitLetter() {
    if (!letter) return;
    const isDesktop = window.matchMedia("(min-width: 72rem)").matches;

    // Réinitialise l'échelle au max
    letter.style.setProperty("--prose-scale", "1");

    if (!isDesktop) return;

    // Laisse le DOM finir les mises à jour
    requestAnimationFrame(() => {
      // Réduit par pas de 1% jusqu’à ce que ça tienne (seuil 0.92)
      let scale = 1.0;
      const min = 0.92;
      while (scale > min && letter.scrollHeight > letter.clientHeight) {
        scale -= 0.01;
        letter.style.setProperty("--prose-scale", scale.toFixed(2));
      }
    });
  }

  // --- Gestion du clic sur le bouton langue ---
  toggleBtn.addEventListener("click", () => {
    lang = lang === "fr" ? "en" : "fr";
    localStorage.setItem("lang", lang);
    applyLang(lang);
    fitLetter(); // ajuste la hauteur après changement de langue
  });

  // --- Initialisation ---
  applyLang(lang);
  fitLetter(); // ajuste à l’ouverture
  window.addEventListener("resize", fitLetter);
})();
