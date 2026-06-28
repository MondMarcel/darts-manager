const UI = {
  euro(n){ return Math.floor(n).toLocaleString("de-DE")+" €"; },
  season(){ return Math.floor((State.game.week-1)/52)+1; },
  yearWeek(){ return ((State.game.week-1)%52)+1; },
  currentTournament(){ return DATA.annualCalendar.find(t=>t.week===this.yearWeek()) || null; },
  hasTourcard(){ return State.game.week <= State.game.tourcardUntilWeek; },
  formLabel(f){ if(f>=80)return"Topform"; if(f>=65)return"Sehr gut"; if(f>=50)return"Gut"; if(f>=35)return"Normal"; if(f>=20)return"Schwach"; return"Krise"; },
  reputationLabel(v){ if(v>=8)return"Aufstrebend"; if(v>=3)return"Regional bekannt"; if(v<=-5)return"Angeschlagen"; return"Unbekannt"; },
  showAppAfterLogin() {
    document.getElementById("login-screen").classList.add("hidden");
    if (!State.game.player) {
      document.getElementById("start-screen").classList.remove("hidden");
      document.getElementById("game-screen").classList.add("hidden");
      this.renderChoices();
    } else {
      document.getElementById("start-screen").classList.add("hidden");
      document.getElementById("game-screen").classList.remove("hidden");
      this.render();
    }
  },
  renderChoices() {
    const wrap=document.getElementById("choices"); wrap.innerHTML="";
    DATA.starters.forEach((p,i)=>{
      const div=document.createElement("div"); div.className="card player-choice"; div.onclick=()=>Game.choosePlayer(i);
      div.innerHTML=`<h3>${p.name}</h3><div class="small">${p.age} Jahre · ${p.nation} · ${p.type}</div><hr>
      <div class="stat"><span>Saison-Average</span><strong>${p.avg.toFixed(1)}</strong></div>
      <div class="stat"><span>Doppelquote</span><strong>${p.double}%</strong></div>
      <div class="stat"><span>180er pro Leg</span><strong>${p.maxes.toFixed(2)}</strong></div>
      <div class="stat"><span>Checkout 100+</span><strong>${p.checkout}%</strong></div>
      <div style="margin-top:10px;"><span class="tag good">${p.talent}</span><span class="tag bad">${p.flaw}</span></div>
      <p class="small">${p.report}</p>`;
      wrap.appendChild(div);
    });
  },
  render() {
    const g=State.game, p=g.player; if(!p)return;
    p.age=p.startAge+Math.floor((g.week-1)/52);
    const t=this.currentTournament();
    document.getElementById("profileName").textContent=g.profileName;
    document.getElementById("week").textContent=`${g.week} (Saison ${this.season()}, KW ${this.yearWeek()})`;
    document.getElementById("budget").textContent=this.euro(g.budget);
    document.getElementById("reputation").textContent=this.reputationLabel(g.reputation);
    document.getElementById("trainerLevel").textContent=g.trainerLevel;
    document.getElementById("scoutLevel").textContent=g.scoutLevel;
    document.getElementById("nextTournamentName").textContent=t?t.name:"Kein Turnier";
    document.getElementById("nextTournamentCategory").textContent=t?t.category:"-";
    document.getElementById("entryFee").textContent=t?this.euro(t.fee):"-";
    document.getElementById("nextTournamentPrize").textContent=t?this.euro(t.winnerPrize):"-";
    document.getElementById("playerName").textContent=p.name;
    document.getElementById("playerMeta").textContent=`${p.age} Jahre · ${p.nation} · ${p.type}`;
    document.getElementById("tourcard").textContent=this.hasTourcard()?`Ja, bis Woche ${g.tourcardUntilWeek}`:"Nein";
    document.getElementById("playerPrize").textContent=this.euro(g.playerPrize);
    document.getElementById("avg").textContent=p.avg.toFixed(1);
    document.getElementById("double").textContent=p.double.toFixed(1)+"%";
    document.getElementById("maxes").textContent=p.maxes.toFixed(2);
    document.getElementById("checkout").textContent=p.checkout.toFixed(1)+"%";
    document.getElementById("form").textContent=this.formLabel(p.form);
    document.getElementById("talent").textContent=p.talent;
    document.getElementById("flaw").textContent=p.flaw;
    document.getElementById("talent").setAttribute("data-tip", DATA.traitDescriptions[p.talent] || "Keine Beschreibung vorhanden.");
    document.getElementById("flaw").setAttribute("data-tip", DATA.traitDescriptions[p.flaw] || "Keine Beschreibung vorhanden.");
    document.getElementById("playTournamentBtn").disabled = !t || g.playedThisWeek || !Tournaments.eligible(t) || g.budget < (t?t.fee:0);
    ["trainLow","trainMed","trainHigh"].forEach(id=>document.getElementById(id).disabled=g.trainedThisWeek);
    this.renderLog();
    Save.save();
  },
  renderLog() {
    document.getElementById("log").innerHTML = State.game.log.map(x=>`<div><strong>Woche ${x.week}:</strong> ${x.text}</div>`).join("");
  },
  log(text) {
    State.game.log.unshift({week:State.game.week,text});
    if(State.game.log.length>120) State.game.log.pop();
    this.renderLog();
  },
  showModal(title, body) {
    document.getElementById("modalTitle").textContent=title;
    document.getElementById("modalBody").innerHTML=body;
    document.getElementById("modal").classList.remove("hidden");
  },
  closeModal(){ document.getElementById("modal").classList.add("hidden"); },
  showChangelog(){
    let body="";
    DATA.changelog.forEach(v=>{
      body += `<h3>Version ${v.version}</h3><ul>${v.updates.map(u=>`<li>${u}</li>`).join("")}</ul>`;
    });
    this.showModal("Changelog", body);
  },
  showCalendar(){
    let body=`<div class="calendar-row small"><b>KW</b><b>Turnier</b><b>Kategorie</b><b>Gebühr</b></div>`;
    DATA.annualCalendar.forEach(t=>{
      const cls=t.week===this.yearWeek()?"calendar-row current":"calendar-row";
      body+=`<div class="${cls}"><div>${t.week}</div><div><b>${t.name}</b><div class="small">${Tournaments.accessText(t)}</div></div><div>${t.category}</div><div>${this.euro(t.fee)}</div></div>`;
    });
    this.showModal("Turnierkalender", body);
  },
  showRanking(){
    const userEntry = {name:State.game.player.name,nation:State.game.player.nation,prize:State.game.playerPrize,isUser:true};
    const rows = UI.hasTourcard()
      ? [...State.game.worldPlayers, userEntry].sort((a,b)=>b.prize-a.prize)
      : [...State.game.worldPlayers].sort((a,b)=>b.prize-a.prize);

    let body = "";
    if(!UI.hasTourcard()){
      body += `<p class="small"><b>${State.game.player.name}</b> besitzt keine Tourcard und wird deshalb nicht in der Order of Merit geführt.</p>`;
    }

    body+=`<table><thead><tr><th>Rang</th><th>Spieler</th><th>Nation</th><th>Preisgeld</th></tr></thead><tbody>`;
    rows.forEach((p,i)=>{ const mark=p.isUser?" style='background:#263849;font-weight:bold;'":""; body+=`<tr${mark}><td>${i+1}</td><td>${p.name}${p.isUser?" · Dein Spieler":""}</td><td>${p.nation}</td><td>${this.euro(p.prize)}</td></tr>`; });
    body+=`</tbody></table>`;
    this.showModal("Weltrangliste / Order of Merit", body);
  },
  showCareer(){
    const p = State.game.player;
    const c = p.career || Game.emptyCareer();
    const body = `<table>
      <tbody>
        <tr><td>Karriere-Preisgeld</td><td>${this.euro(c.prizeMoney || 0)}</td></tr>
        <tr><td>Turniersiege</td><td>${c.titles || 0}</td></tr>
        <tr><td>Regionale Titel</td><td>${c.regionalTitles || 0}</td></tr>
        <tr><td>Tour-Titel</td><td>${c.tourTitles || 0}</td></tr>
        <tr><td>Major-Titel</td><td>${c.majorTitles || 0}</td></tr>
        <tr><td>Gespielte Matches</td><td>${c.matches || 0}</td></tr>
        <tr><td>Siege</td><td>${c.wins || 0}</td></tr>
        <tr><td>Niederlagen</td><td>${c.losses || 0}</td></tr>
        <tr><td>180er</td><td>${c.max180s || 0}</td></tr>
        <tr><td>9-Darter</td><td>${c.nineDarters || 0}</td></tr>
        <tr><td>Höchster Match-Average</td><td>${(c.highestAverage || 0).toFixed(1)}</td></tr>
        <tr><td>Bestes Checkout</td><td>${c.highestCheckout || 0}</td></tr>
        <tr><td>Q-School-Erfolge</td><td>${c.qSchoolSuccess || 0}</td></tr>
      </tbody>
    </table>`;
    this.showModal(`Karriereleistungen: ${p.name}`, body);
  }
};
