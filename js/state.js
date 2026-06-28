const State = {
  currentUser: null,
  game: null,
  newGame(username) {
    this.currentUser = username;
    this.game = {
      profileName: username, week:1, budget:0, reputation:0, trainerLevel:1, scoutLevel:1,
      managerLevel:1, managerXP:0, talentPoints:0, skills:[],
      player:null, playerPrize:0, selectedTraining:null, trainedThisWeek:false, playedThisWeek:false,
      qualifiedEvents:{}, tourcardUntilWeek:0, scoutingTask:null, scoutingReports:[], log:[], worldPlayers: Ranking.generateWorldPlayers()
    };
  }
};

const Ranking = {
  generateWorldPlayers() {
    const nations = Object.keys(DATA.namePools);
    const used = new Set();
    const arr = [];

    for(let i=0; i<200; i++){
      const nation = nations[i % nations.length];
      const pool = DATA.namePools[nation];
      let name = "";
      let guard = 0;
      do {
        const first = pool.first[Math.floor(Math.random()*pool.first.length)];
        const last = pool.last[Math.floor(Math.random()*pool.last.length)];
        name = first + " " + last;
        guard++;
      } while(used.has(name) && guard < 50);

      used.add(name);
      const base = Math.max(1000, Math.floor(220000 * Math.exp(-i/38) + Math.random()*4500));
      arr.push({name, nation, prize:base});
    }
    return arr.sort((a,b)=>b.prize-a.prize);
  }
};
