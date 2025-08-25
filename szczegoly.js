(function () {
  // Pomocnicze – unikalne elementy tablic (spina dane z 2 plików JSON)
  function uniq(arr) {
    return Array.from(new Set((arr || []).filter(Boolean)));
  }

  // Złączenie 2 węzłów: detailed (bogatszy) + base (ubogi)
  function mergeNodes(detailed, base) {
    const src = detailed || {};
    const fall = base || {};
    const out = {};

    // pola tekstowe
    out.title = src.title || fall.title || "Szczegóły";

    // pola tablicowe – łączymy i usuwamy duplikaty
    const keys = [
      "causes",
      "symptoms",
      "concerns",
      "doctors",
      "medications",
      "first_aid",
      "emergency",
      "rehabilitation",
      "avoid",
      "prevention",
      "mistakes"
    ];
    keys.forEach(k => {
      out[k] = uniq([...(fall[k] || []), ...(src[k] || [])]);
    });

    // opis
    out.description = (src.description || "") || (fall.description || "");

    return out;
  }

  function card(title, items) {
    const div = document.createElement("article");
    div.className = "card";
    let html = `<div class="card-caption">${title}</div>`;

    if (Array.isArray(items)) {
      html += "<ul>";
      for (const it of items) html += `<li>${it}</li>`;
      html += "</ul>";
    } else if (typeof items === "string" && items.trim()) {
      html += `<p>${items}</p>`;
    } else {
      html += `<p>Brak danych.</p>`;
    }

    div.innerHTML = html;
    return div;
  }

  function emergencyCard(items) {
    const div = card("🚨 Niezwłoczna pomoc (112/SOR)", items && items.length ? items : [
      "Silny, narastający ból.",
      "Duszność, zlewne poty, omdlenie.",
      "Objawy udaru (osłabienie, bełkotliwa mowa, opadnięty kącik ust).",
      "Ostra duszność, sinica, krwioplucie, silny uraz."
    ]);
    div.classList.add("emergency");
    return div;
  }

  async function getJSON(url) {
    const res = await fetch(`${url}?ts=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status + " @ " + url);
    return res.json();
  }

  async function render() {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    const content = document.getElementById("content");
    const titleEl = document.getElementById("title");
    const back = document.getElementById("sectionBack");

    if (!id || !content) return;

    // link „wróć do wyboru sekcji”
    function sectionUrlFromId(_id) {
      if (!_id) return "index.html";
      const isK = _id.endsWith("_k");
      const isM = _id.endsWith("_m");
      const mapK = {
        oczy_k: "kobieta-glowa.html", uszy_k: "kobieta-glowa.html", nos_k: "kobieta-glowa.html",
        szczeka_k: "kobieta-glowa.html", szyja_k: "kobieta-glowa.html", glowa_k: "kobieta-glowa.html",
        serce_k: "kobieta-klatka.html", pluca_k: "kobieta-klatka.html", klatka_piersiowa_k: "kobieta-klatka.html",
        brzuch_k: "kobieta-klatka.html", plecy_k: "kobieta-klatka.html",
        uklad_krw_k: "kobieta-klatka.html", uklad_oddech_k: "kobieta-klatka.html", uklad_pokarm_k: "kobieta-klatka.html",
        biodra_k: "kobieta-nogi.html", uda_k: "kobieta-nogi.html", kolano_k: "kobieta-nogi.html",
        lydka_k: "kobieta-nogi.html", kostka_k: "kobieta-nogi.html", stopy_k: "kobieta-nogi.html",
        ciaza_k: "kobieta.html"
      };
      const mapM = {
        oczy_m: "mezczyzna-glowa.html", uszy_m: "mezczyzna-glowa.html", nos_m: "mezczyzna-glowa.html",
        szczeka_m: "mezczyzna-glowa.html", szyja_m: "mezczyzna-glowa.html", glowa_m: "mezczyzna-glowa.html",
        serce_m: "mezczyzna-klatka.html", pluca_m: "mezczyzna-klatka.html", klatka_piersiowa_m: "mezczyzna-klatka.html",
        brzuch_m: "mezczyzna-klatka.html", plecy_m: "mezczyzna-klatka.html",
        uklad_krw_m: "mezczyzna-klatka.html", uklad_oddech_m: "mezczyzna-klatka.html", uklad_pokarm_m: "mezczyzna-klatka.html",
        biodra_m: "mezczyzna-nogi.html", uda_m: "mezczyzna-nogi.html", kolano_m: "mezczyzna-nogi.html",
        lydka_m: "mezczyzna-nogi.html", kostka_m: "mezczyzna-nogi.html", stopy_m: "mezczyzna-nogi.html"
      };
      if (isK) return mapK[_id] || "kobieta.html";
      if (isM) return mapM[_id] || "mezczyzna.html";
      return "index.html";
    }
    if (back) back.href = sectionUrlFromId(id);

    try {
      // 1) bogatszy
      const detailed = await getJSON("data/detailed_conditions.json");
      // 2) bazowy (fallback)
      const base = await getJSON("data/conditions.json");

      const merged = mergeNodes(detailed[id], base[id]);
      if (!merged.title && !merged.causes?.length) {
        content.innerHTML = "<p>Brak danych dla tego obszaru.</p>";
        return;
      }

      // tytuł
      if (titleEl) titleEl.textContent = merged.title;

      // siatka 3x
      const grid = document.createElement("section");
      grid.className = "cards";

      // standardowe sekcje
      if (merged.causes?.length)     grid.appendChild(card("🌀 Możliwe przyczyny", merged.causes));
      if (merged.symptoms?.length)   grid.appendChild(card("🤒 Objawy", merged.symptoms));
      if (merged.concerns?.length)   grid.appendChild(card("⚠️ Kiedy się niepokoić", merged.concerns));
      if (merged.doctors?.length)    grid.appendChild(card("👨‍⚕️ Lekarze", merged.doctors));
      if (merged.medications?.length)grid.appendChild(card("💊 Leki", merged.medications));
      if (merged.first_aid?.length)  grid.appendChild(card("⛑️ Pierwsza pomoc", merged.first_aid));

      // nowe sekcje
      if (merged.rehabilitation?.length) grid.appendChild(card("🏃 Rehabilitacja / Ćwiczenia", merged.rehabilitation));
      if (merged.avoid?.length)          grid.appendChild(card("❌ Czego unikać", merged.avoid));
      if (merged.prevention?.length)     grid.appendChild(card("✅ Profilaktyka", merged.prevention));
      if (merged.mistakes?.length)       grid.appendChild(card("⚠️ Najczęstsze błędy", merged.mistakes));

      // emergency zawsze NA KOŃCU
      grid.appendChild(emergencyCard(merged.emergency));

      // opis (jako osobny kafelek)
      if (merged.description && merged.description.trim()) {
        grid.appendChild(card("ℹ️ Dodatkowe informacje", merged.description));
      }

      content.innerHTML = "";
      content.appendChild(grid);
    } catch (e) {
      console.error(e);
      content.innerHTML = `<p class="error">Błąd wczytywania danych: ${e.message}</p>`;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
