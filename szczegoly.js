// Tworzy element
function el(tag, className, text) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text) e.innerHTML = text;
  return e;
}

// Lista
function buildList(arr) {
  const ul = document.createElement("ul");
  arr.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = item;
    ul.appendChild(li);
  });
  return ul;
}

// Budowa karty
function cardFor(key, value, titleText) {
  const c = el("section", "card");
  const head = el("div", "card__head");
  head.appendChild(el("h3", "card__title", titleText));
  c.appendChild(head);

  const body = el("div", "card__body");

  // Kolorowanie leków
  if (key === "medications" && Array.isArray(value)) {
    const formatted = value.map(line =>
      line.replace(/^Bez recepty:/i, `<span class="tag tag--otc">Bez recepty:</span>`)
          .replace(/^Na receptę:/i, `<span class="tag tag--rx">Na receptę:</span>`)
    );
    body.appendChild(buildList(formatted));
  } else if (Array.isArray(value)) {
    body.appendChild(buildList(value));
  } else if (typeof value === "string") {
    body.appendChild(el("p", null, value));
  }

  c.appendChild(body);

  // Emergency specjalny kafel
  if (key === "emergency") {
    c.classList.add("emergency");
    c.addEventListener("click", () => window.location.href = "pomoc.html");
  }

  return c;
}

// 🔹 Kolejność sekcji (dodane thresholds)
const sections = [
  { key: "causes", title: "🔎 Przyczyny" },
  { key: "symptoms", title: "🤕 Objawy" },
  { key: "concerns", title: "❗ Kiedy się niepokoić" },
  { key: "thresholds", title: "⚠️ Progi alarmowe" }, // NOWA SEKCJA
  { key: "doctors", title: "👩‍⚕️ Lekarze" },
  { key: "medications", title: "💊 Leki" },
  { key: "first_aid", title: "⛑️ Pierwsza pomoc" },
  { key: "rehab", title: "🏃 Rehabilitacja" },
  { key: "avoid", title: "🚫 Czego unikać" },
  { key: "prevention", title: "🛡️ Profilaktyka" },
  { key: "mistakes", title: "⚡ Częste błędy" },
  { key: "now_do", title: "👉 Co robić teraz (3 kroki)" },
  { key: "emergency", title: "🚨 Niezwłoczna pomoc" },
  { key: "info", title: "ℹ️ Dodatkowe informacje" }
];

// Renderowanie
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch("detailed_conditions.json")
  .then(r => r.json())
  .then(data => {
    const section = data[id];
    if (!section) return;

    document.getElementById("sectionTitle").textContent = section.title;
    const container = document.getElementById("cardsContainer");

    sections.forEach(({ key, title }) => {
      const val = section[key];
      if (!val || (Array.isArray(val) && val.length === 0)) return;
      container.appendChild(cardFor(key, val, title));
    });
  })
  .catch(err => {
    console.error("Błąd ładowania JSON:", err);
  });
