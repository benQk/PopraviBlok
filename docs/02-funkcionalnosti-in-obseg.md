# 02 – Funkcionalnosti in obseg

## Uporabniške vloge

### Stanovalec
**Lahko:**
- se pridruži bloku s kodo bloka in številko stanovanja,
- odda prijavo težave v svojem bloku,
- pregleduje prijave svojega bloka in spremlja njihov status,
- komentira prijave,
- potrdi ali zavrne odpravo svoje prijave,
- prejema obvestila o spremembah svojih prijav.

**Ne more:**
- sprejemati drugih stanovalcev,
- določati prioritete, dodeljevati serviserjev ali spreminjati statusov (razen potrditve/zavrnitve odprave),
- videti prijav drugih blokov,
- obravnavati prijav drugih stanovalcev ali jih brisati.

### Upravnik
**Lahko:**
- odda zahtevek za nov blok,
- sprejme ali zavrne stanovalce, ki se želijo pridružiti njegovemu bloku,
- doda serviserja v svoj blok in mu določi stroko,
- vidi vse prijave svojega bloka, določi prioriteto, dodeli serviserja, prijavo zavrne ali združi,
- ponovno dodeli zavrnjeno odpravo,
- vidi statistiko bloka.

**Ne more:**
- odobriti svojega zahtevka za blok,
- spreminjati prijav ali članov drugih blokov,
- zapreti prijave namesto stanovalca,
- upravljati sistemskih nastavitev.

### Serviser
**Lahko:**
- vidi samo naloge, ki so mu dodeljene,
- sprejme ali zavrne nalog (z razlogom),
- komentira nalog in ga označi kot odpravljenega.

**Ne more:**
- vidi nedodeljenih prijav ali članov bloka,
- spreminja prioritete ali dodeljuje naloge,
- zapre prijave (to lahko samo stanovalec).

### Administrator
**Lahko:**
- odobri ali zavrne zahtevke za nove bloke,
- blokira uporabnike ali bloke,
- pregleduje vse bloke in uporabnike.

**Ne more:**
- sodelovati v obravnavi prijav (dodeljevati, spreminjati statusov, komentirati).

---


## Predvidene funkcionalnosti

| # | Funkcionalnost | Opis | MVP |
|---|---|---|---|
| F1 | Zahtevek za nov blok in odobritev | Uporabnik odda zahtevek za blok, administrator ga odobri, sistem ustvari blok s kodo in prosilca naredi za upravnika. | **MVP** |
| F2 | Pridružitev bloku s kodo | Stanovalec vnese kodo bloka in stanovanje; upravnik zahtevek sprejme ali zavrne. | **MVP** |
| F3 | Prijava težave | Stanovalec odda prijavo s kategorijo, lokacijo v bloku in opisom. | **MVP** |
| F4 | Triaža in dodelitev serviserju | Upravnik določi prioriteto in dodeli prijavo serviserju, ki ima ustrezno stroko. Serviserje v blok doda upravnik. | **MVP** |
| F5 | Nadzorovan potek statusov | Prijava prehaja samo po dovoljenih prehodih in samo z dovoljenimi vlogami; vsaka sprememba se zapiše v zgodovino. | **MVP** |
| F6 | Potrditev ali zavrnitev odprave | Stanovalec potrdi (prijava se zapre) ali zavrne z razlogom (prijava se vrne upravniku). | **MVP** |
| F7 | Zaznavanje in združevanje podvojenih prijav | Ob oddaji sistem prikaže podobne odprte prijave (ista kategorija in lokacija) v bloku in jih združi ob oddaji | |
| F8 | Izvoz poročil (PDF/CSV) | Upravnik lahko izvozi poročilo v izbrani obliki za zbore stanovalcev | |
| F9 | Komentarji in fotografije | Udeleženci prijave dodajajo komentarje in slike (stanje pred in po popravilu). | |
| F10 | Obvestila o spremembah | Prijavitelj in serviser prejmeta obvestilo v aplikaciji ob spremembi statusa. | |
| F11 | Nadzorna plošča upravnika | Pregled prijav po prioriteti, kategoriji in staranju s filtriranjem. | |
| F12 | Upravljanje blokov in uporabnikov | Administrator blokira uporabnike ali bloke in pregleduje sistem. | |
| F13 | Časovnica prijave | Prikaz zgodovine prijave: kdo je kaj naredil in kdaj. | |
| F14 | Serviserjev delovni prostor | Serviser vidi svoje naloge, jih sprejme ali zavrne z razlogom, komentira in označi kot odpravljene. | **MVP** |
| F15 |  E-poštna obvestila | Poleg obvestil v aplikaciji, še bodo uporabniki prejeli obvestila na mailu. | |

---

## Kasnejše nadgradnje
1. Samodejna eskalacija prijav brez odziva in samodejno zapiranje, če stanovalec odprave ne potrdi v 7 dneh.
2. Ponavljajoče se vzdrževalne naloge (npr. mesečni pregled gasilnikov).
3. Mobilna aplikacija (PWA) z zajemom fotografije.
4. Ocena stroškov: serviser vpiše stroške, upravnik jih odobri.
5. Glasovanje stanovalcev o večjih posegih.

---

## Out of scope
- Plačevanje, obračun stroškov in izdajanje računov.
- Upravljanje najemnin, pogodb in rezervnega sklada.
- Pravo pošiljanje SMS-jev in e-pošte (samo obvestila v aplikaciji).
- Nativna mobilna aplikacija (rešitev je odzivna spletna aplikacija).
- Integracije z zunanjimi sistemi (koledarji, računovodstvo, pametne naprave).
- Klepet v živo (komunikacija poteka prek komentarjev).
- Večjezičnost (samo slovenščina).
