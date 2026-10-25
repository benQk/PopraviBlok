---
status: "sprejeto"
date: 2026-10-25
---

# TypeScript na frontendu

## Kontekst in opredelitev problema

Podatkovni model ima več entitet z veliko polji, statusi in vlogami (enumeracije). Pri delu z odgovori iz baze so tipične napake napačna imena polj ali neveljavne vrednosti statusa, ki se pokažejo šele ob zagonu. Frontend je pisan v Reactu.

## Obravnavane možnosti

* JavaScript
* TypeScript

## Odločitev

Izbrana možnost: "TypeScript", ker Supabase CLI iz sheme baze generira tipe (`supabase gen types`), zato urejevalnik že med pisanjem opozori na napačno polje ali status. S tem se vrsta napak odkrije prej, brez dodatnega testiranja. JavaScript bi bil hitrejši za začetek, a bi ta zaščita odpadla. 

### Posledice

* Dobro, ker so napake pri imenih polj in statusih odkrite ob pisanju kode.
* Dobro, ker generirani tipi sledijo shemi baze.
* Slabo, ker zahteva nekaj dodatnega učenja in konfiguracije.
* Slabo, ker je treba tipe obnoviti ob vsaki spremembi sheme.