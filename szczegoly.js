(async function() {
  function card(title, items) {
    const div = document.createElement("article");
    div.className = "card";

    let html = `<div class="card-caption">${title}</div><ul>`;
    for (const it of items) {
      html += `<li>${it}</li>`;
    }
    html += "</ul>";

    div.innerHTML = html;
    return div;
  }

  async function render() {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    const content = document.getElementById("content");

    if (!id || !content) return;

    try {
      const res = await fetch("data/detailed_conditions.json?" + Date.now());
      const data = await res.json();
      const node = data[id];

      if (!node) {
        content.innerHTML = `<p>Brak danych dla tego obszaru.</p>`;
        return;
      }

      const grid = document.createElement("section");
      grid.className = "grid-container";

      // Tytuł
      const h1 = document.createElement("h1");
      h1.textContent = node.title;
      content.appendChild(h1);

      // Standardowe sekcje
      if (node.causes && node.causes.length)        grid.appendChild(card("🌀 Możliwe przyczyny", node.causes));
      if (node.symptoms && node.symptoms.length)    grid.appendChild(card("🤒 Objawy", node.symptoms));
      if (node.concerns && node.concerns.length)    grid.appendChild(card("⚠️ Kiedy się niepokoić", node.concerns));
      if (node.doctors && node.doctors.length)      grid.appendChild(card("👨‍⚕️ Lekarze", node.doctors));
      if (node.medications && node.medications.length) grid.appendChild(card("💊 Leki", node.medications));
      if (node.first_aid && node.first_aid.length)  grid.appendChild(card("⛑️ Pierwsza pomoc", node.first_aid));
      if (node.emergency && node.emergency.length)  grid.appendChild(card("🚨 Niezwłoczna pomoc", node.emergency));

      // ➕ Nowe sekcje
      if (node.rehabilitation && node.rehabilitation.length) 
        grid.appendChild(card("🏃 Rehabilitacja / Ćwiczenia", node.rehabilitation));

      if (node.avoid && node.avoid.length) 
        grid.appendChild(card("❌ Czego unikać", node.avoid));

      if (node.prevention && node.prevention.length) 
        grid.appendChild(card("✅ Profilaktyka", node.prevention));

      if (node.mistakes && node.mistakes.length) 
        grid.appendChild(card("⚠️ Najczęstsze błędy", node.mistakes));

      // Opis ogólny
      if (node.description) {
        const desc = document.createElement("article");
        desc.className = "card";
        desc.innerHTML = `<div class="card-caption">ℹ️ Dodatkowe informacje</div><p>${node.description}</p>`;
        grid.appendChild(desc);
      }

      content.appendChild(grid);
    } catch (err) {
      console.error(err);
      content.innerHTML = "<p>Błąd ładowania danych.</p>";
    }
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", render);
  else
    render();
})();
