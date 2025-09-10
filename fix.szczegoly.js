/* ========== F I X  S Z C Z E G Ó Ł Y ========== */

/* GRID – 3 w rzędzie, równe odstępy, auto-wysokość */
.cards-grid{
  display:grid;
  grid-template-columns: repeat(3, minmax(260px, 1fr));
  gap: clamp(14px, 2vw, 22px);
  align-items: start;
  justify-items: center;
  width: min(1200px, 96%);
  margin-inline: auto;
}

/* KARTY – żadnego obcinania treści */
.card,
.card.card--danger{
  width: 100%;
  max-width: 520px;
  border-radius: 18px;
  padding: 16px 18px;
  background: rgba(30, 45, 95, 0.78);
  box-shadow: 0 0 0 1px rgba(120,150,255,.25), 0 12px 24px rgba(0,0,0,.35);
}

.card__head{
  display:flex;
  align-items:center;
  gap:.6rem;
  margin-bottom:.6rem;
}

.card__icon{ font-size:1.15rem }
.card__title{
  font-weight:800;
  font-size: clamp(1.05rem, 1.2vw, 1.25rem);
}

/* Treść nigdy nie jest przycinana */
.card__body,
.card p,
.card li{
  max-height: none !important;
  overflow: visible !important;
  white-space: normal !important;
  text-overflow: unset !important;
  -webkit-line-clamp: unset !important;
}

/* Listy – kropki równo wewnątrz karty */
.card .list{
  margin: .2rem 0 0 1.1rem;
  padding: 0;
  list-style: disc;
}
.card .list > li{ margin:.35rem 0; line-height:1.35 }

/* Kolorowanie leków */
.tag{ padding:0 .25rem; border-radius:.35rem; font-weight:800 }
.tag--otc{ color:#0bd66b }
.tag--rx{ color:#ff5a6b }

/* Karta alarmowa jako wyróżnienie + klik */
.card--danger{
  background: linear-gradient(180deg, rgba(130,0,0,.9), rgba(85,0,0,.9));
  box-shadow: 0 0 0 1px rgba(255,100,100,.45), 0 14px 28px rgba(0,0,0,.5);
  border: 1px solid rgba(255,105,97,.5);
  text-decoration: none;
  color: #fff;
}
.card--danger:hover{ transform: translateY(-1px); }

/* RWD – 2 kolumny i 1 kolumna na mniejszych */
@media (max-width: 1024px){
  .cards-grid{ grid-template-columns: repeat(2, minmax(260px,1fr)); }
}
@media (max-width: 640px){
  .cards-grid{ grid-template-columns: 1fr; }
}
