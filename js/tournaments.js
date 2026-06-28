const Tournaments = {
  eligible(t){
    if(!t)return false;
    if(t.access==="open")return true;
    if(t.access==="qschool")return !UI.hasTourcard();
    if(t.access==="tour")return UI.hasTourcard();
    if(t.access==="qualifier")return !UI.hasTourcard();
    if(t.access==="tour_or_qualified")return UI.hasTourcard() || State.game.qualifiedEvents[t.name];
    return false;
  },
  accessText(t){
    if(t.access==="open")return"Frei spielbar";
    if(t.access==="qschool")return"Nur ohne Tourcard, 1x jährlich";
    if(t.access==="tour")return"Nur mit Tourcard";
    if(t.access==="qualifier")return"Qualifier für Spieler ohne Tourcard";
    if(t.access==="tour_or_qualified")return"Tourcard oder gewonnener Qualifier";
    return"";
  },
  playCurrent(){
    const g=State.game, p=g.player, t=UI.currentTournament();
    if(!p.career) p.career = Game.emptyCareer();
    if(!t){UI.log("Diese Woche findet kein Turnier statt.");return}
    if(g.playedThisWeek){UI.log("Das Turnier dieser Woche wurde bereits gespielt.");return}
    if(!this.eligible(t)){UI.log(`${p.name} ist für ${t.name} nicht spielberechtigt.`);return}
    if(g.budget<t.fee){UI.log(`Nicht genug Budget für die Teilnahmegebühr (${UI.euro(t.fee)}).`);return}
    g.budget-=t.fee; g.playedThisWeek=true;
    Manager.addXP(t.access === "qschool" ? 20 : 12, "Turnierteilnahme");
    const strength=p.avg+(p.double-30)*.35+(p.checkout-10)*.25+(p.form-50)*.12;
    let rounds=0, prize=0, matches=[];
    const roundNames=["Runde 1","Achtelfinale","Viertelfinale","Halbfinale","Finale"];
    for(let i=0;i<t.difficulty.length;i++){
      const chance=50+(strength-t.difficulty[i])*4;
      const won=Math.random()*100<chance;
      const matchAvgNum=Math.max(55,p.avg+(Math.random()*8-4)+(p.form-50)*.05);
      const matchDoubleNum=Math.max(12,Math.min(60,p.double+(Math.random()*10-5)));
      const maxes=Math.max(0, Math.floor((p.maxes * 10) + Math.random()*3 + (matchAvgNum>85?1:0)));
      const nineDarter = Math.random() < Math.max(0.0005, (matchAvgNum-80)/10000);
      const highCheckout = Math.min(170, Math.floor(80 + Math.random()*90 + (p.checkout/35)*20));

      p.career.matches++;
      if(won) { p.career.wins++; Manager.addXP(10, "Match gewonnen"); } else p.career.losses++;
      p.career.max180s += maxes;
      if(nineDarter) p.career.nineDarters++;
      p.career.highestAverage = Math.max(p.career.highestAverage || 0, matchAvgNum);
      p.career.highestCheckout = Math.max(p.career.highestCheckout || 0, highCheckout);

      matches.push({
        round:roundNames[i],
        opponent:this.opponent(),
        score:this.matchScore(i,won),
        avg:matchAvgNum.toFixed(1),
        double:matchDoubleNum.toFixed(1)+"%",
        extra:`${maxes}x 180${nineDarter ? " · 9-Darter!" : ""}`
      });
      if(won){rounds++;prize+=Math.floor((t.winnerPrize/10)+i*(t.winnerPrize/12));}else break;
    }
    if(rounds===t.difficulty.length)prize=t.winnerPrize;
    if(rounds >= 3) Manager.addXP(30, "Viertelfinale oder besser");
    if(rounds >= 4) Manager.addXP(55, "Halbfinale oder besser");
    if(rounds >= 5) Manager.addXP(85, "Finale erreicht");

    let summary="";
    if(t.access==="qschool"){
      if(rounds>=4){g.tourcardUntilWeek=g.week+104;g.reputation+=3;p.career.qSchoolSuccess++;Manager.addXP(250, "Tourcard erspielt");summary=`Q-School geschafft! ${p.name} erhält eine Tourcard für 2 Jahre.`;UI.log(`Q-School: ${p.name} erspielt sich die Tourcard.`);}
      else{summary=`Q-School verpasst. ${p.name} gewinnt ${rounds} Match(es).`;UI.log(`Q-School: ${p.name} verpasst die Tourcard.`);}
    } else if(t.access==="qualifier"){
      if(rounds===t.difficulty.length){g.qualifiedEvents[t.unlocks]=true;g.reputation+=1;Manager.addXP(75, "Qualifier gewonnen");summary=`Qualifier gewonnen! ${p.name} ist für ${t.unlocks} qualifiziert.`;UI.log(`${t.name}: Qualifier gewonnen.`);}
      else{summary=`Qualifier verpasst. ${p.name} gewinnt ${rounds} Match(es).`;UI.log(`${t.name}: ${p.name} verpasst die Qualifikation.`);}
    } else {
      g.playerPrize+=prize; g.budget+=Math.floor(prize*Manager.prizeShare()); p.career.prizeMoney += prize;
      if(rounds===0){p.form=Math.max(20,p.form-4+Manager.lossFormProtection());summary=`Frühes Aus. Preisgeld: ${UI.euro(prize)}.`;UI.log(`${t.name}: Aus in Runde 1.`);}
      else if(rounds<t.difficulty.length){p.form=Math.min(90,p.form+Math.min(5,rounds));summary=`${p.name} gewinnt ${rounds} Match(es). Preisgeld: ${UI.euro(prize)}. Dein Anteil: ${UI.euro(Math.floor(prize*Manager.prizeShare()))}.`;UI.log(`${t.name}: ${summary}`);}
      else{p.form=Math.min(98,p.form+9);g.reputation+=3+Manager.reputationBonus();Manager.addXP(t.category.includes("Major") ? 350 : 120, "Turniersieg");p.career.titles++;
        if(t.category.includes("Regional")) p.career.regionalTitles++;
        else if(t.category.includes("Major")) p.career.majorTitles++;
        else p.career.tourTitles++;
        summary=`Turniersieg! Preisgeld: ${UI.euro(prize)}. Dein Anteil: ${UI.euro(Math.floor(prize*Manager.prizeShare()))}.`;UI.log(`${t.name}: ${p.name} gewinnt das Turnier.`);}
    }
    g.worldPlayers.forEach((wp,i)=>{wp.prize+=Math.floor(Math.random()*(i<64?1800:700));});
    this.report(t.name,summary,matches);
    UI.render();
  },
  report(title,summary,matches){
    let body=`<p class="small">${summary}</p><table><thead><tr><th>Runde</th><th>Gegner</th><th>Ergebnis</th><th>Average</th><th>Doppel</th><th>Highlights</th></tr></thead><tbody>`;
    matches.forEach(m=>body+=`<tr><td>${m.round}</td><td>${m.opponent}</td><td>${m.score}</td><td>${m.avg}</td><td>${m.double}</td><td>${m.extra || ""}</td></tr>`);
    body+=`</tbody></table>`;
    UI.showModal(title,body);
  },
  opponent(){
    const first=["Ryan","Max","Theo","Nathan","Jules","Adam","Simon","Marco","Viktor","Elias","Jack","Milan","Owen","Luca","Nico","Terry"];
    const last=["Stone","Bakker","Reed","Wagner","Hughes","Smit","Klein","Moreau","Nielsen","Fischer","Taylor","Vos","Ward","Dekker"];
    return first[Math.floor(Math.random()*first.length)]+" "+last[Math.floor(Math.random()*last.length)];
  },
  matchScore(i,won){const f=[["4:1","2:4"],["5:2","3:5"],["6:3","4:6"],["7:4","5:7"],["8:5","6:8"]][Math.min(i,4)];return won?f[0]:f[1];}
};
