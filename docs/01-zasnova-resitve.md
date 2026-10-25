# 01 – Zasnova rešitve

## Ime rešitve
**PopraviBlok** – spletna aplikacija za prijavo, obravnavo in sledenje težavam v večstanovanjskih stavbah.

## Namen in problem
Stanovalci težave v skupnih prostorih (pokvarjena luč na stopnišču, puščanje v kleti, okvara dvigala) danes javljajo upravniku po telefonu ali v klepetu. Upravnik nato po telefonu pokliče še serviserja. Posledice:

- prijave se izgubljajo ali podvajajo,
- stanovalec ne ve, ali je prijava prejeta in kdaj bo težava odpravljena,
- ni sledljivosti (kdo je kaj prijavil, komu je bilo dodeljeno, kaj je bilo narejeno),
- komunikacija med upravnikom in serviserjem poteka mimo kakršnega koli sistema.

PopraviBlok zbere prijave, dodeljevanje in odpravo na enem mestu, z jasnim potekom od prijave do potrditve odprave.

## Ciljni uporabniki
| Uporabnik | Situacija | Kaj želi |
|---|---|---|
| **Stanovalec** | Opazi težavo v svojem bloku. | Hitro prijaviti težavo in spremljati njen status. |
| **Upravnik bloka** | Dnevno prejema prijave iz več kanalov. | Imeti pregled, določiti prioriteto in dodeliti pravega serviserja. |
| **Serviser** | Prejema naloge od upravnika po telefonu. | Videti svoje naloge, jih sprejeti in označiti kot odpravljene. |
| **Administrator** | Skrbi za sistem kot celoto. | Potrjevati nove bloke in upravljati račune. |

## Kratek opis delovanja

### Dostop in vloge
1. **Registracija:** vsak uporabnik se registrira z e-pošto in geslom. Nov račun nima bloka in lahko samo odda zahtevek za blok ali se pridruži bloku.
2. **Nov blok:** bodoči upravnik odda zahtevek (naziv, naslov). **Administrator** ga odobri, sistem ustvari blok in njegovo **kodo bloka**, prosilec pa postane upravnik tega bloka.
3. **Stanovalci:** upravnik stanovalcem sporoči kodo bloka (npr. na oglasni deski). Stanovalec po registraciji vnese kodo in številko stanovanja. Šele ko **upravnik zahtevek sprejme**, lahko prijavlja težave.
4. **Serviserji:** upravnik doda serviserja v svoj blok z njegovo e-pošto (serviser se mora prej registrirati) in mu določi stroko (npr. elektrika). Sprejem ni potreben.


### Obravnava prijave
1. Stanovalec odda prijavo (naslov, opis, kategorija, lokacija v bloku).
2. Upravnik določi prioriteto in prijavo **dodeli serviserju** ustrezne stroke. Neutemeljeno ali podvojeno prijavo lahko zavrne ali združi.
3. Serviser nalog sprejme (ali zavrne z razlogom), opravi delo in ga označi kot odpravljenega.
4. Stanovalec **potrdi odpravo** (prijava se zapre) ali jo **zavrne** (prijava se vrne upravniku).
5. Vsaka sprememba statusa se zapiše v zgodovino, udeleženci pa prejmejo obvestilo.








