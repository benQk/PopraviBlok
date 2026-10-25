# 05 – Uporabniške zgodbe

### US-01 – Zahtevek za nov blok
- **Funkcionalnost:** F1 
- **Vloga:** Registriran uporabnik 
- **Zgodba:** Kot registriran uporabnik želim oddati zahtevek za nov blok, da ga lahko po odobritvi upravljam kot upravnik.
- **Acceptance criteria:**
  1. Obrazec za zahtevek zahteva naziv in naslov bloka; če katero polje manjka, se zahtevek ne odda in se ob polju izpiše napaka.
  2. Po oddaji ima blok status `PENDING` in prosilec ob zahtevku vidi oznako "V obravnavi".
  3. Administrator vidi seznam zahtevkov s statusom `PENDING` in jih lahko odobri ali zavrne.
  4. Ob odobritvi sistem blok označi kot `APPROVED`, ustvari naključno kodo bloka z vsaj 8 znaki in prosilcu doda članstvo z vlogo `MANAGER`.
  5. Ob zavrnitvi je blok označen kot `REJECTED`, prosilec ne dobi članstva in blok nima kode.

### US-02 – Pridružitev bloku s kodo
- **Funkcionalnost:** F2 
- **Vloga:** Stanovalec
- **Zgodba:** Kot stanovalec želim z vnosom kode bloka in številke stanovanja zaprositi za članstvo v svojem bloku, da lahko prijavljam težave.
- **Acceptance criteria:**
  1. Ob vnosu veljavne kode in stanovanja se ustvari članstvo `RESIDENT` s statusom `PENDING`.
  2. Ob vnosu neobstoječe kode se izpiše "Koda bloka ne obstaja" in zahtevek se ne ustvari.
  3. Uporabnik za isti blok ne more oddati drugega zahtevka, dokler je prvi `PENDING` ali `APPROVED`.
  4. Upravnik v seznamu čakajočih zahtevkov svojega bloka vidi ime, e-pošto in stanovanje ter zahtevek sprejme ali zavrne.
  5. Dokler zahtevek ni sprejet, uporabnik ne vidi prijav bloka in ne more oddati prijave; po sprejemu to lahko.

### US-03 – Prijava težave
- **Funkcionalnost:** F3 
- **Vloga:** Stanovalec
- **Zgodba:** Kot stanovalec želim prijaviti težavo v svojem bloku s kategorijo, lokacijo in opisom, da upravnik ve, kaj in kje je treba popraviti.
- **Acceptance criteria:**
  1. Obrazec zahteva naslov (samodejno izpoljeno), kratek opis (največ 300 besed), kategorijo (izbira s seznama) in lokacijo v bloku (največ 50 znakov); brez teh podatkov se prijava ne odda - sistem upozori uporabnika o nepopolni izpolnitvi obrazca.
  2. Po oddaji ima prijava status `NEW`, prioriteto `NORMAL`, prijavitelja nastavi na prijavljenega uporabnika in shrani čas oddaje prijave.
  3. Prijava se takoj pojavi na seznamu prijav bloka. (Upravnik je obveščen)
  4. Stanovalec lahko odda prijavo samo v bloku, v katerem ima sprejeto članstvo.
  5. Izpiše se potrditveno sporočilo z naslovom prijave.

### US-04 – Triaža in dodelitev serviserju
- **Funkcionalnost:** F4 
- **Vloga:** Upravnik
- **Zgodba:** Kot upravnik želim novi prijavi določiti prioriteto in jo dodeliti serviserju prave stroke, da bo težava hitro in pravilno obravnavana.
- **Acceptance criteria:**
  1. Upravnik doda serviserja v blok z e-naslovom že registriranega uporabnika in stroko (kategorijo); ob neznanem e-naslovu se izpiše napaka in članstvo se ne ustvari.
  2. Pri dodelitvi prijave sistem ponudi samo serviserje tega bloka, katerih stroka je enaka kategoriji prijave.
  3. Upravnik pred dodelitvijo izbere prioriteto `LOW`, `NORMAL` ali `URGENT`.
  4. Po dodelitvi je status prijave `ASSIGNED` in `assignee_id` je nastavljen na izbranega serviserja.
  5. Upravnik ne more dodeliti prijave drugega bloka.

### US-05 – Nadzorovan potek statusov
- **Funkcionalnost:** F5 
- **Vloga:** Upravnik
- **Zgodba:** Kot upravnik želim, da sistem dovoli samo veljavne prehode statusov in samo ustreznim vlogam, da je potek obravnave zanesljiv in sledljiv.
- **Acceptance criteria:**
  1. Neveljaven prehod (npr. `NEW` → `CLOSED`) sistem zavrne z napako in status se ne spremeni.
  2. Prehod, ki ga izvede nepooblaščena vloga (npr. serviser zapre prijavo), sistem zavrne.
  3. Vsak uspešen prehod v isti transakciji ustvari zapis `IssueEvent` z uporabnikom, prejšnjim in novim statusom ter časom.
  4. Neposredna sprememba polja `status` iz odjemalca mimo funkcije `transition_issue` ni mogoča.
  5. Upravnik lahko prijavo `NEW` zavrne (`REJECTED`); pri tem mora vpisati razlog, ki se shrani v zapis zgodovine.

### US-06 – Potrditev ali zavrnitev odprave
- **Funkcionalnost:** F6 
- **Vloga:** Stanovalec
- **Zgodba:** Kot prijavitelj želim potrditi ali zavrniti odpravo težave, da se prijava zapre šele, ko je težava resnično rešena.
- **Acceptance criteria:**
  1. Gumba "Potrdi odpravo" in "Zavrni odpravo" sta vidna samo prijavitelju in samo pri prijavi s statusom `RESOLVED`.
  2. Ob potrditvi se status spremeni v `CLOSED`.
  3. Ob zavrnitvi mora prijavitelj vpisati razlog (vsaj 10 znakov); status postane `REOPENED`, razlog pa se shrani v zgodovino.
  4. Upravnik prijavo `REOPENED` vidi na seznamu in jo lahko ponovno dodeli, pri čemer vidi razlog zavrnitve.
  5. Drug stanovalec ali serviser odprave ne more potrditi ali zavrniti.

### US-07 – Zaznavanje in združevanje podvojenih prijav
- **Funkcionalnost:** F7
- **Vloga:** Stanovalec
- **Zgodba:** Kot stanovalec želim ob oddaji videti podobne odprte prijave in jih po potrebi združiti, da se ista težava ne prijavlja večkrat.
- **Acceptance criteria:**
  1. Ko stanovalec izbere kategorijo in vnese lokacijo, sistem prikaže odprte prijave istega bloka z isto kategorijo in lokacijo (statusi razen `CLOSED`, `REJECTED`, `MERGED`).
  2. Če podobnih prijav ni, se opozorilo ne prikaže.
  3. Stanovalec lahko pri podobni prijavi izbere "Gre za isto težavo" in nova prijava se shrani s statusom `MERGED` ter povezavo `merged_into_id` na glavno prijavo.
  4. Stanovalec lahko opozorilo prezre in odda novo, samostojno prijavo.
  5. Združena prijava se ne prikazuje med odprtimi, njen prijavitelj pa vidi status glavne prijave.

### US-08 – Izvoz poročil
- **Funkcionalnost:** F8
- **Vloga:** Upravnik
- **Zgodba:** Kot upravnik želim izvoziti poročilo o prijavah za izbrano obdobje, da ga lahko predstavim na zboru stanovalcev.
- **Acceptance criteria:**
  1. Upravnik izbere blok, obdobje (od–do) in format (PDF ali CSV).
  2. Poročilo vsebuje za vsako prijavo naslov, kategorijo, prioriteto, status, datum prijave in datum odprave.
  3. Poročilo vsebuje samo prijave bloka, ki ga upravnik upravlja.
  4. Če v obdobju ni prijav, se izpiše "V izbranem obdobju ni prijav" in datoteka se ne ustvari.
  5. Ime datoteke vsebuje naziv bloka in obdobje (npr. `blok-a_2026-01-01_2026-03-31.csv`).

### US-09 – Komentarji in fotografije
- **Funkcionalnost:** F9
- **Vloga:** Stanovalec
- **Zgodba:** Kot stanovalec želim k prijavi dodati komentar ali fotografijo, da lahko pojasnim težavo ali prikažem stanje pred in po popravilu.
- **Acceptance criteria:**
  1. Stanovalec lahko komentira prijave svojega bloka, serviser samo prijave, ki so mu dodeljene.
  2. Komentar ima največ 1000 znakov; prazen komentar se ne odda.
  3. Fotografija je lahko JPG ali PNG do 5 MB; druge vrste ali večje datoteke sistem zavrne z napako.
  4. Komentar prikazuje avtorja, čas in morebitno fotografijo ter je viden na strani prijave.
  5. Fotografijo lahko vidijo samo člani bloka prijave.

### US-10 – Obvestila v aplikaciji
- **Funkcionalnost:** F10
- **Vloga:** Stanovalec
- **Zgodba:** Kot prijavitelj želim v aplikaciji videti obvestilo, ko se spremeni status moje prijave, da ni treba stalno preverjati.
- **Acceptance criteria:**
  1. Ob vsaki spremembi statusa se ustvari obvestilo za prijavitelja in dodeljenega serviserja, razen za uporabnika, ki je spremembo izvedel.
  2. Ikona obvestil prikazuje število neprebranih obvestil.
  3. Klik na obvestilo odpre pripadajočo prijavo in obvestilo označi kot prebrano.
  4. Uporabnik vidi samo svoja obvestila.
  5. Obvestilo vsebuje naslov prijave in nov status.

### US-11 – Nadzorna plošča upravnika
- **Funkcionalnost:** F11
- **Vloga:** Upravnik
- **Zgodba:** Kot upravnik želim imeti pregled prijav po prioriteti, kategoriji in starosti, da najprej obravnavam najnujnejše.
- **Acceptance criteria:**
  1. Privzeti pogled prikazuje odprte prijave bloka, razvrščene po prioriteti (`URGENT` najprej) in nato po starosti (najstarejše najprej).
  2. Upravnik filtrira po statusu, kategoriji in prioriteti; filtri se lahko kombinirajo.
  3. Pri vsaki prijavi je prikazano število dni od prijave.
  4. Na vrhu so prikazana števila prijav po statusih.
  5. Upravnik z več bloki lahko izbere blok, pri čemer vidi podatke samo izbranega.

### US-12 – Upravljanje blokov in uporabnikov
- **Funkcionalnost:** F12
- **Vloga:** Administrator
- **Zgodba:** Kot administrator želim blokirati zlonamernega uporabnika ali blok, da zaščitim sistem pred zlorabami.
- **Acceptance criteria:**
  1. Administrator vidi seznam vseh blokov in uporabnikov z iskanjem po imenu ali e-pošti.
  2. Blokiran uporabnik se ne more prijaviti in prejme sporočilo, da je račun blokiran.
  3. Pri blokiranem bloku člani ne morejo oddajati prijav ali spreminjati statusov, podatki pa ostanejo shranjeni.
  4. Administrator lahko blokiranje prekliče, uporabnik ali blok pa je nato spet normalno dostopen.
  5. Administrator ne more blokirati samega sebe.

### US-13 – Časovnica prijave
- **Funkcionalnost:** F13
- **Vloga:** Stanovalec
- **Zgodba:** Kot stanovalec želim videti časovnico svoje prijave, da vem, kdo je kaj naredil in kdaj.
- **Acceptance criteria:**
  1. Stran prijave prikazuje zgodovino v kronološkem vrstnem redu, od najstarejšega zapisa.
  2. Vsak zapis vsebuje ime uporabnika, prejšnji in novi status, datum in uro ter opombo (če obstaja).
  3. Zapisi o dodelitvi vsebujejo ime serviserja, zapisi o zavrnitvi pa razlog.
  4. Nobena vloga ne more urejati ali brisati zapisov zgodovine.
  5. Zgodovino lahko vidijo samo člani bloka, serviser pa samo za dodeljene prijave.

### US-14 – Serviserjev delovni prostor
- **Funkcionalnost:** F14 
- **Vloga:** Serviser
- **Zgodba:** Kot serviser želim videti svoje naloge in jih sprejeti ali zavrniti ter označiti kot odpravljene, da ni treba usklajevanja po telefonu.
- **Acceptance criteria:**
  1. Serviser vidi samo prijave, ki so mu dodeljene (`assignee_id` je njegov), z naslovom, lokacijo, prioriteto in opisom.
  2. Pri prijavi `ASSIGNED` lahko nalog sprejme (status `IN_PROGRESS`).
  3. Nalog lahko zavrne samo z razlogom; status se vrne na `NEW`, dodelitev se odstrani, razlog pa se zapiše v zgodovino.
  4. Pri prijavi `IN_PROGRESS` lahko serviser nalog označi kot odpravljen (status `RESOLVED`) in doda komentar.
  5. Serviser ne vidi nedodeljenih prijav in prijav, dodeljenih drugim serviserjem.

### US-15 – E-poštna obvestila
- **Funkcionalnost:** F15
- **Vloga:** Stanovalec
- **Zgodba:** Kot stanovalec želim prejeti e-pošto ob spremembi statusa svoje prijave, da sem obveščen, tudi ko nisem v aplikaciji.
- **Acceptance criteria:**
  1. Za vsako obvestilo, ustvarjeno ob spremembi statusa, se pošlje ena e-pošta na e-naslov prejemnika, in sicer v 1 minuti.
  2. E-pošta vsebuje naslov prijave, nov status in povezavo na prijavo.
  3. Če pošiljanje ne uspe, se sprememba statusa vseeno uspešno izvede in napaka se zapiše v dnevnik.
  4. Ključ za Resend ni dostopen v frontend kodi.
  5. Uporabnik, ki je spremembo sam izvedel, e-pošte ne prejme.