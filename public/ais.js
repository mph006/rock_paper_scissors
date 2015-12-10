var key = {
	"rock":{
		value:"rock",
		beats:"scissors",
		beatenBy:"paper",
		intVal:0
	},
	"paper":{
		value:"paper",
		beats:"rock",
		beatenBy:"scissors",
		intVal:1
	},
	"scissors":{
		value:"scissors",
		beats:"paper",
		beatenBy:"rock",
		intVal:2
	}
};

//Returns what the userSelection beats
function fetchWhatLoses(userSelection){
	for(var property in key){
		if(key.hasOwnProperty(property) && key[property].value === userSelection){
			return key[property].beats;
		}
	}
}

//Returns what the userSeletion is beaten by
function fetchWhatWins(userSelection){
	for(var property in key){
		if(key.hasOwnProperty(property) && key[property].value === userSelection){
			return key[property].beatenBy;
		}
	}
}

//Returns a completely random selection
function randomSelection(){
	var randomInt = Math.floor(Math.random() * 3)
	for(var property in key){
		if(key.hasOwnProperty(property) && key[property].intVal === randomInt){
			return key[property].value;
		}
	}
}

//Returns a random guess, weighted to take advantage of historical user prefrence 
function weightedRandom(){
	if(tallyTable.length>0){
		var sum = tallyTable.SCISSORS + tallyTable.PAPER + tallyTable.ROCK;
		var randomInt = Math.floor(Math.random() * sum) +1;
		if(randomInt<=tallyTable.SCISSORS){return key["scissors"].beatenBy;}
		else if(randomInt<=tallyTable.SCISSORS+tallyTable.PAPER){return key["paper"].beatenBy;}
		else{return key["rock"].beatenBy;}
	}
	//If we dont have the tallyTable, just pick somehting randomly (hacky)
	else{return randomSelection();}
		
}