Boli Help — FIX: szczegoly.html + atlas.json
Data: 2025-09-26

Zmiany (diff-minimal):
1) szczegoly.html: przywrócono warstwy tła (.bg-anim, .grid-bg, #bh-particles) pod treści (z-index).
2) szczegoly.html: naprawiono mapowanie danych: teraz szuka data[typ][czesc]; fallback: data[typ].glowa, a gdy brak — komunikat.
3) szczegoly.html: „← Wróć” — jeśli referrer z tej samej domeny → history.back(), inaczej → index.html.
4) szczegoly.html: karty (objawy/przyczyny/…) renderowane z atlas.json; gdy brak treści — placeholder (PL/EN) z poszanowaniem localStorage['bh.lang'].
5) assets/atlas.json: jeden spójny plik źródłowy; komplet części (wspólne + „ciaza” dla kobiety); pełen zestaw kart z placeholderami.
6) kobieta.html / mezczyzna.html / dziecko.html: dodano brakujące kafelki („Uszy”, „Kolano”, „Ciąża” tylko dla kobiety) z prawidłowymi href.
7) Brak zmian w index.html, stylach i istniejącym translatorze. Brak wywołań nieistniejących ścieżek (konsola czysta).
