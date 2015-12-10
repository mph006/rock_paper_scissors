
//Basic stats, will add more advanced stats time permitting 
function updateStats(isInit,table,lastPlayed){
	var sum = table.ROCK+table.SCISSORS+table.PAPER;
	document.getElementById('num-played').innerHTML = "Number of plays: "+sum
	document.getElementById('stats-line').innerHTML = "Rock: "+table.ROCK+" Paper: "+table.PAPER+" Scissors: "+table.SCISSORS;
	if(isInit){document.getElementById('last-played').innerHTML = "Last Played: "+Date(lastPlayed.lastPlay["WRITE_TIME"]).toString();}
	else{document.getElementById('last-played').innerHTML = "Last Played: "+lastPlayed.toString();}
}