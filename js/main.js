/*
  main.js - il punto di partenza di tutti gli script, caricato dalla pagina come modulo.

  I moduli non rallentano la comparsa della pagina, perche' il browser li esegue solo dopo
  averla disegnata. Ognuno ha una sola funzione, init, che non fa nulla se nella pagina non
  trova gli elementi di cui si occupa. Qui decido soltanto quali avviare e quando.

  Tema, menu e archivio servono sempre e li carico subito. I contatori animati e la comparsa
  degli elementi li carico solo se servono davvero.

  Gli indirizzi dei moduli finiscono con un numero di versione (?v=...): quando cambio un
  file cambio anche quel numero, e il browser scarica la versione nuova invece di usare
  quella vecchia che ha in memoria.
*/
import { init as initTheme } from "./theme.js?v=20261121-18";
import { init as initNav } from "./nav.js?v=20261121-18";
import { init as initArchive } from "./archive.js?v=20261121-18";

const root = document;

initTheme(root);
initNav(root);
initArchive(root);

const movimentoConsentito = matchMedia("(prefers-reduced-motion: no-preference)").matches;

if (movimentoConsentito) {
  // I numeri che salgono partono solo se chi visita non ha chiesto di ridurre il movimento.
  import("./counters.js?v=20261121-18").then((m) => m.init(root));

  // La comparsa degli elementi la fa gia' il CSS nei browser recenti: questo modulo serve
  // solo a quelli che non conoscono le animazioni legate allo scorrimento.
  if (!CSS.supports("animation-timeline: view()")) {
    import("./motion.js?v=20261121-18").then((m) => m.init(root));
  }
}
