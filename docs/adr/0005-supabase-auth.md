---
status: "sprejeto"
date: 2026-10-25
---

# Supabase Auth za registracijo in prijavo

## Kontekst in opredelitev problema

Uporabniki se morajo registrirati in prijavljati, sistem pa mora vedeti, kdo pošilja zahtevek, da lahko veljajo pravice po vlogah. 

## Obravnavane možnosti

* Lasten sistem (zgoščevanje gesel, seje ali JWT)
* Supabase Auth (e-pošta in geslo)
* Firebase Auth

## Odločitev

Izbrana možnost: "Supabase Auth", ker je del izbranega backenda (ADR-0002), podpira prijavo z e-pošto in geslom ter seje obravnava `supabase-js`. Lastna rešitev bi pomenila ročno pisanje občutljive kode (zgoščevanje gesel, žetoni, zaščita pred zlorabami), pri čemer lahko napake povzročijo resne varnostne težave. Firebase Auth bi dodal nepotrebno zunanjo odvisnost. Prijavljeni uporabnik je v bazi dostopen prek `auth.uid()`, kar se neposredno uporablja v RLS politikah.

### Posledice

* Dobro, ker so gesla, seje in žetoni obravnavani z izdelano rešitvijo in ni treba ročno delati z JWT.
* Dobro, ker je prijavljeni uporabnik neposredno uporaben v politikah in funkcijah.
* Slabo, ker so uporabniki v shemi `auth`, zato je potrebna ločena tabela profilov, ki se ustvari ob registraciji.
* Slabo, ker so možnosti prilagajanja omejene na to, kar Supabase Auth omogoča.