const Training = {
  select(type){
    if(State.game.trainedThisWeek){ UI.log("Training ist diese Woche bereits absolviert."); return; }
    State.game.selectedTraining=type;
    const labels={
      scoring:"Scoringtraining: verbessert Average und 180er-Gefahr für alle Spieler im Team.",
      double:"Doppeltraining: verbessert Doppelquote für alle Spieler im Team.",
      checkout:"Checkouttraining: verbessert High-Finishes für alle Spieler im Team.",
      mental:"Mentaltraining: stabilisiert Form und Druckresistenz für alle Spieler im Team.",
      formcamp:"Form-Einheit: kurzfristiger Form-Push für alle Spieler im Team, aber kein technischer Fortschritt."
    };
    document.getElementById("selectedTrainingLabel").textContent=labels[type];
    document.getElementById("trainingIntensity").classList.remove("hidden");
  },
  run(intensity){
    const g=State.game;
    if(g.trainedThisWeek){ UI.log("Pro Woche ist nur ein Training möglich."); return; }
    const cfg={low:{cost:0,success:.80,mult:.75},medium:{cost:100,success:.90,mult:1},high:{cost:250,success:1,mult:1.25}}[intensity];
    if(g.budget<cfg.cost){ UI.log(`Nicht genug Budget. Benötigt: ${UI.euro(cfg.cost)}.`); return; }

    if(!g.roster || !g.roster.length){
      g.roster = [g.player];
      g.activePlayerIndex = 0;
    }

    g.budget-=cfg.cost;
    const type = g.selectedTraining;
    let positives = 0;

    g.roster.forEach(player => {
      const success=Math.random()<cfg.success;
      const room=Math.max(.1,(player.potential-player.avg)/30);
      const gain=(.14+Math.random()*.26)*player.growth*room*cfg.mult*Manager.trainingMultiplier();

      if(success){
        positives++;
        this.positiveForPlayer(player,type,gain);
      } else {
        this.negativeForPlayer(player,type);
      }
    });

    UI.log(`Teamtraining abgeschlossen: ${positives}/${g.roster.length} Spieler hatten eine positive Einheit.`);
    g.trainedThisWeek=true;
    Manager.addXP(3, "Teamtraining durchgeführt");
    g.selectedTraining=null;
    document.getElementById("trainingIntensity").classList.add("hidden");
    UI.render();
  },
  positiveForPlayer(p,type,gain){
    if(type==="scoring"){ p.avg=Math.min(p.potential,p.avg+gain*1.15); p.maxes+=.002+Math.random()*.004; }
    if(type==="double"){ p.double=Math.min(55,p.double+gain*.75); }
    if(type==="checkout"){ p.checkout=Math.min(35,p.checkout+gain*.55); }
    if(type==="mental"){ p.form=Math.min(95,p.form+3+Math.random()*3); }
    if(type==="formcamp"){ p.form=Math.min(98,p.form+6+Math.random()*5+Manager.formCampBonus()); }
  },
  negativeForPlayer(p,type){
    p.form=Math.max(15,p.form-(1+Math.random()*2));
  }
};
