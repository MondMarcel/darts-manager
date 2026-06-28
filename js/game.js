const Game = {
  choosePlayer(index){
    State.game.player=JSON.parse(JSON.stringify(DATA.starters[index]));
    State.game.player.career = this.emptyCareer();
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");
    UI.log(`Vertrag unterschrieben: ${State.game.player.name} schließt sich dir für 2 Jahre an. Er startet ohne Tourcard.`);
    UI.log("Ziel: regionale Turniere spielen, Geld verdienen und die Q-School finanzieren.");
    UI.render();
  },
  nextWeek(){
    const g=State.game;
    g.week++;
    g.trainedThisWeek=false;
    g.playedThisWeek=false;
    if(g.week===g.tourcardUntilWeek+1 && g.tourcardUntilWeek>0){
      const rank=this.getRank();
      if(rank<=64){g.tourcardUntilWeek=g.week+104;UI.log(`${g.player.name} bleibt Top 64 und behält die Tourcard für weitere 2 Jahre.`);}
      else{UI.log(`${g.player.name} verliert die Tourcard, weil er nicht in den Top 64 steht.`);}
    }
    const t=UI.currentTournament();
    if(t) UI.log(`Neue Woche: ${t.name} steht an (${t.category}).`);
    else UI.log("Neue Woche: Kein Turnier angesetzt. Fokus auf Training.");
    UI.render();
  },
  getRank(){
    if(!UI.hasTourcard()) return 999;
    const rows=[...State.game.worldPlayers,{name:State.game.player.name,nation:State.game.player.nation,prize:State.game.playerPrize,isUser:true}].sort((a,b)=>b.prize-a.prize);
    return rows.findIndex(r=>r.isUser)+1;
  },
  emptyCareer(){
    return {
      prizeMoney:0, titles:0, regionalTitles:0, tourTitles:0, majorTitles:0,
      matches:0, wins:0, losses:0, max180s:0, nineDarters:0,
      highestAverage:0, highestCheckout:0, qSchoolSuccess:0
    };
  }
};
