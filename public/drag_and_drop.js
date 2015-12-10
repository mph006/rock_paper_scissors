//HTML5 Drag functionality shamelessly stolen from: http://www.w3schools.com/html/html5_draganddrop.asp
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function dropInShelf(ev){
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    if(ev.target.className === "choices"){
      ev.target.appendChild(document.getElementById(data));
    }
}

function dropInArena(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));

    switchDragElements(false);
    var userPick = document.getElementById(data).id.replace("user-","");
    var aiPick = triggerAI(fetchAIChoice(),userPick);
    var outcome = checkOutcome(userPick,aiPick);

    //Do some animations in anim.js
    animateMatch(userPick,aiPick,outcome,function(){
      //Reset the board
      resetBoard(userPick,aiPick,outcome);
    });

    //Write detail data back to the server
    if(isDBConnected){
      writeDataBack(userPick,aiPick,outcome)
    }

    lastPlayed = userPick;
    sessionMoves.push(userPick);
    addSelectOption("last-played","Beat Last Played");   
}