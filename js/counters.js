/*
  counters.js - fa salire da zero le quattro cifre dell'apertura. Lo carico solo se chi
  visita non ha chiesto di ridurre il movimento.

  Il numero giusto e' gia' scritto nella pagina, ed e' quello che leggono i lettori di
  schermo e i motori di ricerca: l'animazione non lo sostituisce. Quando la cifra compare
  sullo schermo, nascondo il numero vero solo alla vista e ci metto accanto una copia che
  sale; a fine corsa tolgo la copia e rimetto il numero vero. Dura meno di un secondo e
  succede una volta sola.
*/

const DURATA = 900; // in millisecondi: resto sotto il secondo

export function init(root = document) {
  const dati = root.querySelectorAll('[data-js="counter"]');
  if (!dati.length) return; // se nella pagina non ci sono cifre animate, non c'e' niente da fare

  const osservatore = new IntersectionObserver((voci) => {
    for (const voce of voci) {
      if (!voce.isIntersecting) continue;
      osservatore.unobserve(voce.target); // ogni cifra si anima una volta sola
      anima(voce.target);
    }
  }, { threshold: 0.5 });

  dati.forEach((d) => osservatore.observe(d));
}

function anima(dato) {
  const finale = parseFloat(dato.value);
  if (Number.isNaN(finale)) return;

  // Conto i decimali del numero finale (33,4 ne ha uno), cosi' durante la salita si vedono gli stessi.
  const decimali = (dato.value.split(".")[1] || "").length;
  const formato = new Intl.NumberFormat("it-IT", {
    minimumFractionDigits: decimali,
    maximumFractionDigits: decimali,
    useGrouping: "always", // il punto delle migliaia anche con quattro cifre, come in 2.509
  });

  const visivo = document.createElement("span");
  visivo.setAttribute("aria-hidden", "true");
  dato.after(visivo);
  dato.classList.add("visually-hidden");

  const inizio = performance.now();
  const passo = (adesso) => {
    const t = Math.min((adesso - inizio) / DURATA, 1);
    const eased = 1 - (1 - t) ** 3; // parte veloce e rallenta verso la fine
    visivo.textContent = formato.format(finale * eased);
    if (t < 1) {
      requestAnimationFrame(passo);
    } else {
      visivo.remove();
      dato.classList.remove("visually-hidden");
    }
  };
  requestAnimationFrame(passo);
}
