---
status: "sprejeto"
date: 2026-10-25
---

# Lokalni razvoj z Dockerjem in Supabase CLI

## Kontekst in opredelitev problema

Razvijalec potrebuje okolje, v katerem lahko varno preizkuša bazo, politike in migracije, ne da bi poškodoval pravi projekt. Dokumentacija mora omogočiti, da novi razvijalec zažene enako okolje brez ročne namestitve posameznih delov.

## Obravnavane možnosti

* Razvoj neposredno proti Supabase projektu v oblaku
* Ročna namestitev PostgreSQL na računalnik
* Lasten `docker-compose` z vsemi storitvami
* Supabase CLI (`supabase start`), ki zažene storitve v Dockerju

## Odločitev

Izbrana možnost: "Supabase CLI z Dockerjem", ker z enim ukazom zažene celoten Supabase (PostgreSQL, Auth, API, Storage, Studio) enako, kot deluje v oblaku. Razvoj v oblaku bi tvegal uničenje podatkov in zahteval internet, ročna namestitev ne bi vsebovala Auth in Storage, lasten `docker-compose` pa bi pomenil vzdrževanje konfiguracije, ki jo CLI že ponuja. Shema in politike so v migracijah v repozitoriju (`supabase/migrations`), frontend pa teče ločeno z `npm run dev`.

### Posledice

* Dobro, ker je okolje ponovljivo in ga je mogoče postaviti z nekaj ukazi.
* Dobro, ker so migracije shranjene v Gitu in jih je mogoče nato naložiti v oblak.
* Slabo, ker je potreben Docker Desktop in dovolj pomnilnika za več kontejnerjev.
* Slabo, ker lahko pride do manjših razlik med lokalno in oblačno različico Supabase.