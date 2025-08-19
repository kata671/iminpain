// Mapowanie obszarów → opis i obrazek
const descriptions = {
  "kobieta-twarz": {
    title: "Głowa",
    img: "img/kobieta-twarz.png",
    desc: "Ból głowy może mieć różne przyczyny: stres, migrena, infekcje zatok, napięcie mięśniowe."
  },
  "kobieta-gora": {
    title: "Góra tułowia",
    img: "img/kobieta-gora.png",
    desc: "Ból w górnej części ciała często wiąże się z mięśniami karku i barków."
  },
  "serce-pluca": {
    title: "Klatka piersiowa",
    img: "img/serce-pluca.png",
    desc: "Ból w klatce piersiowej może oznaczać problemy z sercem, płucami lub mięśniami."
  },
  "uklad-pokarmowy": {
    title: "Brzuch",
    img: "img/uklad-pokarmowy.png",
    desc: "Ból brzucha bywa związany z układem pokarmowym, wątrobą lub jelitami."
  },
  "kobieta-biodra": {
    title: "Biodra",
    img: "img/kobieta-biodra.png",
    desc: "Bóle bioder mogą pochodzić od stawów, mięśni lub przeciążeń."
  },
  "nogi": {
    title: "Nogi",
    img: "img/nogi.png",
    desc: "Ból nóg może wynikać z przeciążenia, żylaków lub problemów stawowych."
  },
  "kregoslup": {
    title: "Kręgosłup",
    img: "img/kregoslup.png",
    desc: "Bóle pleców i kręgosłupa są jedną z najczęstszych dolegliwości – mogą wynikać z pracy siedzącej lub urazów."
  },
  "stawy": {
    title: "Stawy",
    img: "img/stawy.png",
    desc: "Bóle stawów często są związane z reumatyzmem, urazami lub stanami zapalnymi."
  }
};

// Obsługa kliknięcia
document.querySelectorAll("area").forEach(area => {
  area.addEventListener("click", e => {
    e.preventDefault();
    const key = area.dataset.target;
    if(descriptions[key]){
      document.getElementById("modal-title").textContent = descriptions[key].title;
      document.getElementById("modal-img").src = descriptions[key].img;
      document.getElementById("modal-desc").textContent = descriptions[key].desc;
      document.getElementById("modal").style.display = "flex";
    }
  });
});

// Zamknięcie modala
document.getElementById("close").addEventListener("click", ()=>{
  document.getElementById("modal").style.display = "none";
});
