# 07 – Pregled prevzetega projekta

## 1. Implementirane funkcionalnosti MVP

MVP zajema funkcionalnosti F1–F7. Vse so implementirane.

| # | Funkcionalnost | Status | Opombe |
|---|---|---|---|
| F1 | Zahtevek za nov blok in odobritev | ✅ Implementirano | `BuildingRequestForm`, admin stran `BuildingRequests`, RLS politike in DB funkcija `approve_building` |
| F2 | Pridružitev bloku s kodo | ✅ Implementirano | `JoinBuildingForm`, upravnik sprejme/zavrne prek `ManagerPanel` |
| F3 | Prijava težave | ✅ Implementirano | `IssueForm` z validacijo, kategorijami in lokacijo |
| F4 | Triaža in dodelitev serviserju | ✅ Implementirano | `TriagePanel` za prioriteto, `TechniciansModal` za dodelitev; filtrira serviserje po stroki |
| F5 | Nadzorovan potek statusov | ✅ Implementirano | DB funkcija `transition_issue` zavrne neveljavne prehode; vsaka sprememba ustvari `IssueEvent`; `StatusActions` in `TransitionModal` na frontendu |
| F6 | Serviserjev delovni prostor | ✅ Implementirano | `TechnicianIssues` prikazuje samo dodeljene naloge; `TechnicianActions` za sprejem/zavrnitev z razlogom in označitev kot odpravljeno |
| F7 | Potrditev ali zavrnitev odprave | ✅ Implementirano | `ReporterActions` prikazuje gumba samo prijavitelju pri statusu `RESOLVED`; zavrnitev zahteva razlog; `ReopenNotice` obvesti upravnika |

Poleg MVP je delno implementirana še **F14 (Časovnica prijave)** – komponenta `IssueTimeline` prikazuje kronološko zgodovino s podatki o uporabniku, prehodih statusov in opombah.

Funkcionalnosti **F8–F13 in F15** (zaznavanje podvojenih prijav, izvoz poročil, komentarji, obvestila, nadzorna plošča, upravljanje uporabnikov, e-poštna obvestila) niso del MVP in niso implementirane.

---

## 2. Ustreznost glede na uporabniške zgodbe

Pregledanih je 5 osrednjih uporabniških zgodb.

### US-01 – Zahtevek za nov blok
**Zadošča.** Obrazec zahteva naziv in naslov, pri manjkajočih poljih se prikaže napaka. Po oddaji je blok v stanju `PENDING`. Administrator vidi seznam zahtevkov in jih odobri ali zavrne. Ob odobritvi sistem ustvari kodo bloka in prosilcu dodeli vlogo `MANAGER`.

### US-02 – Pridružitev bloku s kodo
**Zadošča.** Ob vnosu neobstoječe kode se izpiše napaka. Dvojni zahtevek ni mogoč, dokler je obstoječi `PENDING` ali `APPROVED`. Upravnik vidi čakajoče zahtevke s podatki stanovalca in jih sprejme ali zavrne. Dokler zahtevek ni sprejet, stanovalec ne more oddati prijav.

### US-03 – Prijava težave
**Zadošča.** Obrazec zahteva naslov, opis, kategorijo in lokacijo z validacijo. Po oddaji ima prijava status `NEW`, prioriteto `NORMAL` in shrani čas oddaje. Prijava se takoj prikaže na seznamu. Oddaja je možna samo v bloku s sprejetim članstvom.

### US-04 – Triaža in dodelitev serviserju
**Zadošča.** Upravnik doda serviserja z e-naslovom; ob neznanem e-naslovu se prikaže napaka. Sistem pri dodelitvi ponudi samo serviserje tega bloka z ustrezno stroko. Upravnik izbere prioriteto (`LOW`, `NORMAL`, `URGENT`). Po dodelitvi je status `ASSIGNED` z nastavljenim `assignee_id`.

### US-05 – Nadzorovan potek statusov
**Zadošča.** DB funkcija `transition_issue` zavrne neveljavne prehode in nepooblaščene vloge na ravni podatkovne baze. Vsak uspešen prehod v isti transakciji ustvari zapis `IssueEvent`. Neposredna sprememba polja `status` ni možna mimo te funkcije (RLS politike). Upravnik lahko prijavo `NEW` zavrne z razlogom, ki se shrani v zgodovino.
