---
status: "sprejeto"
date: 2026-10-25
---

# Poslovna logika poteka statusov v Postgres funkcijah

## Kontekst in opredelitev problema

Jedro rešitve je nadzorovan potek statusov prijave (NEW → ASSIGNED → IN_PROGRESS → RESOLVED → CLOSED idr.). Vsak prehod sme izvesti samo določena vloga, hkrati pa je treba zapisati zgodovino in ustvariti obvestilo. Ker frontend teče v brskalniku, ga uporabnik lahko poljubno spremeni, zato mu ni mogoče zaupati. Vprašanje je, kje naj bo to pravilo izvedeno.

## Obravnavane možnosti

* Pravila v frontendu (React neposredno spreminja stolpec `status`)
* Postgres funkcije, ki jih frontend kliče prek `supabase.rpc(...)`

## Odločitev

Izbrana možnost: "Postgres funkcije", konkretno funkcija `transition_issue`. Ta prek `auth.uid()` ugotovi, kdo kliče, prek tabele članstev preveri vlogo in dovoljenost prehoda ter v isti transakciji spremeni status, zapiše `IssueEvent` in ustvari obvestilo. Pravila v frontendu so nesprejemljiva, ker jih je mogoče zaobiti. Neposredno spreminjanje stolpca `status` se z RLS prepove, zato je funkcija edina pot.

### Posledice

* Dobro, ker so pravila poteka na enem mestu in veljajo ne glede na odjemalca.
* Dobro, ker so status, zgodovina in obvestilo vedno konsistentni (ena transakcija).
* Slabo, ker je logika napisana v SQL/PLpgSQL, kar je težje razhroščevati in testirati kot običajno kodo.
* Slabo, ker funkcije z oznako `SECURITY DEFINER` zaobidejo RLS, zato morajo pravice preverjati same (in imeti nastavljen `search_path`).