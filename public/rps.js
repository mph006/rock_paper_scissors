//Client side globals
var isDBConnected = false;
var lastPlayed;
var tallyTable;
var sessionMoves = [];
var fadeTimer = 2000;

function fetchAIChoice(){
  var element = document.getElementById("picklist");
  return element.options[element.selectedIndex].value;
}

//Annoying date formatting to keep mysql happy
//http://jsfiddle.net/felipekm/MYpQ9/
Object.defineProperty(Date.prototype, 'YYYYMMDDHHMMSS', {
    value: function() {
        function pad2(n) {  // always returns a string
            return (n < 10 ? '0' : '') + n;
        }

        return this.getFullYear() +
               pad2(this.getMonth() + 1) + 
               pad2(this.getDate()) +
               pad2(this.getHours()) +
               pad2(this.getMinutes()) +
               pad2(this.getSeconds());
    }
});

function triggerAI(AISelection,rps){
  switch(AISelection){
    case "random":
      return randomSelection();
    case "cheating":
      return fetchWhatWins(rps);
    case "last-played":
      return fetchWhatWins(lastPlayed);
    case "weighted-random":
      return weightedRandom();
    case "pacifist":
      return rps;
    case "always-win":
      return fetchWhatLoses(rps);
    default:
      console.log("Error in the AI switch statement, defaulting to random",AISelection);
      return randomSelection();
  }
}

function checkOutcome(userPick,aiPick){
  if(key[userPick].beats === aiPick){return "win";}
  else if(key[userPick].beatenBy === aiPick){return "lose";}
  else{return "tie"};
}

function writeDataBack(userPick,aiPick,outcome){
  
  //update the tally table locally
  tallyTable[userPick.toUpperCase()] ++;

  var gameData = {
    "userPick": userPick,
    "aiPick": aiPick,
    "AIType": fetchAIChoice(),
    "userOutcome": outcome,
    "date": new Date().YYYYMMDDHHMMSS()
  };
  //And update the DB
  $.ajax({
        method: "POST",
        data: gameData,
        url: '/finishedGame'
  })
  .fail(function(desc) {
    console.log("Failed Posting Game Data To Server",desc);
  });

}

//If a selection option dosent exist due (DB connectivity issues) add it
function addSelectOption(value,label){
  var select = document.getElementById('picklist');
  for(var i=0; i<select.children.length; i++){
    if(select.children[i].value === value){return;}
  }
  var option = document.createElement("option");
  option.text = label;
  option.value = value;
  select.add(option);
}

function getTallyTable(lastPlay){
  $.ajax({
        method: "GET",
        url: '/fetchTallyTable'
    })
    .done(function(data) {
        tallyTable=data;
        document.getElementById('stats').style.visibility = "visible";
        updateStats(true,data,lastPlay);
    })
    .fail(function(desc) {
      console.log("Failed /fetchTallyTable GET: ",desc);
    });
}

$( document ).ready(function() {
   $.ajax({
        method: "GET",
        url: '/documentReady'
      })
      .done(function(data) {
        if(data.dbConnection){
          isDBConnected = true;
          getTallyTable(data);
          addSelectOption("last-played","Beat Last Played");
          addSelectOption("weighted-random","Weighted Random");
          lastPlayed = data.lastPlay["USER_PICK"];
        }
      })
      .fail(function(desc) {
        console.log("Failed /documentReady GET: ",desc)
      });
});
