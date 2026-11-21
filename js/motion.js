/*
  motion.js - fa comparire gli elementi mentre si scorre, ma solo nei browser che non sanno
  farlo con il CSS. Per l'effetto di profondita' dei campi in alto non c'e' un'alternativa:
  in quei browser la decorazione resta semplicemente ferma.

  Gli elementi da far comparire che sono ancora sotto lo schermo li rendo trasparenti;
  quelli gia' visibili li lascio come sono. Quando arrivano sullo schermo compaiono, una
  volta sola. E' solo questo script a nasconderli, quindi senza JavaScript si vede tutto.
*/

export function init(root = document) {
  const elementi = [...root.querySelectorAll('[data-js="reveal"]')]
    .filter((el) => el.getBoundingClientRect().top > innerHeight);
  if (!elementi.length) return; // non c'e' niente da far comparire, o e' gia' tutto a schermo

  const osservatore = new IntersectionObserver((voci) => {
    for (const voce of voci) {
      if (!voce.isIntersecting) continue;
      voce.target.classList.add("is-visible");
      osservatore.unobserve(voce.target);
    }
  }, { rootMargin: "0px 0px -10% 0px" });

  for (const el of elementi) {
    el.classList.add("reveal-js");
    osservatore.observe(el);
  }
}
