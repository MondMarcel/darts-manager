const Scouting = {
  unlockedCountries(){
    const countries = ["Deutschland"];
    if(Manager.hasSkill("scout_benelux")) countries.push("Niederlande","Belgien");
    if(Manager.hasSkill("scout_core_nations")) countries.push("England","Wales","Schottland");
    if(State.game.scoutLevel >= 4) countries.push("Irland","Polen","Österreich");
    if(State.game.scoutLevel >= 5) countries.push("Australien","Frankreich","Dänemark");
    return countries;
  },
  show(){
    const g = State.game;
    let body = "";
    if(g.scoutingTask){
      body += `<p class="small">Aktiver Auftrag: <b>${g.scoutingTask.country}</b> · ${g.scoutingTask.typeName}. Ergebnisse kommen nächste Woche.</p>`;
    } else {
      body += `<h3>Land wählen</h3><div class="scout-options">`;
      const unlocked = this.unlockedCountries();
      Object.keys(DATA.countryStrength).forEach(c=>{
        const locked = !unlocked.includes(c);
        body += `<div class="scout-card ${locked?"locked":""}">
          <b>${c}</b><div class="small">Dichte ${DATA.countryStrength[c].density} · Talent ${DATA.countryStrength[c].talent}</div>
          ${locked ? "<div class='small'>Noch nicht freigeschaltet</div>" : `<button onclick="Scouting.chooseCountry('${c}')">Auswählen</button>`}
        </div>`;
      });
      body += `</div>`;
    }

    if((g.scoutingReports || []).length){
      body += `<h3>Letzte Scouting-Berichte</h3>`;
      g.scoutingReports.forEach((r,i)=>{
        body += `<div class="player-report">
          <b>${r.name}</b> · ${r.age} Jahre · ${r.nation}<br>
          <span class="small">${r.type}</span>
          <div class="stat"><span>Average</span><strong>${r.avg.toFixed(1)}</strong></div>
          <div class="stat"><span>Doppelquote</span><strong>${r.double.toFixed(1)}%</strong></div>
          <div class="stat"><span>180er pro Leg</span><strong>${r.maxes.toFixed(2)}</strong></div>
          <div class="stat"><span>Checkout 100+</span><strong>${r.checkout.toFixed(1)}%</strong></div>
          <div class="stat"><span>Potenzial-Einschätzung</span><strong>${r.potentialLow}–${r.potentialHigh}</strong></div>
          <span class="tag good">${r.talent}</span> <span class="tag bad">${r.flaw}</span>
          <p class="small">${r.report}</p>
        </div>`;
      });
    }
    UI.showModal("Scouting", body);
  },
  chooseCountry(country){
    let body = `<p class="small">Ausgewähltes Land: <b>${country}</b></p><div class="scout-options">`;
    DATA.scoutingTypes.forEach(t=>{
      const affordable = State.game.budget >= t.cost;
      body += `<div class="scout-card">
        <b>${t.name}</b>
        <div class="small">${t.desc}</div>
        <div class="stat"><span>Kosten</span><strong>${UI.euro(t.cost)}</strong></div>
        <button ${affordable ? "" : "disabled"} onclick="Scouting.start('${country}','${t.id}')">Auftrag starten</button>
      </div>`;
    });
    body += `</div>`;
    UI.showModal("Scouting-Auftrag", body);
  },
  start(country,typeId){
    const type = DATA.scoutingTypes.find(t=>t.id===typeId);
    const g = State.game;
    if(g.scoutingTask){ UI.log("Es läuft bereits ein Scouting-Auftrag."); return; }
    if(g.budget < type.cost){ UI.log("Nicht genug Budget für diesen Scouting-Auftrag."); return; }
    g.budget -= type.cost;
    g.scoutingTask = {country, typeId, typeName:type.name, startedWeek:g.week};
    Manager.addXP(2, "Scouting-Auftrag gestartet");
    UI.log(`Scouting gestartet: ${country} · ${type.name}. Ergebnisse kommen nächste Woche.`);
    UI.closeModal();
    UI.render();
  },
  completeIfReady(){
    const g = State.game;
    if(!g.scoutingTask) return;
    const task = g.scoutingTask;
    const type = DATA.scoutingTypes.find(t=>t.id===task.typeId);
    const reports = [];
    const count = Manager.hasSkill("scout_reports") ? 4 : 3;
    for(let i=0;i<count;i++) reports.push(this.generatePlayer(task.country,type));
    g.scoutingReports = reports;
    g.scoutingTask = null;
    UI.log(`Scouting abgeschlossen: ${reports.length} neue Berichte aus ${task.country}.`);
  },
  generatePlayer(country,type){
    const pool = DATA.scoutingNames[country] || DATA.scoutingNames["Deutschland"];
    const name = this.pick(pool.first)+" "+this.pick(pool.last);
    const age = this.rand(type.minAge,type.maxAge);
    const strength = DATA.countryStrength[country] || DATA.countryStrength["Deutschland"];
    let potential = Math.round(45 + Math.random()*30 + strength.talent*0.18 + type.potentialBonus + (Math.random()<0.03 ? strength.elite*0.25 : 0));
    potential = Math.max(50, Math.min(99,potential));
    let avg = Math.min(potential-3, 50 + Math.random()*18 + type.currentBonus + (age-18)*0.9);
    avg = Math.max(45, avg);
    const dbl = Math.max(18, Math.min(42, 22 + Math.random()*14 + (avg-60)*0.12));
    const checkout = Math.max(3, Math.min(20, 5 + Math.random()*9 + (avg-60)*0.08));
    const maxes = Math.max(0.01, Math.min(0.24, 0.03 + (avg-55)/220 + Math.random()*0.04));
    const talents = ["Keine sichtbare Eigenschaft","Ruhige Hand","Power Scorer","Trainingsmonster","Schnellstarter"];
    const flaws = ["Kein sichtbarer Makel","Langsamer Starter","Wacklige Doppel","Formschwankend","Nervös"];
    const talent = Math.random()<0.55 ? this.pick(talents) : "Keine sichtbare Eigenschaft";
    const flaw = Math.random()<0.45 ? this.pick(flaws) : "Kein sichtbarer Makel";
    const range = this.potentialRange(potential);
    return {
      name, age, nation:country, type:type.name, avg, double:dbl, checkout, maxes, potential,
      potentialLow:range[0], potentialHigh:range[1], talent, flaw,
      report:this.reportText(potential,avg,age)
    };
  },
  potentialRange(p){
    const lvl = State.game.scoutLevel || 1;
    let spread = [22,18,14,10,7][Math.min(4,lvl-1)];
    if(Manager.hasSkill("scout_reports")) spread -= 3;
    return [Math.max(40, p-spread), Math.min(100, p+spread)];
  },
  reportText(p,avg,age){
    if(p>=90) return "Der Bericht wirkt auffällig. Es gibt Hinweise auf außergewöhnliches Entwicklungspotenzial.";
    if(p>=80) return "Interessantes Profil. Mit guter Förderung könnte hier ein starker Spieler entstehen.";
    if(avg>=70) return "Aktuell schon solide, aber das langfristige Potenzial bleibt schwer einzuschätzen.";
    return "Rohes Profil. Einige gute Ansätze, aber noch weit von professionellem Niveau entfernt.";
  },
  pick(a){ return a[Math.floor(Math.random()*a.length)]; },
  rand(a,b){ return Math.floor(a+Math.random()*(b-a+1)); }
};