---
status: "sprejeto"
date: 2026-10-25
---

# Resend in Edge Function za e-poštna obvestila

## Kontekst in opredelitev problema

Ob spremembi statusa prijave mora sistem poleg obvestila v aplikaciji poslati še e-pošto (funkcionalnost F15). Pošiljanje ne sme zaustaviti ali razveljaviti spremembe statusa, API ključ za pošiljanje pa ne sme biti dostopen v frontendu.

## Obravnavane možnosti

* Privzeta e-pošta Supabase
* Lasten SMTP (npr. poštni račun)
* Resend, poklican iz Supabase Edge Function
* Drug ponudnik (SendGrid, Mailgun)

## Odločitev

Izbrana možnost: "Resend prek Edge Function", sprožen z Database Webhookom ob vnosu v tabelo `notifications`. Privzeta Supabase e-pošta je namenjena sporočilom ob prijavi in je močno omejena. Lasten SMTP je zapleten za nastavitev in ni primeren za avtomatizirano pošiljanje. SendGrid in Mailgun bi bila enako možna, a je Resend preprostejši (kratek API, brezplačna stopnja). Pošiljanje poteka asinhrono po vnosu obvestila, zato napaka pri pošiljanju ne vpliva na prehod statusa. Ključ je shranjen kot Supabase secret.

### Posledice

* Dobro, ker je API ključ na strežniški strani in ni izpostavljen v brskalniku.
* Dobro, ker napaka pri pošiljanju ne ovira poteka obravnave prijave.
* Slabo, ker brez preverjene domene Resend pošilja samo na e-naslov lastnika računa, zato je za prave prejemnike treba preveriti domeno.
* Slabo, ker je to dodatna zunanja odvisnost in nova komponenta (Edge Function), ki jo je treba nastaviti in spremljati.