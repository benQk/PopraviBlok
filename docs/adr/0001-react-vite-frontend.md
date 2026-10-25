---
status: "sprejeto"
date: 2026-10-25
---

# Frontend kot React SPA z uporabo Vite

## Kontekst in opredelitev problema

Aplikacija ima več strani (prijava, seznam prijav, podrobnosti prijave, nadzorna plošča, serviserjeve naloge), ki so po vlogah različne. Dostopna je samo prijavljenim uporabnikom. Izbrati je treba način izdelave uporabniškega vmesnika.

## Obravnavane možnosti

* React kot SPA z orodjem Vite in React Router
* Next.js (React s strežniškim izrisovanjem)
* Vue ali Angular

## Odločitev

Izbrana možnost: "React kot SPA z orodjem Vite in React Router", ker razvijalec React že pozna, zato ni dodatnega učenja. SPA se prek `supabase-js` neposredno pogovarja s Supabase, zato strežniški sloj frontenda ni potreben. Aplikacija je za prijavljene uporabnike, zato strežniško izrisovanje in iskalna optimizacija (SEO) nimata prave koristi. Next.js bi prinesel nove koncepte (strežniške komponente, usmerjanje po mapah). Vue in Angular bi pomenila učenje novega ogrodja brez koristi za nalogo. Vite ponuja hiter razvojni strežnik, React Router pa omogoča navigacijo med stranmi in zaščito poti po vlogah.

### Posledice

* Dobro, ker je razvojni krog hiter in ni nepotrebnih konceptov.
* Dobro, ker je rezultat statična aplikacija, ki jo je mogoče objaviti na poljubnem statičnem gostovanju (Vercel, Netlify).
* Slabo, ker ni strežniškega izrisovanja, zato je prvi prikaz počasnejši in aplikacija ni primerna za iskalnike.
* Slabo, ker je koda frontenda v celoti javna; zaščita podatkov zato ne sme temeljiti na skrivanju gumbov in strani v Reactu.