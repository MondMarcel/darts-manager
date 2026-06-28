const State = {
  currentUser: null,
  game: null,
  newGame(username) {
    this.currentUser = username;
    this.game = {
      profileName: username, week:1, budget:0, reputation:0, trainerLevel:1, scoutLevel:1,
      player:null, playerPrize:0, selectedTraining:null, trainedThisWeek:false, playedThisWeek:false,
      qualifiedEvents:{}, tourcardUntilWeek:0, log:[], worldPlayers: Ranking.generateWorldPlayers()
    };
  }
};

const Ranking = {
  generateWorldPlayers() {
    const first=["Luke","Michael","Gerwyn","Peter","Rob","Damon","Danny","Stephen","Chris","Ross","Martin","Josh","Ryan","Dimitri","Dirk","Joe","Gabriel","Nathan","Gary","Dave","Ricky","Alan","Kim","Krzysztof","Jonny","Madars","Keegan","Mervyn","Raymond","Brendan"];
    const last=["Cross","Smith","Price","Wright","Clayton","Heta","Noppert","Bunting","Dobey","Smithson","Schindler","Rock","Searle","King","van Bergen","Cullen","Clemens","Aspin","Anderson","Chiswell","Evans","Soutar","Huybrechts","Ratajski","Barker","Razma","Brown","Lewis","Menzies","Wattimena"];
    const nations=["England","Niederlande","Wales","Schottland","Deutschland","Belgien","Australien","Polen","Irland","Österreich","Frankreich","Dänemark"];
    const arr=[];
    for(let i=0;i<200;i++){
      const base=Math.max(1000,Math.floor(220000*Math.exp(-i/38)+Math.random()*4500));
      arr.push({name:first[i%first.length]+" "+last[(i*7)%last.length],nation:nations[i%nations.length],prize:base});
    }
    return arr;
  }
};
