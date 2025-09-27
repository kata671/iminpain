Boli Help — 3D Body Viewer (premium) — SAFE DROP-IN

Co dostajesz:
- Płynny model 3D (WebGL/Three.js) z obrotem/zoomem, wyborem części ciała kliknięciem,
- Pasek narzędzi (reset, wireframe, center),
- Autofokus na bieżącą część (`czesc`) z URL,
- Zero zmian w Twojej treści. Progressive enhancement — jak się nie załaduje, stara wersja działa.

Instalacja:
1) Wrzuć pliki do `assets/`:
   - bh-3d.css
   - bh-features-config.js (z flagą body3d:true)
   - bh-init-3d.js
   - bh-3d.js

2) Na stronach (np. index/kobieta/mezczyzna/dziecko/szczegoly) dodaj **przed `</body>`**:
   <script src="assets/bh-features-config.js"></script>
   <script src="assets/bh-init-3d.js"></script>
   <script src="assets/bh-3d.js"></script>

Modele (opcjonalnie, dla „filmowego” efektu):
- Ten pakiet buduje elegancki model z prymitywów (bardzo dopracowany proxy).
- Jeśli chcesz **fotorealistyczny** efekt: dodaj pliki GLB do `assets/models/` i rozszerzymy loader.
  Nazwij części w GLB tak, by zgadzały się z kluczami: glowa, szyja, klatka, brzuch, biodra, ramie, dlon,
  udo, lydka, stopy (lub mapę nazw dodamy w JS).

Bezpieczeństwo:
- Nie dotykamy Twoich CONTENT_PL/EN.
- Jeśli przeglądarka lub CDN z three.js nie odpowie — moduł się nie pokaże, strona zachowa się jak wcześniej.
