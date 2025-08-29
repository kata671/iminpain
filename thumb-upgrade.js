// thumb-upgrade.js
(function () {
  const body = document.body;
  if (!body.classList.contains('kobieta-page') &&
      !body.classList.contains('mezczyzna-page')) return;

  // Szukamy kart w siatkach .grid-3 / .grid-4 (obie wersje wspieramy)
  const grids = document.querySelectorAll('.grid-3, .grid-4');
  grids.forEach(grid => {
    grid.querySelectorAll('a.card').forEach(card => {
      try {
        const href = card.getAttribute('href') || '';
        const url  = new URL(href, location.href);
        const id   = url.searchParams.get('id'); // np. "mezczyzna-oko" albo "kobieta-oko"
        if (!id) return;

        const src = `img/${id}.png`; // nazwa pliku w /img

        // Jeśli karta nie ma jeszcze IMG — wstawiamy przed podpisem
        if (!card.querySelector('img.thumb')) {
          const img = document.createElement('img');
          img.className = 'thumb';
          img.alt = card.textContent.trim();
          img.loading = 'lazy';
          img.decoding = 'async';
          img.src = src;

          const firstSpan = card.querySelector('span');
          if (firstSpan) card.insertBefore(img, firstSpan);
          else card.prepend(img);

          // Jeżeli obrazka brak — nie pokazuj pustego IMG
          img.addEventListener('error', () => {
            img.remove();
          });
        }
      } catch (_) { /* cicho */ }
    });
  });
})();
