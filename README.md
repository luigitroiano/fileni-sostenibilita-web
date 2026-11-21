# Dal bilancio di sostenibilità al web: un archivio digitale accessibile per la rendicontazione ESG della filiera avicola Fileni

## Contesto

Questo repository contiene la pagina web realizzata per il Project Work del Corso di Laurea in Informatica per le Aziende Digitali (classe L-31) dell'Università Telematica Pegaso, traccia PW 17. La traccia chiede una pagina in HTML e CSS, con JavaScript come miglioramento progressivo, che permetta di conoscere le attività di sostenibilità di Fileni e di scaricarne i report.

## Cosa fa la pagina

Una pagina unica in italiano, organizzata in sezioni:

- **Fileni**: presentazione dell'azienda e quattro cifre chiave del 2025, disegnate come un percorso a tappe, ognuna con documento e pagina del PDF di origine.
- **Pilastri**: gli ambiti dell'impegno di sostenibilità (benessere animale, ambiente, persone, agricoltura biologica e biodiversità, territorio e stakeholder), con le fonti.
- **Indicatori**: nove tabelle dei KPI 2022-2025, con valori numerici sempre presenti nel testo e note di metodo in un riquadro apribile; dove il bilancio 2025 cambia perimetro o metodo, la tabella mostra anche il valore confrontabile.
- **Report**: archivio dei documenti di sostenibilità, con link ai PDF (originali di Fileni e due copie locali), filtro per anno e tipo, ricerca testuale e una chip per ogni filtro attivo, rimovibile con la sua x.
- **Metodo**: come sono stati verificati i dati, i limiti da tenere presenti (un elenco apribile, una riga per limite) e le fonti.
- **Dichiarazione di accessibilità**: obiettivo (WCAG 2.2 AA), verifiche fatte e limiti noti, in poche righe.

La pagina si apre sempre con il tema chiaro; il tema scuro si sceglie con l'interruttore in testata.

## Struttura delle cartelle

```
index.html            pagina unica (il markup è il prodotto)
css/style.css         foglio di stile unico
js/                   moduli ES, un file per comportamento
  main.js             punto d'ingresso: decide quali moduli avviare
  theme.js            interruttore del tema chiaro/scuro
  nav.js              menu a scomparsa sul telefono e sezione attiva nella barra
  archive.js          filtro, ricerca e chip dei filtri attivi dell'archivio
  counters.js         conteggio animato delle quattro cifre dell'apertura
  motion.js           comparsa all'ingresso per i browser senza scroll-driven animations
fonts/                carattere Inter (woff2) e la sua licenza (OFL.txt)
img/anteprima.png     immagine per l'anteprima quando si condivide il link
report/               copie locali dei bilanci di sostenibilità 2024 e 2025 (PDF)
LICENSE               licenza del codice (MIT) e note su font e report
.nojekyll             dice a GitHub Pages di pubblicare i file così come sono, senza Jekyll
```

## Scelte tecniche

- **HTML, CSS e JavaScript vanilla, senza build né dipendenze.** Niente framework e nessuna risorsa da servizi esterni. Aperta con un doppio clic la pagina si legge tutta; le parti interattive richiedono un server (vedi «Provarla in locale»).
- **Miglioramento progressivo.** Senza JavaScript la pagina è completa e leggibile: l'archivio mostra l'elenco intero, i numeri sono già nel markup. Il JavaScript aggiunge filtro e chip dei filtri attivi, menu sul telefono, sezione attiva nella barra, interruttore del tema e animazioni, e nasconde un controllo finché non può farlo funzionare.
- **BEM** per le classi CSS; i comportamenti si agganciano ad attributi `data-js`, mai alle classi.
- **Token CSS** (colori, spaziature, raggio) in custom properties; i colori usano `light-dark()`, quindi un solo elenco serve entrambi i temi. I contrasti sono calcolati con la formula WCAG e riportati nei commenti.
- **Tema** scritto nell'attributo `data-theme` di `<html>`; la scelta si salva in `localStorage` solo dopo un clic. Senza scelta vale il tema chiaro, il predefinito, qualunque sia il tema del sistema.
- **Linguaggio visivo.** Tema chiaro (scuro a scelta) con aloni di luce e griglia di sfondo, titoli grandi con sfumatura, schede «in vetro» e griglia a riquadri per i pilastri. Icone e illustrazioni dei capitoli sono disegni SVG scritti nella pagina: nessun file di immagine da scaricare. Il carattere è Inter (variabile, un solo file in `fonts/`), con un carattere di riserva dalle metriche corrette perché lo scambio non sposti il layout.
- **Barra di navigazione** flottante e fissa in alto; sugli schermi stretti le sezioni stanno in un menu a scomparsa (`js/nav.js`), che senza JavaScript resta aperto. Il marchio in alto a sinistra è del progetto (simbolo astratto e nome in testo): **la pagina non usa il logo di Fileni**, che è un marchio di terzi.
- **Apertura** con quattro cifre chiave (con fonte); **«Fileni in cifre»** come percorso a tappe, a zig-zag sul computer e in colonna sul telefono, con una linea che si disegna mentre si scorre; **archivio come linea del tempo** con il report più recente in evidenza, **sezione attiva evidenziata** nella barra mentre si scorre. Per i due bilanci più recenti la «Copia di riserva» sta accanto al link a fileni.it (sotto, sul telefono), con un tooltip accessibile (mouse, tastiera, Esc per chiuderlo) che ne spiega il motivo. Un pulsante rotondo in basso a destra riporta all'inizio (è un semplice link, funziona anche senza JavaScript).
- **Anteprima di condivisione** (Open Graph): titolo, descrizione e immagine `img/anteprima.png`, letta solo da chi mostra l'anteprima del link e non dalla visita.
- **Interruttore del tema** con sole e luna: nome accessibile fisso «Tema scuro», stato in `aria-pressed`.
- **Movimento che rispetta `prefers-reduced-motion`.** Parallax, comparsa degli elementi, linea tra le tappe di «Fileni in cifre» e conteggio dei numeri partono solo con `no-preference`; con movimento ridotto la pagina resta ferma e completa.
- **Accessibilità** in linea con WCAG 2.2 AA. Scelte di progetto (in pagina c'è solo la dichiarazione breve):
  - struttura con intestazioni senza salti di livello, aree di navigazione e collegamento «Salta al contenuto» come primo elemento raggiungibile da tastiera;
  - indicatori in vere tabelle con didascalia e intestazioni di riga e colonna; il colore non è mai l'unico segnale (testo, tratteggio, etichette);
  - contrasto dei colori calcolato per coppia in tema chiaro e scuro, focus sempre visibile e non coperto dalla barra fissa, bersagli di almeno 24 px come chiede il livello AA e di 44 px per i comandi principali;
  - un solo carattere tipografico, ospitato nel sito; nessuna immagine di terzi; aloni, comparse e barre animate disattivati con «riduci movimento»;
  - link ai PDF con nome completo (documento, anno, lingua, formato e dimensione); apertura in nuova scheda dichiarata ai lettori di schermo; parti in inglese marcate con la lingua;
  - menu, interruttore del tema e tooltip con stato esposto (`aria-expanded`, `aria-pressed`, `aria-describedby`); menu e tooltip si chiudono anche con Esc; le x delle chip dei filtri sono pulsanti con nome completo («Rimuovi il filtro …»), e dopo la rimozione il focus torna al campo del filtro;
  - note di metodo e limiti dei dati in elementi `details` nativi, apribili da tastiera senza JavaScript.
- **Verifiche.** In locale Lighthouse dà 100 in accessibilità, buone pratiche e SEO (telefono e computer), e axe non rileva problemi rispetto alle WCAG 2.1 AA, nel tema chiaro e in quello scuro.
- **Budget di peso sulla pagina intera**, non file per file: primo caricamento entro 250 KB (PDF esclusi) e al massimo 10 richieste; i moduli di movimento si caricano con `import()` solo quando servono. Il CSS è unico e senza regole inutilizzate. Oggi il primo caricamento pesa circa 175 KB in 8 file.
- **Versione negli indirizzi.** CSS e script sono richiamati con un parametro di versione (`?v=…`), che cambia a ogni modifica: così il browser non usa file vecchi rimasti in cache.

## Provarla in locale

I moduli JavaScript richiedono un server, non il doppio clic sul file. Dalla cartella del progetto:

```bash
python3 -m http.server 8000
```

poi aprire <http://localhost:8000/>.

## Pubblicazione

La pagina è pubblicata con GitHub Pages all'indirizzo:

<https://luigitroiano.github.io/fileni-sostenibilita-web/>

I percorsi sono relativi, perché la pagina vive sotto il nome del repository.

## Fonti e diritti

I dati citati provengono dai bilanci di sostenibilità di Fileni dal 2022 al 2025 e dalla nota metodologica sull'analisi di doppia materialità del 2026; ogni numero in pagina rimanda a documento e pagina. I report in `report/` e quelli collegati dalla pagina sono titolarità di Fileni e sono riprodotti a soli fini didattici: non sono coperti dalla licenza del codice. La pagina non usa loghi né immagini di terzi.

## Licenza

Il codice è rilasciato con licenza MIT (file `LICENSE`). Il carattere Inter (The Inter Project Authors) è distribuito con licenza SIL Open Font License 1.1 (file `fonts/OFL.txt`).

## Autore

Luigi Troiano.
