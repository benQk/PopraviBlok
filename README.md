# PopraviBlok

Spletna aplikacija za prijavo, obravnavo in sledenje težavam v večstanovanjskih blokih (pokvarjena luč, puščanje, okvara dvigala ...). Stanovalci težave prijavijo, upravnik jim določi prioriteto in jih dodeli serviserju, serviser jih odpravi, stanovalec pa odpravo potrdi. Vsaka sprememba se zapiše v zgodovino, zato je vedno jasno, kdo je kaj naredil in kdaj.

Projekt je nastal kot naloga pri predmetu na fakulteti.

## Uporabniške vloge
Stanovalec, upravnik, serviser in administrator. Vloge so vezane na članstvo v bloku.

## Tehnologije
| Področje | Tehnologija |
|---|---|
| Frontend | React, Vite, TypeScript, React Router, supabase-js |
| Backend | Supabase (REST API, Postgres funkcije, RLS politike) |
| Podatkovna baza | PostgreSQL (Supabase) |
| Avtentikacija | Supabase Auth |
| E-poštna obvestila | Resend (Supabase Edge Function) |
| Lokalni razvoj | Docker, Supabase CLI |

## Dokumentacija
| Dokument | Vsebina |
|---|---|
| [01 – Zasnova rešitve](docs/01-zasnova-resitve.md) | Ideja, problem, uporabniki, delovanje |
| [02 – Funkcionalnosti in obseg](docs/02-funkcionalnosti-in-obseg.md) | Vloge, funkcionalnosti, nadgradnje, out of scope |
| [03 – Podatkovni model](docs/03-podatkovni-model.md) | Entitete, povezave, polja |
| [04 – Arhitektura in tehnološki sklad](docs/04-arhitektura-in-tehnoloski-sklad.md) | Arhitektura, lokalni zagon, sklad |
| [05 – Uporabniške zgodbe](docs/05-uporabniske-zgodbe.md) | Zgodbe z acceptance criteria |
| [05 – Wireframes](docs/05-wireframes.md) | Osnutki zaslonov |
| [Arhitekturne odločitve (ADR)](docs/adr/) | Utemeljitve ključnih odločitev |