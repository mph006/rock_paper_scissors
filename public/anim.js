//Toggles the draggability of elements with a boolean input
function switchDragElements(isDraggable){
  var dragElements = document.getElementsByClassName("inputs");
  for(var i=0; i<dragElements.length; i++){
      dragElements[i].setAttribute("draggable",isDraggable);
  }
}

function resetBoard(userPick,aiPick,outcome){
  $("#ai-"+aiPick).fadeOut(fadeTimer);
  $("#user-"+userPick).fadeOut(fadeTimer, function(){
    document.getElementsByClassName("choices")[0].appendChild(document.getElementById("user-"+userPick));
    TweenLite.to($("#ai-"+aiPick), 0, {left:"55%"});
    TweenLite.to($("#user-"+userPick), 0, {left:"0px"});
    document.getElementById('result').innerHTML=outcome.toUpperCase();
    updateStats(false,tallyTable,new Date());
    $("#result").fadeIn(fadeTimer/1.5).fadeOut(fadeTimer/1.5,function(){
      $("#vs").fadeIn(fadeTimer/2);
      $("#user-"+userPick).fadeIn(fadeTimer/2,function(){switchDragElements(true);});
    });
  });
}

function winAnimation(userPick,aiPick,callback){
  TweenLite.to($("#ai-"+aiPick), 1, {left:"57.5%",delay:1});
  TweenLite.to($("#user-"+userPick), 3, {left:"56%", ease:Bounce.easeOut, onComplete:function(){
    callback();
  }});
}

function loseAnimation(userPick,aiPick,callback){
  TweenLite.to($("#user-"+userPick), 1, {left:"-10%",delay:1});
  TweenLite.to($("#ai-"+aiPick), 3, {left:"41%", ease:Bounce.easeOut, onComplete:function(){
    callback();
  }});
}

function tieAnimation(userPick,aiPick,callback){
  TweenLite.to($("#user-"+userPick), 3, {left:"20%", ease:Bounce.easeOut});
  TweenLite.to($("#ai-"+aiPick), 3, {left:"49.5%", ease:Bounce.easeOut, onComplete:function(){
    callback();
  }});
}

function animateMatch(userPick,aiPick,outcome,callback){
   $("#ai-"+aiPick).fadeIn(fadeTimer,function(){
    $("#vs").fadeOut(fadeTimer/3,function(){
      switch(outcome){
        case "win":
          winAnimation(userPick,aiPick,function(){callback();});
          break;
        case "lose":
          loseAnimation(userPick,aiPick,function(){callback();});
          break;
        default:
          tieAnimation(userPick,aiPick,function(){callback();});
          break;
      }
    });
  
   });
}