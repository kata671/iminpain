function odpowiedz(index) {
  const wynik = document.getElementById("wynik");
  if (index === 1) {
    wynik.textContent = "✅ Dobrze! Sprawdzenie oddechu i wezwanie pomocy to priorytet.";
    wynik.style.color = "lightgreen";
  } else {
    wynik.textContent = "❌ Niepoprawnie. Najpierw sprawdź oddech i wezwij pomoc.";
    wynik.style.color = "orange";
  }
}
