/* Kolory „Bez recepty/Na receptę” + emoji w nagłówkach
   Działa po pełnym wyrenderowaniu treści. */
(function(){
  function addEmojisAndColors(){
    const iconMap = [
      [/możliwe przyczyny/i, "🧩"],
      [/objawy/i, "🩺"],
      [/kiedy się niepokoić/i, "⚠️"],
      [/lekarze/i, "👤"],
      [/leki/i, "💊"],
      [/pierwsza pomoc/i, "🧰"],
      [/rehabilitacja|ćwiczenia/i, "🏃‍♂️"],
      [/czego unikać/i, "✖️"],
      [/profilaktyka/i, "🛡️"],
      [/najczęstsze błędy/i, "⚠️"],
      [/dodatkowe informacje/i, "ℹ️"],
      [/niezwłoczna pomoc/i, "🚨"]
    ];

    document.querySelectorAll('.card h3').forEach(h=>{
      const title = h.textContent.trim();
      // emoji
      for(const [re, emo] of iconMap){
        if(re.test(title) && !h.dataset.emojiApplied){
          h.innerHTML = `${emo} ${h.innerHTML}`;
          h.dataset.emojiApplied = "1";
          break;
        }
      }
      // kolory w sekcji „Leki”
      if(/leki/i.test(title)){
        const ul = h.parentElement.querySelector('ul');
        if(!ul) return;
        ul.querySelectorAll('li').forEach(li=>{
          const txt = li.textContent.trim();
          if(/^bez recepty\b/i.test(txt)){
            li.innerHTML = txt.replace(/^bez recepty\s*:/i, "<span class='otc'>Bez recepty:</span>");
          }else if(/^na recept(?:ę|e)\b/i.test(txt)){
            li.innerHTML = txt.replace(/^na recept(?:ę|e)\s*:/i, "<span class='rx'>Na receptę:</span>");
          }
        });
      }
    });
  }

  // uruchom pewniakiem po załadowaniu wszystkiego
  window.addEventListener('load', addEmojisAndColors);
})();
