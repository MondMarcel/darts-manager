const Manager = {
  xpForNext(level){
    const table = DATA.managerXPLevels;
    if(level < table.length) return table[level];
    return table[table.length-1] + Math.pow(level - table.length + 1, 2) * 9000;
  },
  xpCurrentFloor(level){
    const table = DATA.managerXPLevels;
    if(level-1 < table.length) return table[level-1];
    return table[table.length-1];
  },
  addXP(amount, reason){
    const g = State.game;
    if(!g.managerXP && g.managerXP !== 0) g.managerXP = 0;
    if(!g.managerLevel) g.managerLevel = 1;
    if(!g.talentPoints) g.talentPoints = 0;
    if(!g.skills) g.skills = [];

    g.managerXP += amount;
    UI.log(`Manager-XP: +${amount} (${reason}).`);

    while(g.managerXP >= this.xpForNext(g.managerLevel)){
      g.managerLevel++;
      if(DATA.talentPointLevels.includes(g.managerLevel)){
        g.talentPoints++;
        UI.log(`Levelaufstieg! Du bist jetzt Manager-Level ${g.managerLevel} und erhältst 1 Talentpunkt.`);
      } else {
        UI.log(`Levelaufstieg! Du bist jetzt Manager-Level ${g.managerLevel}.`);
      }
    }
  },
  hasSkill(id){ return (State.game.skills || []).includes(id); },
  buySkill(id){
    const skill = DATA.skills.find(s => s.id === id);
    const g = State.game;
    if(!skill) return;
    if(this.hasSkill(id)){ UI.log("Skill bereits freigeschaltet."); return; }
    if(g.managerLevel < skill.minLevel){ UI.log(`Benötigt Manager-Level ${skill.minLevel}.`); return; }
    if(skill.requires && !this.hasSkill(skill.requires)){ UI.log("Vorheriger Skill fehlt."); return; }
    if(g.talentPoints < skill.cost){ UI.log("Nicht genug Talentpunkte."); return; }

    g.talentPoints -= skill.cost;
    g.skills.push(id);

    if(skill.id.startsWith("training")) g.trainerLevel++;
    if(skill.id.startsWith("scout")) g.scoutLevel++;

    UI.log(`Skill freigeschaltet: ${skill.name}.`);
    UI.render();
  },
  trainingMultiplier(){
    let mult = 1;
    if(this.hasSkill("training_basic")) mult += 0.05;
    if(this.hasSkill("training_focus")) mult += 0.08;
    return mult;
  },
  prizeShare(){ return this.hasSkill("manager_share") ? 0.55 : 0.50; },
  reputationBonus(){ return this.hasSkill("manager_reputation") ? 1 : 0; },
  formCampBonus(){ return this.hasSkill("mentor_form") ? 2 : 0; },
  lossFormProtection(){ return this.hasSkill("mentor_pressure") ? 2 : 0; }
};
