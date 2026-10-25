---
status: "sprejeto"
date: 2026-10-25
---

# PostgreSQL kot podatkovna baza

## Kontekst in opredelitev problema

Podatki so izrazito relacijski: bloki, članstva, prijave, kategorije, zgodovina sprememb in komentarji so med seboj povezani. Pri spremembi statusa je treba v eni operaciji spremeniti prijavo, zapisati zgodovino in ustvariti obvestilo. Potrebujemo tuje ključe, transakcije in omejitve podatkov.

## Obravnavane možnosti

* PostgreSQL
* MySQL
* Dokumentna baza (MongoDB, Firestore)
* SQLite

## Odločitev

Izbrana možnost: "PostgreSQL", ker je to baza, na kateri temelji Supabase, in hkrati podpira vse, kar projekt potrebuje: transakcije, tuje ključe, enumeracije (statusi, prioritete, vloge), funkcije in politike na ravni vrstic (RLS). Dokumentne baze bi zahtevale ročno vzdrževanje povezav in bi otežile transakcijske spremembe več zapisov hkrati. SQLite ni primeren za večuporabniško spletno aplikacijo. MySQL bi zahteval lasten backend, saj ga Supabase ne podpira.

### Posledice

* Dobro, ker baza sama zagotavlja konsistentnost (tuji ključi, enolične omejitve, transakcije).
* Dobro, ker je SQL znanje razvijalca neposredno uporabno.
* Slabo, ker je treba za vsako spremembo sheme pisati migracije.
* Slabo, ker je shema manj prilagodljiva kot pri dokumentni bazi, spremembe pa so zahtevnejše, ko so podatki že vneseni.