const DATA = {
  version: "0.6",
  changelog: [
    {version:"0.6", updates:["Projekt professionell in Dateien strukturiert","Lokaler Login mit Profilname und Passwort","Speichern/Laden des Spielstands per localStorage","Wochenablauf auf Training + optional Turnier + Nächste Woche umgestellt","Changelog-Button oben rechts eingebaut"]},
    {version:"0.5", updates:["Turnierkalender","Tourcard-System","Q-School","200 simulierte Tourcardholder","Qualifier für große Turniere"]},
    {version:"0.4", updates:["Alterung nach 52 Wochen","Kompakteres Dashboard","Turnierbericht-Popup mit Matchdetails"]},
    {version:"0.3", updates:["Nächstes Turnier sichtbar","Weltrangliste nach Preisgeld","Simulierte Dartwelt"]},
    {version:"0.2", updates:["Training mit positivem/negativem Ausgang","Training nach Intensität","Abwechslungsreichere Eventtexte"]},
    {version:"0.1", updates:["Erste spielbare Webapp","Spielerauswahl","Spielerkarte","Training","Wochenturnier"]}
  ],
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
  ]
};
