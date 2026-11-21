/*
  theme.js - l'interruttore del tema, con il sole e la luna.

  Il tema scelto lo scrivo nell'attributo data-theme dell'elemento html, e al resto pensa il
  CSS. Se l'attributo non c'e' la pagina e' chiara: non seguo il tema del computer di chi
  visita, cambia solo se si usa l'interruttore.

  Senza JavaScript il pulsante resta nascosto, perche' un pulsante che non fa niente
  confonderebbe.

  Per i lettori di schermo il nome resta sempre «Tema scuro» e cambia solo lo stato
  (premuto o no). Se cambiassero tutti e due insieme, il messaggio risulterebbe confuso.

  La scelta la salvo nel browser solo dopo un clic. Se il salvataggio non e' possibile,
  per esempio in navigazione privata, il tema vale solo per questa visita. Il piccolo
  script all'inizio della pagina rimette il tema salvato prima che la pagina compaia;
  qui parto dallo stato che trovo.
*/

const CHIAVE = "theme";

/* Dice se adesso e' attivo il tema scuro: succede solo se qualcuno l'ha scelto. */
const temaScuroAttivo = (html) => html.dataset.theme === "dark";

export function init(root = document) {
  const bottone = root.querySelector('[data-js="theme-toggle"]');
  if (!bottone) return; // se nella pagina non c'e' l'interruttore, non c'e' niente da fare

  const html = document.documentElement;
  const aggiorna = () => bottone.setAttribute("aria-pressed", String(temaScuroAttivo(html)));

  bottone.addEventListener("click", () => {
    const nuovo = temaScuroAttivo(html) ? "light" : "dark";
    html.dataset.theme = nuovo;
    try {
      localStorage.setItem(CHIAVE, nuovo);
    } catch (e) { /* salvataggio non possibile: il tema vale solo per questa visita */ }
    aggiorna();
  });

  aggiorna();
  bottone.hidden = false;
}
