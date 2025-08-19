document.addEventListener('DOMContentLoaded', function() {
  const overlays = document.querySelectorAll('.overlay');
  const detailContent = document.getElementById('detail-content');

  // Dane informacyjne dla każdej części ciała
  const content = {
    head: `
      <h3>Głowa</h3>
      <p><strong>Typowe przyczyny bólu:</strong> napięciowy ból głowy, migrena, zapalenie zatok.</p>
      <p><strong>Objawy:</strong> pulsujący ból, ból uciskowy, światłowstręt, nudności.</p>
      <p><strong>Rekomendacje:</strong></p>
      <ul>
        <li>Wykonaj badania podstawowe (morfologia, ciśnienie krwi).</li>
        <li>Skontaktuj się z lekarzem rodzinnym lub neurologiem.</li>
        <li>Unikaj czynników wyzwalających (stres, odwodnienie).</li>
      </ul>
    `,
    torso: `
      <h3>Tułów</h3>
      <p><strong>Typowe przyczyny bólu:</strong> ból w klatce piersiowej (dławica, zapalenie opłucnej), ból brzucha (wrzody, refluks), ból pleców (dyskopatia).</p>
      <p><strong>Objawy:</strong> palący ból, ucisk, kłucie, promieniowanie do kończyn.</p>
      <p><strong>Rekomendacje:</strong></p>
      <ul>
        <li>Skonsultuj się z lekarzem rodzinnym; w razie bólu w klatce piersiowej natychmiast wezwij pomoc.</li>
        <li>Wykonaj diagnostykę (EKG, gastroskopia, RTG kręgosłupa) w zależności od lokalizacji.</li>
        <li>Odwiedź specjalistę: kardiolog, gastroenterolog, ortopeda.</li>
      </ul>
    `,
    arms: `
      <h3>Ręce i dłonie</h3>
      <p><strong>Typowe przyczyny bólu:</strong> urazy, zapalenie stawów, zespół cieśni nadgarstka, neuropatie.</p>
      <p><strong>Objawy:</strong> drętwienie, ból stawów, osłabienie chwytu.</p>
      <p><strong>Rekomendacje:</strong></p>
      <ul>
        <li>Odpoczynek i unikanie przeciążenia.</li>
        <li>Wizyta u ortopedy lub neurologa.</li>
        <li>Badania obrazowe (USG, rezonans) w przypadku utrzymującego się bólu.</li>
      </ul>
    `,
    legs: `
      <h3>Nogi i stopy</h3>
      <p><strong>Typowe przyczyny bólu:</strong> urazy, choroby żył, zapalenie stawów biodrowych i kolanowych, rwa kulszowa.</p>
      <p><strong>Objawy:</strong> obrzęk, ból przy chodzeniu, promieniujący ból od kręgosłupa.</p>
      <p><strong>Rekomendacje:</strong></p>
      <ul>
        <li>Unikaj długotrwałego stania; stosuj kompresję przy problemach żylnych.</li>
        <li>Skonsultuj się z ortopedą lub angiologiem.</li>
        <li>Wykonaj badania (USG Doppler, RTG stawów) według zaleceń lekarza.</li>
      </ul>
    `
  };

  overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      const part = e.target.getAttribute('data-part');
      if (content[part]) {
        detailContent.innerHTML = content[part];
      }
    });
  });
});
