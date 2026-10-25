---
status: "sprejeto"
date: 2026-10-25
---

# Supabase kot backend namesto lastnega strežnika

## Kontekst in opredelitev problema

Aplikacija potrebuje bazo, registracijo in prijavo, API za podatke ter shrambo slik. 

## Obravnavane možnosti

* Lasten strežnik (Node.js/Express) s PostgreSQL
* Supabase (backend kot storitev na osnovi PostgreSQL)
* Firebase

## Odločitev

Izbrana možnost: "Supabase", ker v enem paketu ponuja PostgreSQL, avtentikacijo, samodejni REST API in shrambo datotek. Lasten strežnik bi pomenil, da bi te dele pisali sami, kar ne pripomore k jedru naloge. Firebase uporablja dokumentni model, ki slabo ustreza relacijskim podatkom (blok, članstvo, prijava, zgodovina), poleg tega je vezan na Google. Supabase je odprtokoden in temelji na standardnem PostgreSQL, zato je vezanost na ponudnika manjša kot pri zaprtih storitvah.

### Posledice

* Dobro, ker je potrebno bistveno manj kode (brez lastnega strežnika, avtentikacije in API-ja).
* Dobro, ker je mogoče cel sistem zagnati lokalno v Dockerju in kasneje po potrebi prenesti v oblak.
* Slabo, ker se pravila (pravice, poslovna logika) pišejo v SQL, kar je zahtevnejše za razhroščevanje kot navadna koda.
* Slabo, ker je prilagajanje omejeno na to, kar Supabase omogoča (npr. zapletenejše zunanje integracije zahtevajo Edge Functions).