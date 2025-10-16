```markdown
# Dermatológiai Gyorssegéd (magyar)

Ez a kis, statikus egyoldalas alkalmazás segít gyors, kulcsszó-alapú diagnózisjavaslatokat adni szabad szöveges megfigyelésből — prototípus, oktatási célokra.

Fájlok
- index.hu.html — magyar felület (megnyitható böngészőben)
- static/app.hu.js — illesztés logika és UI-összekötés magyar üzenetekkel
- static/diagnoses.hu.json — minta diagnózis adatbázis magyar címekkel/kulcsszavakkal

Futtatás
1. Helyezd el a fájlokat a projektedben, például:
   - index.hu.html
   - static/
     - app.hu.js
     - diagnoses.hu.json
2. Nyisd meg az index.hu.html fájlt egy modern böngészőben. Nem szükséges szerver; ha szeretnéd, használhatsz statikus szervertet (pl. python -m http.server).

Működés
- Az alkalmazás tokenizálja a beírt megfigyelést és kulcsszavak alapján keresi a találatokat a diagnózis-adatbázisban.
- Egyszerű konfidencia: megtalált_kulcsszavak_száma / összes_kulcsszó_az_azonosításhoz.
- A legjobb találatokat és rövid leírást ad vissza.

Bővítés
- Szerkeszd vagy bővítsd a static/diagnoses.hu.json fájlt (több diagnózis, jobb kulcsszavak).
- Bevezethetsz fuzzy illesztést, szinonimákat vagy nyelvi feldolgozást a jobb találatokért.
- Átalakítható szerver-oldali alkalmazássá (Flask/Express) perzisztens adattárolással.

Fontos felelősségkizárás
Ez egy prototípus és nem helyettesíti a szakmai orvosi értékelést.
```
