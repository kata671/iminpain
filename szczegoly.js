(function () {
  function uniq(arr){ return Array.from(new Set((arr||[]).filter(Boolean))); }

  function mergeNodes(detailed, base){
    const src = detailed || {}, fall = base || {};
    const out = { title: src.title || fall.title || "Szczegóły" };
    const keys = ["causes","symptoms","concerns","doctors","medications","first_aid","emergency","rehabilitation","avoid","prevention","mistakes"];
    keys.forEach(k => out[k] = uniq([...(fall[k]||[]), ...(src[k]||[])]));
    out.description = (src.description || "") || (fall.description || "");
    return out;
  }

  function card(title, items){
    const div = document.createElement("article");
    div.className = "card";
    let html = `<div class="card-caption">${title}</div>`;
    if(Array.isArray(items)){
      html += "<ul>";
      for(const it of items) html += `<li>${it}</li>`;
      html += "</ul>";
    }else if(typeof items === "string" && items.trim()){
      html += `<p>${items}</p>`;
    }else{
      html += `<p>Brak danych.</p>`;
    }
    div.innerHTML = html;
    return div;
  }

  function emergencyCard(items){
    const list = (items && items.length) ? items : [
      "Silny, narastający ból lub zniekształcenie stawu.",
      "Duszność, omdlenie, objawy udaru.",
      "Gorączka + silny ból/obrzęk stawu."
    ];
    const div = card("🚨 Niezwłoczna pomoc (112/SOR)", list);
    div.classList.add("emergency");
    return div;
  }

  // NIEWIDOCZNY „WYPEŁNIACZ”, żeby domknąć rząd do 3 kolumn
  function spacerCard(){
    const div = document.createElement("article");
    div.className = "card spacer";
    div.setAttribute("aria-hidden", "true");
    div.innerHTML = `<div class="card-caption"> </div><p> </p>`;
    return div;
  }

  async function getJSON(url){
    const res = await fetch(`${url}?ts=${Date.now()}`, { cache:"no-store" });
    if(!res.ok) throw new Error(`HTTP ${res.status} @ ${url}`);
    return res.json();
  }

  function sectionUrlFromId(id){
    if(!id) return "index.html";
    const isK = id.endsWith("_k"), isM = id.endsWith("_m");
    const mapK = {
      oczy_k:"kobieta-glowa.html",uszy_k:"kobieta-glowa.html",nos_k:"kobieta-glowa.html",
      szczeka_k:"kobieta-glowa.html",szyja_k:"kobieta-glowa.html",glowa_k:"kobieta-glowa.html",
      serce_k:"kobieta-klatka.html",pluca_k:"kobieta-klatka.html",klatka_piersiowa_k:"kobieta-klatka.html",
      brzuch_k:"kobieta-klatka.html",plecy_k:"kobieta-klatka.html",
      uklad_krw_k:"kobieta-klatka.html",uklad_oddech_k:"kobieta-klatka.html",uklad_pokarm_k:"kobieta-klatka.html",
      biodra_k:"kobieta-nogi.html",uda_k:"kobieta-nogi.html",kolano_k:"kobieta-nogi.html",
      lydka_k:"kobieta-nogi.html",kostka_k:"kobieta-nogi.html",stopy_k:"kobieta-nogi.html",
      ciaza_k:"kobieta.html"
    };
    const mapM = {
      oczy_m:"mezczyzna-glowa.html",uszy_m:"mezczyzna-glowa.html",nos_m:"mezczyzna-glowa.html",
      szczeka_m:"mezczyzna-glowa.html",szyja_m:"mezczyzna-glowa.html",glowa_m:"mezczyzna-glowa.html",
      serce_m:"mezczyzna-klatka.html",pluca_m:"mezczyzna-klatka.html",klatka_piersiowa_m:"mezczyzna-klatka.html",
      brzuch_m:"mezczyzna-klatka.html",plecy_m:"mezczyzna-klatka.html",
      uklad_krw_m:"mezczyzna-klatka.html",uklad_oddech_m:"mezczyzna-klatka.html",uklad_pokarm_m:"mezczyzna-klatka.html",
      biodra_m:"mezczyzna-nogi.html",uda_m:"mezczyzna-nogi.html",kolano_m:"mezczyzna-nogi.html",
      lydka_m:"mezczyzna-nogi.html",kostka_m:"mezczyzna-nogi.html",stopy_m:"mezczyzna-nogi.html"
    };
    if(isK) return mapK[id] || "kobieta.html";
    if(isM) return mapM[id] || "mezczyzna.html";
    return "index.html";
  }

  async function render(){
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    const content = document.getElementById("content");
    const titleEl = document.getElementById("title");
    const back = document.getElementById("sectionBack");
    if(!id || !content) return;
    if(back) back.href = sectionUrlFromId(id);

    try{
      const detailed = await getJSON("data/detailed_conditions.json");
      const base = await getJSON("data/conditions.json");
      const merged = mergeNodes(detailed[id], base[id]);
      if(!merged.title && !merged.causes?.length){
        content.innerHTML = "<p>Brak danych dla tego obszaru.</p>";
        return;
      }
      if(titleEl) titleEl.textContent = merged.title;

      // budujemy listę kafelków w określonej kolejności (bez emergency)
      const tiles = [];
      if(merged.causes?.length)      tiles.push(card("🌀 Możliwe przyczyny", merged.causes));
      if(merged.symptoms?.length)    tiles.push(card("🤒 Objawy", merged.symptoms));
      if(merged.concerns?.length)    tiles.push(card("⚠️ Kiedy się niepokoić", merged.concerns));
      if(merged.doctors?.length)     tiles.push(card("👨‍⚕️ Lekarze", merged.doctors));
      if(merged.medications?.length) tiles.push(card("💊 Leki", merged.medications));
      if(merged.first_aid?.length)   tiles.push(card("⛑️ Pierwsza pomoc", merged.first_aid));
      if(merged.rehabilitation?.length) tiles.push(card("🏃 Rehabilitacja / Ćwiczenia", merged.rehabilitation));
      if(merged.avoid?.length)          tiles.push(card("❌ Czego unikać", merged.avoid));
      if(merged.prevention?.length)     tiles.push(card("✅ Profilaktyka", merged.prevention));
      if(merged.mistakes?.length)       tiles.push(card("⚠️ Najczęstsze błędy", merged.mistakes));

      // zawsze wstaw czerwony kafel na pozycję #4 (index 3)
      const em = emergencyCard(merged.emergency);
      const targetIndex = Math.min(3, tiles.length);
      tiles.splice(targetIndex, 0, em);

      // opcjonalny opis – na końcu
      if(merged.description && merged.description.trim()){
        tiles.push(card("ℹ️ Dodatkowe informacje", merged.description));
      }

      // DOPADANIE SPACERÓW: dopełnij do wielokrotności 3
      const remainder = tiles.length % 3;
      if (remainder !== 0) {
        const toAdd = 3 - remainder;
        for (let i = 0; i < toAdd; i++) tiles.push(spacerCard());
      }

      // render
      const grid = document.createElement("section");
      grid.className = "cards";
      for(const t of tiles) grid.appendChild(t);

      content.innerHTML = "";
      content.appendChild(grid);
    }catch(e){
      console.error(e);
      content.innerHTML = `<p class="error">Błąd wczytywania danych: ${e.message}</p>`;
    }
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", render);
  else render();
})();
