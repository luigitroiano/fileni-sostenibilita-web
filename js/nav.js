/*
  nav.js - il menu delle sezioni sul telefono, e la sezione evidenziata nella barra.

  Sugli schermi larghi il menu e' sempre visibile e il pulsante non serve: ci pensa il CSS.
  Sul telefono il pulsante apre e chiude il menu, e il menu si richiude da solo quando si
  sceglie una sezione o si preme Esc. Lo stato aperto o chiuso lo segno sia sul pulsante,
  per i lettori di schermo, sia sull'intestazione, per lo stile.

  Mentre si scorre, evidenzio nella barra la sezione che si sta leggendo: tengo d'occhio le
  sezioni collegate dal menu e segno quella che passa nella fascia centrale dello schermo.
  Senza JavaScript il menu funziona lo stesso, solo senza l'evidenziazione.
*/
export function init(root = document) {
  const bottone = root.querySelector('[data-js="nav-toggle"]');
  if (!bottone) return; // se nella pagina non c'e' il pulsante del menu, non c'e' niente da fare

  const testata = bottone.closest("header");
  const imposta = (aperto) => {
    bottone.setAttribute("aria-expanded", String(aperto));
    testata.dataset.nav = aperto ? "open" : "closed";
  };

  bottone.addEventListener("click", () => imposta(bottone.getAttribute("aria-expanded") !== "true"));
  testata.addEventListener("click", (e) => { if (e.target.closest(".site-nav a")) imposta(false); });
  testata.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && testata.dataset.nav === "open") { imposta(false); bottone.focus(); }
  });
  bottone.hidden = false;

  const link = new Map([...testata.querySelectorAll(".site-nav a")].map((a) => [a.hash.slice(1), a]));
  const osservatore = new IntersectionObserver((voci) => {
    for (const voce of voci) {
      if (!voce.isIntersecting) continue;
      link.forEach((a) => a.removeAttribute("aria-current"));
      link.get(voce.target.id)?.setAttribute("aria-current", "location");
    }
  }, { rootMargin: "-45% 0px -50% 0px" }); // conta solo una fascia sottile, a meta' schermo
  link.forEach((_, id) => {
    const sezione = document.getElementById(id);
    if (sezione) osservatore.observe(sezione);
  });
}
