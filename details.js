// details.js
(function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const titleEl = document.getElementById("title");
  const subtitleEl = document.getElementById("subtitle");
  const cardsEl = document.getElementById("cards");

  if (!id) {
    titleEl.textContent = "Brak identyfikatora";
    subtitleEl.textContent = "Otwórz stronę przez link z kafelka.";
    return;
  }

  fetch("data/conditions.json?_=" + Date.now())
    .then(r => r.json())
    .then(db => {
      const item = db[id];
      if (!item) {
        titleEl.textContent = "Brak danych";
        subtitleEl.textContent = Nie znaleziono treści dla id: ${id};
        return;
      }

      document.title = ${item.tytul} — Szczegóły;
      titleEl.textContent = item.tytul;
      subtitleEl.textContent = item.podtytul || "";

      // pomocnicza funkcja do tworzenia kart
      const card = (header, body) => {
        const s = document.createElement("section");
        s.className = "card-block";
        const h = document.createElement("h3");
        h.textContent = header;
        const c = document.createElement("div");
        c.className = "card-body";
        if (Array.isArray(body)) {
          const ul = document.createElement("ul");
          body.forEach(li => {
            const el = document.createElement("li");
            el.innerHTML = li;
            ul.appendChild(el);
          });
          c.appendChild(ul);
        } else {
          c.innerHTML = body;
        }
        s.appendChild(h);
        s.appendChild(c);
        return s;
      };

      // render sekcji (tylko te, które są w danych)
      const order = [
        ["lokalizacja", "Lokalizacja bólu"],
        ["przyczyny", "Możliwe przyczyny"],
        ["objawy", "Objawy towarzyszące"],
        ["lekarze", "Kto może pomóc"],
        ["leki", "Leki bez recepty (OTC)"],
        ["dom", "Co możesz zrobić w domu"],
        ["pierwsza_pomoc", "Pierwsza pomoc"],
        ["czerwone_flagi", "Czerwone flagi — natychmiastowa pomoc"]
      ];

      order.forEach(([key, label]) => {
        if (item[key]) {
          cardsEl.appendChild(card(label, item[key]));
        }
      });
    })
    .catch(() => {
      titleEl.textContent = "Błąd ładowania danych";
      subtitleEl.textContent = "Sprawdź plik data/conditions.json";
    });
})();
