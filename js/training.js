const Training = {
  select(type){
    if(State.game.trainedThisWeek){ UI.log("Training ist diese Woche bereits absolviert."); return; }
    State.game.selectedTraining=type;
    const labels={
      scoring:"Scoringtraining: verbessert Average und 180er-Gefahr.",
      double:"Doppeltraining: verbessert Doppelquote.",
      checkout:"Checkouttraining: verbessert High-Finishes.",
      mental:"Mentaltraining: stabilisiert Form und Druckresistenz.",
      formcamp:"Form-Einheit: kurzfristiger Form-Push, aber kein technischer Fortschritt."
    };
    document.getElementById("selectedTrainingLabel").textContent=labels[type];
    document.getElementById("trainingIntensity").classList.remove("hidden");
  },
  run(intensity){
    const g=State.game, p=g.player;
    if(g.trainedThisWeek){ UI.log("Pro Woche ist nur ein Training möglich."); return; }
    const cfg={low:{cost:0,success:.80,mult:.75},medium:{cost:150,success:.90,mult:1},high:{cost:400,success:1,mult:1.25}}[intensity];
    if(g.budget<cfg.cost){ UI.log(`Nicht genug Budget. Benötigt: ${UI.euro(cfg.cost)}.`); return; }
    g.budget-=cfg.cost;
    const success=Math.random()<cfg.success;
    const room=Math.max(.1,(p.potential-p.avg)/30);
    const gain=(.14+Math.random()*.26)*p.growth*room*cfg.mult*Manager.trainingMultiplier();
    success ? this.positive(g.selectedTraining,gain) : this.negative(g.selectedTraining);
    g.trainedThisWeek=true;
    Manager.addXP(8, "Training durchgeführt");
    g.selectedTraining=null;
    document.getElementById("trainingIntensity").classList.add("hidden");
    UI.render();
  },
  positive(type,gain){
    const p=State.game.player;
    if(type==="scoring"){ p.avg=Math.min(p.potential,p.avg+gain*1.15); p.maxes+=.002+Math.random()*.004; UI.log(`${p.name} trifft im Scoring sauberer. Die Einheit bringt sichtbaren Fortschritt.`); }
    if(type==="double"){ p.double=Math.min(55,p.double+gain*.75); UI.log(`${p.name} wirkt auf Doppel ruhiger. Die Abschlussqualität steigt leicht.`); }
    if(type==="checkout"){ p.checkout=Math.min(35,p.checkout+gain*.55); UI.log(`${p.name} findet bessere Wege bei hohen Resten. Checkouttraining erfolgreich.`); }
    if(type==="mental"){ p.form=Math.min(95,p.form+3+Math.random()*3); UI.log(`${p.name} arbeitet konzentriert an Routinen. Die Form verbessert sich.`); }
    if(type==="formcamp"){ p.form=Math.min(98,p.form+6+Math.random()*5+Manager.formCampBonus()); UI.log(`Form-Einheit erfolgreich: ${p.name} wirkt frischer und selbstbewusster.`); }
  },
  negative(type){
    const p=State.game.player;
    p.form=Math.max(15,p.form-(1+Math.random()*2));
    const texts={scoring:"Das Scoringtraining bleibt unruhig. Kaum Fortschritt.",double:"Die Doppel sitzen heute nicht. Die Einheit bringt wenig.",checkout:"Bei hohen Resten fehlt Klarheit. Keine gute Checkout-Woche.",mental:"Mental erreicht die Einheit ihn kaum. Die Form sinkt leicht.",formcamp:"Die Form-Einheit verpufft. Er wirkt eher frustriert als befreit."};
    UI.log(`${p.name}: ${texts[type]}`);
  }
};
