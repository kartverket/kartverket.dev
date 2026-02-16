---
id: funksjoner
title: Funksjoner
description: Forrettningsfunksjoner i Kartverket
---

# Funksjoner
Forretningsfunksjoner beskriver hva Kartverket må kunne gjøre for å levere på sitt samfunnsoppdrag.
Systemene vi utvikler og drifter bidrar til én eller flere funksjoner, og ulike funksjoner kan ha forskjellige krav til tilgjengelighet og oppetid.
En funksjon blir realisert gjennom systemer, komponenter og team som sammen leverer funksjonalitet. Ved å koble funksjoner til teamenes systemer får vi bedre oversikt over hvem som leverer hva, hvilke avhengigheter som finnes, og hva som påvirkes dersom noe er utilgjengelig.
Funksjoner organiseres i et hierarki. Mindre delfunksjoner bygger opp større funksjoner, slik at vi kan se sammenhengen mellom detaljer og helhet.

Diagrammet under viser en funksjon med to underfunksjoner og teamene og systemene som er knyttet til dem.
![modelleringseksempel1](../assets/modelleringseksempel1.png)


# Funksjoner i kartverket.dev
Kartverket.dev er basert på Backstage, hvor blant annet systemer, komponenter og team allerede er modellert.
Funksjoner er en utvidelse laget av Kartverket for å knytte sammen:
- systemene vi drifter
- teamene som leverer dem
- forretningskravene vi skal oppfylle

Dette gjør det enklere å forstå hvordan tekniske løsninger henger sammen med det Kartverket faktisk leverer til samfunnet.

# Hvordan opprette en funksjon?
1. Gå til fanen Funksjoner
2. Velg Opprett ny funksjon
3. Fyll inn:
    - hvilke systemer funksjonen er avhengig av
    - hvilket team som eier funksjonen

Når endringen er merget inn i funksjonsregisteret, vil funksjonen bli synlig i kartverket.dev.
Der kan du senere legge til relevante skjemaer som f.eks. tjenestenivåskjema.

## Skjemaer
Funksjoner har tilhørende skjemaer om f.eks. tjenestenivå. For å lese mer om skjemaer kan du søke opp regelrettskjemaer på confluence 