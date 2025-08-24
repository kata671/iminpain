// szczegoly.js — samowystarczalny loader + układ + „emergency #5” + odporność na nadpisy

(function () {
  const QID = new URLSearchParams(location.search).get("id");

  // 1) Ustaw link „Wróć do wyboru sekcji”
  (function setBackLink() {
    const mapK = {
      oczy_k:"kobieta-glowa.html", uszy_k:"kobieta-glowa.html", nos_k:"kobieta-glowa.html",
      szczeka_k:"kobieta-glowa.html", szyja_k:"kobieta-glowa.html", glowa_k:"kobieta-glowa.html",
      serce_k:"kobieta-klatka.html", pluca_k:"kobieta-klatka.html",
      klatka_piersiowa_k:"kobieta-klatka.html", brzuch_k:"kobieta-klatka.html", plecy_k:"kobieta-klatka.html",
      uklad_krw_k:"kobieta-klatka.html", uklad_oddech_k:"kobieta-klatka.html", uklad_pokarm_k:"kobieta-klatka.html",
      biodra_k:"kobieta-nogi.html", uda_k:"kobieta-nogi.html", kolano_k:"kobieta-nogi.html",
      lydka_k:"kobieta-nogi.html", kostka_k:"kobieta-nogi.html", stopy_k:"kobieta-nogi.html",
      ciaza_k:"kobieta.html"
    };
    const mapM = {
      oczy_m:"mezczyzna-glowa.html", uszy_m:"mezczyzna-glowa.html", nos_m:"mezczyzna-glowa.html",
      szczeka_m:"mezczyzna-glowa.html", szyja_m:"mezczyzna-glowa.html", glowa_m:"mezczyzna-glowa.html",
      serce_m:"mezczyzna-klatka.html", pluca_m:"mezczyzna-klatka.html",
      klatka_piersiowa_m:"mezczyzna-klatka.html", brzuch_m:"mezczyzna-klatka.html", plecy_m:"mezczyzna-klatka.html",
      uklad_krw_m:"mezczyzna-klatka.html", uklad_oddech_m:"mezczyzna-klatka.html", uklad_pokarm_m:"mezczyzna-klatka.html",
      biodra_m:"mezczyzna-nogi.html", uda_m:"mezczyzna-nogi.html", kolano_m:"mezczyzna-nogi.html",
      lydka_m:"mezczyzna-nogi.html", kostka_m:"mezczyzna-nogi.html", stopy_m:"mezczyzna-nogi.html"
    };
    const back = document.getElementById("sectionBack");
    if (!back || !QID) return;
    const href = QID.endsWith("_k") ? (mapK[QID] || "kobieta.html")
              : QID.endsWith("_m") ? (mapM[QID] || "mezczyzna.html")
              : "index.html";
    back.href = href;
  })();

  // 2) Helpery
  function el(tag, cls, html){ const e=document.createElement(tag); if(cls) e.className=cls; if(html!==undefined) e.innerHTML=html; return e; }
  function card(title, items){
    const c = el("div","card"); c.appendChild(el("h3",null,title));
    if (Array.isArray(items)) { const ul = el("ul"); items.forEach(x=>ul.appendChild(el("li",null,x))); c.appendChild(ul); }
    else if (typeof items === "string") { c.appendChild(el("p",null,items)); }
    return c;
  }

  // 3) Wstrzyknij minimalny CSS tylko jeśli go brak (żeby nie burzyć Twoich stylów)
  (function ensureLocalCSS(){
    if (document.getElementById("szczegoly-local-css")) return;
    const s = document.createElement("style");
    s.id = "szczegoly-local-css";
    s.textContent = `
      body[data-page="szczegoly"] #content .cards{
        display:grid !important; grid-template-columns:repeat(3,minmax(0,1fr)) !important;
        gap:24px !important; justify-items:center !important; align-items:start !important;
        max-width:1100px !important; margin:28px auto !important; padding:0 8px !important;
      }
      body[data-page="szczegoly"] #content .card{
        max-width:320px; border-radius:16px; background:rgba(34,42,90,.85);
        border:2px solid #5463b5; box-shadow:0 6px 16px rgba(0,0,0,.25);
        transition:transform .15s, box-shadow .15s, background .15s; padding:16px;
      }
      body[data-page="szczegoly"] #content .card:hover{
        transform:translateY(-2px);
        box-shadow:0 10px 24px rgba(255,255,255,.12), 0 0 20px rgba(165,140,255,.25);
      }
      body[data-page="szczegoly"] #content .card.emergency{
        background:rgba(120,8,8,.22); border:2px solid #ff3c3c;
        box-shadow:inset 0 0 2px rgba(255,60,60,.5), 0 6px 18px rgba(0,0,0,.35);
      }
      body[data-page="szczegoly"] #content .card.emergency:hover{
        box-shadow:0 10px 28px rgba(0,0,0,.5), 0 0 28px rgba(255,40,40,.9);
      }
      @media (max-width:980px){ body[data-page="szczegoly"] #content .cards{ grid-template-columns:repeat(2,minmax(0,1fr)) !important; } }
      @media (max-width:640px){ body[data-page="szczegoly"] #content .cards{ grid-template-columns:minmax(0,1fr) !important; } }
    `;
    document.head.appendChild(s);
  })();

  // 4) Loader JSON z fallbackami
  async function fetchData() {
    const sources = [
      "/data/detailed_conditions.json",
      "data/detailed_conditions.json",
      "/data/conditions.json",
      "data/conditions.json",
      "/detailed_conditions.json",
      "detailed_conditions.json"
    ];
    for (const src of sources) {
      try {
        const r = await fetch(src + "?ts=" + Date.now(), { cache: "no-store" });
        if (!r.ok) continue;
        return await r.json();
      } catch (_) {}
    }
    return null;
  }

  // 5) Render + „emergency” na pozycji 5 (index 4)
  function placeEmergencyAtIndex5(grid){
    const em = Array.from(grid.children).find(c => c.classList && c.classList.contains("emergency"));
    if (!em) return;
    const targetIndex = 4;
    if (grid.children.length <= targetIndex) grid.appendChild(em);
    else grid.insertBefore(em, grid.children[targetIndex]);
  }

  function snapshot(content){ window.__SZ_SNAPSHOT__ = content.innerHTML; }
  function restoreIfCleared(content){
    if (!window.__SZ_SNAPSHOT__) return;
    if (!content.querySelector(".cards")) {
      content.innerHTML = window.__SZ_SNAPSHOT__;
    }
  }

  async function render() {
    const content = document.getElementById("content");
    const titleEl = document.getElementById("title");
    const err = document.getElementById("err");
    if (!content || !QID) return;

    // Jeżeli już jest siatka — tylko zabezpiecz
    if (content.querySelector(".cards")) { snapshot(content); return; }

    const data = await fetchData();
    if (!data || !data[QID]) {
      if (err) { err.style.display="block"; err.textContent = "Brak danych JSON dla: " + QID; }
      return;
    }
    const node = data[QID];
    if (titleEl) titleEl.textContent = node.title || QID;

    const grid = el("div","cards");
    if (node.causes)      grid.appendChild(card("Możliwe przyczyny bólu", node.causes));
    if (node.symptoms)    grid.appendChild(card("Typowe objawy", node.symptoms));
    if (node.concerns)    grid.appendChild(card("⚠️ Obawy / pilne sygnały", node.concerns));
    if (node.doctors)     grid.appendChild(card("Do jakiego lekarza", node.doctors));
    if (node.medications) grid.appendChild(card("Leki / środki łagodzące", node.medications));
    if (node.first_aid)   grid.appendChild(card("Pierwsza pomoc (domowa)", node.first_aid));

    const emergencyList = Array.isArray(node.emergency) ? node.emergency : [
      "Silny, narastający ból, duszność, zlewne poty, omdlenie.",
      "Objawy udaru: osłabienie, bełkotliwa mowa, opadnięty kącik ust.",
      "Ostra duszność, sinica, krwawienie, silny uraz.",
      "W razie wątpliwości: natychmiast zadzwoń 112."
    ];
    const em = card("Niezwłoczna pomoc (112/SOR)", emergencyList);
    em.classList.add("emergency");
    grid.appendChild(em);

    content.innerHTML = "";
    content.appendChild(grid);

    if (node.description) {
      const p = document.createElement("p");
      p.style.marginTop = "16px";
      p.textContent = node.description;
      content.appendChild(p);
    }

    placeEmergencyAtIndex5(grid);
    snapshot(content);
  }

  // 6) Obserwator — jeśli inny skrypt wyczyści #content, odtwarzamy
  function armObserver(){
    const content = document.getElementById("content");
    if (!content || !("MutationObserver" in window)) return;
    const mo = new MutationObserver(() => restoreIfCleared(content));
    mo.observe(content, { childList:true, subtree:false });
  }

  // 7) Start
  function start(){
    render();
    setTimeout(render, 200);   // retry po krótkim czasie
    setInterval(() => {        // lekkie okresowe utrzymanie
      const content = document.getElementById("content");
      if (content && !content.querySelector(".cards")) render();
    }, 3000);
    armObserver();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
