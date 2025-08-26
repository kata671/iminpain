// Tworzy element
function el(tag, className, text){
  const e = document.createElement(tag);
  if(className) e.className = className;
  if(text) e.innerHTML = text;
  return e;
}

// Lista
function buildList(arr){
  const ul = document.createElement("ul");
  arr.forEach(item=>{
    const li = document.createElement("li");
    li.innerHTML = item;
    ul.appendChild(li);
  });
  return ul;
}

// Budowa karty
function cardFor(key, value, titleText){
  const c = el("section","card");
  const head = el("div","card__head");
  head.appendChild(el("h3","card__title",titleText));
  c.appendChild(head);

  const body = el("div","card__body");
  if(key==="medications" && Array.isArray(value)){
    const formatted = value.map(line =>
      line.replace(/^Bez recepty:/i, `<span class="tag tag--otc">Bez recepty:</span>`)
          .replace(/^Na receptę:/i, `<span class="tag tag--rx">Na receptę:</span>`)
    );
    body.appendChild(buildList(formatted));
  } else if(Array.isArray(value)){
    body.appendChild(buildList(value));
  } else if(typeof value==="string"){
    body.appendChild(el("p",null,value));
  }
  c.appendChild(body);

  // Emergency special
  if(key==="emergency"){
    c.classList.add("emergency");
    c.addEventListener("click", ()=> window.location.href="pomoc.html");
  }

  return c;
}

// Dane (tu możesz dokładać kolejne bogatsze treści)
const conditions = {
  "kolano_m": {
    title: "Kolano — mężczyzna",
    cards: {
      causes: ["Skręcenie, łąkotki","ACL/PCL","Zapalenia, chondromalacja","Przeciążenia"],
      symptoms: ["Ból ostry/tępy, obrzęk","Blokowanie, niestabilność"],
      worry: ["Obrzęk + brak obciążenia","Blokada/niestabilność","Gorączka + ból/obrzęk"],
      doctors: ["Ortopeda/traumatolog","Fizjoterapeuta","POZ"],
      medications: [
        "Bez recepty: paracetamol, ibuprofen/naproksen, żele",
        "Na receptę: NLPZ/COX-2, leki osłonowe, ortezy wg lekarza"
      ],
      firstAid: ["RICE, kompresja, elewacja","Odciążanie (kule/stabilizator)"],
      avoid: ["Głębokie przysiady/skoki na początku"],
      prevention: ["FIFA 11+, rozgrzewka/schłodzenie","Wymiana butów 600–800 km"],
      extra: ["Stabilność kolana zależy od pośladków i czworogłowych"],
      emergency: ["Deformacja, silny obrzęk, podejrzenie złamania — 112/SOR"]
    }
  },

  "oczy_k": {
    title: "Oczy — kobieta",
    cards: {
      causes: ["Zespół suchego oka","Zapalenie spojówek","Podrażnienie ekran/wiatr","Ciało obce"],
      symptoms: ["Szczypanie, pieczenie, łzawienie","Światłowstręt","Poczucie piasku w oku","Zaczerwienienie"],
      worry: ["Nagłe pogorszenie ostrości","Silny ból, światłowstręt","Uraz chemiczny/mechaniczny"],
      doctors: ["Okulista","POZ (skierowanie, krople)"],
      medications: [
        "Bez recepty: sztuczne łzy, krople na alergię",
        "Na receptę: krople sterydowe/antybiotyki wg okulisty"
      ],
      firstAid: ["Płucz oko solą fizjologiczną","Ogranicz ekran, rób przerwy 20-20-20"],
      avoid: ["Soczewki przy stanie zapalnym","Pocieranie oczu"],
      prevention: ["Nawilżanie powietrza","Przerwy od ekranu, odpowiednie oświetlenie"],
      mistakes: ["Samodzielne sterydy","Brak konsultacji przy pogorszeniu"],
      emergency: ["Nagła utrata widzenia, silny ból — 112/SOR"]
    }
  }
};

// Render
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const section = conditions[id];
if(section){
  document.getElementById("sectionTitle").textContent = section.title;
  const container = document.getElementById("cardsContainer");
  Object.entries(section.cards).forEach(([key,val])=>{
    container.appendChild(cardFor(key,val,key));
  });
}
