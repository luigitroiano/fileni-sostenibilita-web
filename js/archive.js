/*
  archive.js - il filtro dell'archivio dei report: per anno, per tipo e con una ricerca nel testo.

  Il modulo del filtro e' gia' nella pagina ma nascosto, cosi' chi non ha JavaScript vede
  semplicemente l'elenco completo. Qui lo rendo visibile.

  Anno e tipo li confronto con gli attributi data-year e data-type di ogni voce. La ricerca
  invece guarda tutto il testo della voce, senza badare a maiuscole e accenti; se si scrivono
  piu' parole, devono comparire tutte.

  Le voci che non corrispondono le nascondo (e le rimostro quando cambiano i filtri). Se in un
  anno non resta nessuna voce, sparisce anche il titolo di quell'anno.

  Il risultato («3 report mostrati su 8») viene letto dai lettori di schermo, ma con un piccolo
  ritardo: mentre si scrive non voglio un annuncio a ogni lettera.

  Il modulo non viene mai inviato davvero, e «Azzera i filtri» e' il normale pulsante di reset
  del browser. Sotto il filtro compare una chip per ogni filtro attivo: la x della chip toglie
  solo quel filtro.
*/

/* Porta il testo in minuscolo e toglie gli accenti: cosi' chi cerca "sostenibilita" trova anche "sostenibilità". */
const normalizza = (testo) =>
  testo.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/* Il testo di una voce su cui cercare. Tolgo la spiegazione della copia di riserva, che non parla del documento. */
function testoVoce(li) {
  const copia = li.cloneNode(true);
  copia.querySelectorAll(".tip__text").forEach((n) => n.remove());
  return copia.textContent;
}

export function init(root = document) {
  initTooltip(root);
  const form = root.querySelector('[data-js="archive-filter"]');
  const stato = root.querySelector('[data-js="archive-status"]');
  if (!form) return; // se nella pagina non c'e' il filtro, non c'e' niente da fare

  const voci = [...root.querySelectorAll("li.report")].map((li) => ({
    li,
    anno: li.dataset.year,
    tipo: li.dataset.type,
    testo: normalizza(testoVoce(li)),
  }));
  const titoliAnno = [...root.querySelectorAll(".archive__year")];
  const chips = root.querySelector('[data-js="archive-chips"]');

  let timer;

  /*
    Disegna una chip per ogni filtro in uso. La chip e' solo testo; l'unica parte cliccabile e'
    la x, che svuota quel campo. Dopo la rimozione sposto il cursore sul campo appena svuotato,
    cosi' chi usa la tastiera non resta su un pulsante che non esiste piu'.
  */
  function disegnaChip() {
    if (!chips) return;
    const testo = form.elements.testo.value.trim();
    const anno = form.elements.anno;
    const tipo = form.elements.tipo;
    const attivi = [
      testo && { campo: "testo", etichetta: `Ricerca: «${testo}»` },
      anno.value && { campo: "anno", etichetta: `Anno: ${anno.value}` },
      tipo.value && { campo: "tipo", etichetta: `Tipo: ${tipo.selectedOptions[0].textContent}` },
    ].filter(Boolean);
    chips.replaceChildren(
      ...attivi.map(({ campo, etichetta }) => {
        // Prima l'etichetta, poi il pulsante con la x, che il CSS mette nell'angolo in alto a destra.
        const chip = document.createElement("span");
        chip.className = "chip";
        const testo = document.createElement("span");
        testo.className = "chip__label";
        testo.textContent = etichetta;
        const x = document.createElement("button");
        x.type = "button";
        x.className = "chip__x";
        x.dataset.campo = campo;
        x.setAttribute("aria-label", `Rimuovi il filtro ${etichetta}`);
        chip.append(testo, x);
        return chip;
      })
    );
    chips.hidden = attivi.length === 0;
  }

  chips?.addEventListener("click", (e) => {
    const b = e.target.closest(".chip__x");
    if (!b) return;
    const campo = form.elements[b.dataset.campo];
    campo.value = "";
    aggiorna();
    campo.focus();
  });

  function aggiorna() {
    disegnaChip();
    const parole = normalizza(form.elements.testo.value).split(/\s+/).filter(Boolean);
    const { value: anno } = form.elements.anno;
    const { value: tipo } = form.elements.tipo;

    let visibili = 0;
    for (const v of voci) {
      const ok =
        (!anno || v.anno === anno) &&
        (!tipo || v.tipo === tipo) &&
        parole.every((p) => v.testo.includes(p));
      v.li.hidden = !ok;
      if (ok) visibili++;
    }

    // Se tutte le voci di un anno sono nascoste, nascondo anche il titolo: un anno vuoto non serve.
    for (const h of titoliAnno) {
      const lista = h.nextElementSibling;
      const tutte = lista.querySelectorAll("li.report");
      const nascoste = lista.querySelectorAll("li.report[hidden]");
      h.hidden = lista.hidden = tutte.length === nascoste.length;
    }

    // Aspetto un attimo prima di annunciare il risultato: se si sta ancora scrivendo, vale solo l'ultimo.
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (!stato) return;
      stato.textContent = visibili
        ? `${visibili} ${visibili === 1 ? "report mostrato" : "report mostrati"} su ${voci.length}.`
        : "Nessun report corrisponde ai filtri. Usa «Azzera i filtri» per rivedere l'elenco completo.";
    }, 300);
  }

  form.addEventListener("input", aggiorna); // vale anche per i menu a tendina, appena si sceglie una voce
  form.addEventListener("submit", (e) => e.preventDefault()); // premendo Invio la pagina non si ricarica
  // Quando si azzera, il browser svuota i campi solo dopo questo evento: per questo aggiorno un istante dopo.
  form.addEventListener("reset", () => setTimeout(aggiorna));

  form.hidden = false;
}

/*
  La spiegazione che compare sulla copia di riserva si chiude con il tasto Esc, senza spostare
  il cursore: le linee guida sull'accessibilita' chiedono che un contenuto che appare da solo si
  possa chiudere. Torna a comparire al passaggio successivo del mouse o della tastiera.
*/
function initTooltip(root) {
  const tips = root.querySelectorAll('[data-js="tip"]');
  if (!tips.length) return;
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") tips.forEach((t) => t.classList.add("tip--off"));
  });
  for (const t of tips) {
    const riapri = () => t.classList.remove("tip--off");
    t.addEventListener("mouseleave", riapri);
    t.addEventListener("focusout", riapri);
  }
}
