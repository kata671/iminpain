Boli Help — DELTA PATCH (bez nadpisywania kafelków)
Data: 2025-09-26

ZAWARTOŚĆ:
- szczegoly.html — naprawione mapowanie + tła + „← Wróć” (jak w pełnym fixie).
- assets/atlas.json — kompletny atlas z placeholderami (jeden backend treści).
- patches/kobieta-tiles.htmlfrag — FRAGMENT do wklejenia (Uszy, Kolano, Ciąża).
- patches/mezczyzna-tiles.htmlfrag — FRAGMENT do wklejenia (Uszy, Kolano).
- patches/dziecko-tiles.htmlfrag — FRAGMENT do wklejenia (Uszy, Kolano).

INSTRUKCJA (SAFE):
1) Podmień TYLKO: `szczegoly.html` oraz `assets/atlas.json`.
2) Otwórz po kolei: `kobieta.html`, `mezczyzna.html`, `dziecko.html` i znajdź kontener siatki (np. `<div class="bh-tiles">…`).
   W dowolnym miejscu wewnątrz tej siatki wklej odpowiedni FRAGMENT z folderu patches (zachowaj istniejące kafelki).
3) Zapisz i sprawdź linki do:
   - kobieta: uszy, kolano, ciąża
   - mężczyzna: uszy, kolano
   - dziecko: uszy, kolano
4) Testy akceptacyjne URL-i dla `szczegoly.html` powinny przejść (brak wymuszonego „glowa”).

Dlaczego delta:
- Nie nadpisujemy Twoich stron kafelków, tylko dopinamy brakujące kafelki.
- Zostawiamy Twoje style/layout bez ingerencji.
