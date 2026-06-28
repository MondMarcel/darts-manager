const DATA = {
  version: "0.8",
  changelog: [
    {version:"0.8", updates:["Manager-Level und Manager-XP eingebaut","XP-Balancing deutlich langsamer gestaltet","Talentpunkte bei ausgewählten Level-Ups","Skilltree mit Trainer-, Scout-, Manager- und Mentor-Skills","Wochenwarnung beim Überspringen von Training oder spielbarem Turnier","Skilltree bereitet Scouting-System für Version 0.9 vor"]},
    {version:"0.7", updates:["Spieler ohne Tourcard erscheinen nicht mehr in der Order of Merit","Fiktive Weltranglisten-Namen überarbeitet und stärker an Nationalitäten angepasst","Tooltips für Talente und Makel eingebaut","Karriereleistungen-Button mit Statistiken ergänzt","Turniere erzeugen jetzt Karrierewerte wie 180er, 9-Darter, Titel und Preisgeldhistorie"]},
    {version:"0.6", updates:["Projekt professionell in Dateien strukturiert","Lokaler Login mit Profilname und Passwort","Speichern/Laden des Spielstands per localStorage","Wochenablauf auf Training + optional Turnier + Nächste Woche umgestellt","Changelog-Button oben rechts eingebaut"]},
    {version:"0.5", updates:["Turnierkalender","Tourcard-System","Q-School","200 simulierte Tourcardholder","Qualifier für große Turniere"]},
    {version:"0.4", updates:["Alterung nach 52 Wochen","Kompakteres Dashboard","Turnierbericht-Popup mit Matchdetails"]},
    {version:"0.3", updates:["Nächstes Turnier sichtbar","Weltrangliste nach Preisgeld","Simulierte Dartwelt"]},
    {version:"0.2", updates:["Training mit positivem/negativem Ausgang","Training nach Intensität","Abwechslungsreichere Eventtexte"]},
    {version:"0.1", updates:["Erste spielbare Webapp","Spielerauswahl","Spielerkarte","Training","Wochenturnier"]}
  ],
  managerXPLevels: [0, 500, 1200, 2200, 3600, 5400, 7600, 10200, 13200, 16600, 20400, 24600, 29200, 34200, 39600, 45400, 51600, 58200, 65200, 72600, 80400],
  talentPointLevels: [2,4,7,10,14,18],
  skills: [
    {id:"training_basic", branch:"Trainer", name:"Trainingsgrundlagen", cost:1, minLevel:2, desc:"Trainingseffekt +5%. Kleine, aber dauerhafte Verbesserung aller technischen Trainings."},
    {id:"training_focus", branch:"Trainer", name:"Fokusarbeit", cost:1, minLevel:4, requires:"training_basic", desc:"Positives Training bringt zusätzlich etwas mehr Fortschritt."},
    {id:"scout_benelux", branch:"Scout", name:"Benelux-Netzwerk", cost:1, minLevel:2, desc:"Schaltet Niederlande und Belgien fürs spätere Scouting frei."},
    {id:"scout_core_nations", branch:"Scout", name:"Darts-Kernnationen", cost:1, minLevel:4, requires:"scout_benelux", desc:"Schaltet England, Wales und Schottland fürs spätere Scouting frei."},
    {id:"scout_reports", branch:"Scout", name:"Bessere Berichte", cost:1, minLevel:7, desc:"Potenzialspannen werden im späteren Scouting genauer."},
    {id:"manager_share", branch:"Manager", name:"Preisgeldverhandlung", cost:1, minLevel:4, desc:"Erhöht deinen Anteil an regionalem Preisgeld leicht von 50% auf 55%."},
    {id:"manager_reputation", branch:"Manager", name:"Professionelles Auftreten", cost:1, minLevel:7, desc:"Ruf steigt bei Erfolgen etwas schneller."},
    {id:"mentor_form", branch:"Mentor", name:"Formgespräche", cost:1, minLevel:2, desc:"Form-Einheiten sind etwas stärker."},
    {id:"mentor_pressure", branch:"Mentor", name:"Druckbegleitung", cost:1, minLevel:7, requires:"mentor_form", desc:"Negative Formeffekte nach frühen Niederlagen werden leicht reduziert."}
  ],
  countryStrength: {
    "Deutschland": {tier:1, density:62, talent:62, elite:55},
    "Niederlande": {tier:2, density:90, talent:88, elite:84},
    "Belgien": {tier:2, density:68, talent:70, elite:62},
    "England": {tier:3, density:100, talent:94, elite:90},
    "Wales": {tier:3, density:82, talent:80, elite:76},
    "Schottland": {tier:3, density:80, talent:78, elite:74},
    "Irland": {tier:4, density:58, talent:56, elite:48},
    "Polen": {tier:4, density:52, talent:54, elite:45},
    "Österreich": {tier:4, density:45, talent:46, elite:40},
    "Australien": {tier:5, density:55, talent:57, elite:50},
    "USA": {tier:5, density:28, talent:35, elite:28},
    "Kanada": {tier:5, density:25, talent:32, elite:25},
    "Frankreich": {tier:5, density:25, talent:30, elite:22},
    "Dänemark": {tier:5, density:35, talent:38, elite:30}
  },
  traitDescriptions: {
    "Keine sichtbare Eigenschaft": "Dieser Spieler hat aktuell kein besonderes sichtbares Talent.",
    "Kein sichtbarer Makel": "Dieser Spieler hat aktuell keinen sichtbaren Makel.",
    "Power Scorer": "Erhöht die Chance auf hohe Aufnahmen und 180er, besonders wenn das Scoringtraining anschlägt.",
    "Wacklige Doppel": "Bei engen Matches kann die Doppelquote stärker schwanken.",
    "Ruhige Hand": "Unter Druck bleiben Doppel und Checkouts stabiler. Besonders wertvoll in Decidern und späten Turnierrunden.",
    "Langsamer Starter": "In frühen Legs und ersten Runden startet der Spieler etwas schwächer. Gute Form kann diesen Effekt abfedern."
  },
  starters: [
    {name:"Finn Adler",age:18,startAge:18,nation:"Deutschland",type:"Ausgeglichen",avg:72.8,double:29,maxes:0.09,checkout:8,form:50,talent:"Keine sichtbare Eigenschaft",flaw:"Kein sichtbarer Makel",potential:78,growth:.75,report:"Solider Eindruck. Keine auffälligen Schwächen, aber auch kein sofort erkennbarer X-Faktor."},
    {name:"Jamie Brooks",age:19,startAge:19,nation:"England",type:"Scorer",avg:75.4,double:24,maxes:0.18,checkout:6,form:45,talent:"Power Scorer",flaw:"Wacklige Doppel",potential:86,growth:.62,report:"Kann Spiele mit hohen Scores dominieren, verschenkt aber viele Legs auf Doppel."},
    {name:"Lars van Dijk",age:17,startAge:17,nation:"Niederlande",type:"Mentalspieler",avg:70.9,double:34,maxes:0.05,checkout:11,form:58,talent:"Ruhige Hand",flaw:"Langsamer Starter",potential:92,growth:.82,report:"Wirkt reif für sein Alter. Scoring noch ausbaufähig, aber auf Doppel erstaunlich stabil."}
  ],
  annualCalendar: [
    {week:1,name:"New Year Local Open",category:"Regional frei",fee:0,winnerPrize:350,access:"open",difficulty:[62,66,70,74]},
    {week:3,name:"Q-School Stage",category:"Q-School",fee:500,winnerPrize:0,access:"qschool",difficulty:[72,76,80,84,88]},
    {week:5,name:"Rhine Pub Trophy",category:"Regional frei",fee:0,winnerPrize:250,access:"open",difficulty:[60,64,68,72]},
    {week:8,name:"North District Classic",category:"Regional Gebühr",fee:80,winnerPrize:700,access:"open",difficulty:[66,70,74,78]},
    {week:12,name:"European Qualifier I",category:"Qualifier",fee:120,winnerPrize:0,access:"qualifier",unlocks:"European Hall Series",difficulty:[70,74,78,82]},
    {week:13,name:"European Hall Series",category:"Tour/Qualifier Event",fee:0,winnerPrize:3500,access:"tour_or_qualified",difficulty:[76,81,86,91,95]},
    {week:17,name:"Spring Board Masters",category:"Regional Gebühr",fee:100,winnerPrize:900,access:"open",difficulty:[68,72,76,80]},
    {week:22,name:"Players Circuit 1",category:"Tourcard Event",fee:0,winnerPrize:2500,access:"tour",difficulty:[76,80,84,88,92]},
    {week:26,name:"Summer Local Open",category:"Regional frei",fee:0,winnerPrize:300,access:"open",difficulty:[62,66,70,74]},
    {week:31,name:"Major Qualifier",category:"Qualifier",fee:150,winnerPrize:0,access:"qualifier",unlocks:"Continental Grand Prix",difficulty:[72,76,80,84]},
    {week:32,name:"Continental Grand Prix",category:"Major",fee:0,winnerPrize:6000,access:"tour_or_qualified",difficulty:[78,84,89,94,98]},
    {week:38,name:"Autumn Challenge",category:"Regional Gebühr",fee:120,winnerPrize:1200,access:"open",difficulty:[70,74,78,82]},
    {week:44,name:"Players Circuit 2",category:"Tourcard Event",fee:0,winnerPrize:3000,access:"tour",difficulty:[77,81,85,89,93]},
    {week:49,name:"Winter County Open",category:"Regional frei",fee:0,winnerPrize:400,access:"open",difficulty:[64,68,72,76]}
  ],
  namePools: {
    "England": {
      first:["Archie","Benedict","Callan","Dexter","Elliot","Harvey","Jenson","Kieran","Logan","Miles","Oscar","Reece","Toby","Warren"],
      last:["Ashford","Bennett","Carver","Ellis","Granger","Hale","Mercer","Oakley","Parker","Radford","Sterling","Tanner","Whitmore","Yardley"]
    },
    "Niederlande": {
      first:["Bram","Daan","Floris","Jelle","Koen","Luuk","Mats","Niek","Ruben","Sem","Stijn","Teun","Wout","Yorick"],
      last:["Aalbers","Boonstra","Dekens","Groen","Haverkamp","Kuipers","Lammers","Meijerink","Oosterveld","Rietman","Timmer","Verhoeven","Willemsen","Zwart"]
    },
    "Wales": {
      first:["Aled","Bryn","Carwyn","Dafydd","Emrys","Gareth","Iwan","Lloyd","Morgan","Owain","Rhys","Steffan"],
      last:["Bevan","Cadogan","Dewi","Glynn","Hopkin","Llewellyn","Maddock","Pritchard","Rhydderch","Trevithick","Vaughan","Wynne"]
    },
    "Schottland": {
      first:["Alistair","Blair","Callum","Douglas","Ewan","Finlay","Gregor","Hamish","Iain","Kerr","Lachlan","Ruaridh"],
      last:["Abernethy","Brodie","Cairns","Drummond","Ferguson","Galloway","Kerrigan","MacLeod","Nairn","Ramsay","Sinclair","Strachan"]
    },
    "Deutschland": {
      first:["Anton","Bastian","Emil","Florian","Hannes","Jonas","Kilian","Lennard","Mats","Niklas","Oskar","Till","Vincent"],
      last:["Bergmann","Eichhorn","Falkner","Gerber","Hartung","Kessler","Lindner","Mertens","Neubauer","Reichert","Seidel","Thalheim","Vogel"]
    },
    "Belgien": {
      first:["Arne","Bastien","Cedric","Dries","Emiel","Joran","Lander","Mathis","Niels","Senne","Thibault","Wout"],
      last:["Bogaerts","Claes","De Smet","Goossens","Lemmens","Maertens","Peeters","Roels","Stevens","Van Acker","Van den Broeck","Verlinden"]
    },
    "Australien": {
      first:["Bailey","Cooper","Darcy","Flynn","Hayden","Jasper","Lachie","Mitchell","Nate","Riley","Spencer","Tyson"],
      last:["Baxter","Calloway","Dawson","Fletcher","Harrigan","Kendall","Lawson","Maddox","Redfern","Sullivan","Thorpe","Walsh"]
    },
    "Polen": {
      first:["Adam","Bartosz","Cezary","Dawid","Filip","Kamil","Lukasz","Marcin","Mikolaj","Oskar","Pawel","Tomasz"],
      last:["Bielecki","Czerwinski","Dabrowski","Grabowski","Kaczmarek","Lisowski","Majewski","Nowicki","Ostrowski","Pawlak","Rutkowski","Zielinski"]
    },
    "Irland": {
      first:["Aidan","Cian","Conor","Declan","Eamon","Finnian","Niall","Oisin","Ronan","Seamus","Tadhg"],
      last:["Brannigan","Clancy","Doyle","Finnegan","Kavanagh","Larkin","Maguire","O'Daly","Quinn","Rafferty","Sheehan"]
    },
    "Österreich": {
      first:["Adrian","David","Felix","Gregor","Lukas","Moritz","Noah","Paul","Simon","Tobias"],
      last:["Auer","Brandner","Eder","Gruber","Holzer","Lechner","Moser","Reisinger","Steiner","Wimmer"]
    },
    "Frankreich": {
      first:["Adrien","Baptiste","Clement","Etienne","Hugo","Jules","Laurent","Mathieu","Noe","Quentin","Remi","Theo"],
      last:["Arnaud","Beauchamp","Chevalier","Delaunay","Fontaine","Garnier","Lemoine","Marchand","Perrot","Rousseau","Vasseur"]
    },
    "Dänemark": {
      first:["Anders","Emil","Frederik","Jonas","Lasse","Mads","Magnus","Nikolaj","Rasmus","Soren","Viktor"],
      last:["Bjerre","Dahlgaard","Engholm","Hedegaard","Krogh","Lindholm","Moller","Nygaard","Ravn","Sondergaard","Vester"]
    }
  }
};
