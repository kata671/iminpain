<script>
// ========== S Z C Z E G O Ł Y  ==========
(() => {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const DATA_URL = "data/detailed_conditions.json";

  const ICONS = {
    causes: "🧬",
    symptoms: "🧪",
    concerns: "⚠️",
    doctors: "🧑‍⚕️",
    medications: "💊",
    first_aid: "🆘",
    rehab: "🏋️",
    avoid: "❌",
    prevention: "🌱",
    mistakes: "⚠️",
    emergency: "🎆",
    info: "ℹ️",
    now_do: "👉"
  };

  const TITLES = {
    causes: "Możliwe przyczyny",
    symptoms: "Objawy",
    concerns: "Kiedy się niepokoić",
    doctors: "Lekarze",
    medications: "Leki",
    first_aid: "Pierwsza pomoc",
    rehab: "Rehabilitacja / ćwiczenia",
    avoid: "Czego unikać",
    prevention: "Profilaktyka",
    mistakes: "Najczęstsze błędy",
    emergency: "Niezwłoczna pomoc (112/SOR)",
    info: "Dodatkowe informacje",
    now_do: "Co zrobić teraz (3 kroki)"
  };

  const ORDER = [
    "causes","symptoms","concerns",
    "doctors","medications","first_aid",
    "rehab","avoid","prevention",
    "mistakes","emergency","info","now_do"
  ];

  const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };

  function buildList(items) {
    const ul = el("ul","list");
    items.forEach(t => {
      const li = el("li",null, t);
      ul.appendChild(li);
    });
    return ul;
  }

  function cardFor(key, value, titleText) {
    // Specjalna karta „emergency” jako link do pomoc.html
    if (key === "emergency") {
      const url = new URL("pomoc.html", location.origin);
      url.searchParams.set("from", id || "");
      const a = el("a","card card--danger");
      a.href = url.toString();
      a.setAttribute("aria-label","Otwórz mapę pomocy");
      const head = el("div","card__head",
        `<span class="card__icon">${ICONS[key]||""}</span><span class="card__title">${titleText}</span>`);
      const body = el("div","card__body");
      body.appendChild(buildList(value));
      a.append(head, body);
      return a;
    }

    const card = el("div","card");
    if (key === "medications") card.classList.add("card--meds");
    const head = el("div","card__head",
      `<span class="card__icon">${ICONS[key]||""}</span><span class="card__title">${titleText}</span>`);
    const body = el("div","card__body");

    // value: string | string[]
    if (Array.isArray(value)) {
      body.appendChild(buildList(value));
    } else if (typeof value === "string") {
      body.appendChild(el("p",null,value));
    }

    card.append(head, body);
    return card;
  }

  function renderTitle(title) {
    const h = document.getElementById("page-title");
    if (h) h.textContent = title || "Szczegóły";
  }

  async function render() {
    const content = document.getElementById("content");
    if (!id || !content) return;

    const res = await fetch(`${DATA_URL}?v=${Date.now()}`);
    const data = await res.json();
    const node = data[id];
    if (!node) {
      content.textContent = "Brak danych.";
      return;
    }

    renderTitle(node.title);

    const grid = el("div","cards-grid");
    ORDER.forEach(key => {
      if (!node[key]) return;
      const val = node[key];
      // pustki pomijamy
      if ((Array.isArray(val) && val.length===0) || (typeof val==="string" && !val.trim())) return;
      const titleText = TITLES[key] || key;
      grid.appendChild(cardFor(key, val, titleText));
    });

    content.innerHTML = "";
    content.appendChild(grid);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
</script>
