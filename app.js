document.addEventListener("DOMContentLoaded", () => {
  const main = document.getElementById("app");
  main.innerHTML = `
    <h1>Szczegóły dolegliwości</h1>
    <section id="objawy">
      <h2>Objawy</h2>
      <ul>
        <li><input type="checkbox" /> Ból głowy</li>
        <li><input type="checkbox" /> Nudności</li>
        <li><input type="checkbox" /> Zawroty głowy</li>
      </ul>
    </section>
    <section id="statystyki">
      <h2>Statystyki</h2>
      <p>🔍 Najczęstsze objawy to ból głowy (55%) i nudności (40%).</p>
    </section>
    <section id="quiz">
      <h2>Trening reagowania</h2>
      <p>Co robisz, gdy ktoś traci przytomność?</p>
      <button onclick="odpowiedz(0)">Podaj wodę</button>
      <button onclick="odpowiedz(1)">Wezwij pomoc i sprawdź oddech</button>
      <button onclick="odpowiedz(2)">Szukaj leków</button>
      <p id="wynik"></p>
    </section>
  `;
});
