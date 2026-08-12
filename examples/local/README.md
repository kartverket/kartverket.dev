# Godterikverkets syntetiske lokalkatalog

Disse testdataene inneholder oppdiktede entiteter for lokal utvikling uten
eksterne tilganger. De skal ikke inneholde navn, identifikatorer, e-postadresser,
medlemskap eller eierskapsdata fra produksjon.

Testdataene beskriver **Godterikverket**, Norges fullstendig oppdiktede etat for
kartlegging av spiselig geografi. Etatens lag forvalter Lørdagsrikets
sjokoladeruter, bevegelige grenser, skumgodtluftrom og savnede
favorittbiter. De lekne navnene gjør syntetiske entiteter lette å kjenne igjen,
samtidig som relasjonene har samme form som virkelige katalog- og
autorisasjonsdata.

Kildedefinisjonene utelater med hensikt felter som katalogen oppretter:

- `metadata.uid` og `metadata.etag` tildeles av katalogen;
- `backstage.io/managed-by-location` og
  `backstage.io/managed-by-origin-location` tildeles fra den aktive lokale
  katalogplasseringen; og
- `relations` opprettes fra felter som `spec.parent`, `spec.children`,
  `spec.memberOf` og `spec.owner`.

Entitetene fra katalog-API-et får dermed samme struktur som entiteter fra en
datatilbyder, mens de innsjekkede testdataene fortsatt er gyldig Backstage-YAML.
