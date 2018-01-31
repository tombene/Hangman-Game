var words = ["thomas","kayak"],difficulty = ["easy","medium","hard"];

var game = {
	score: 0,
	lettersGuessed: "",
	guessCount: 0,
	wins: 0,
	losses: 0,
	usedWords: [],
	currentWord: "",
	progressWord: "",
	populateUsedWords: function() {
		this.usedWords.push(currentWord);
	},
	//sets a random word for the user to guess
	getRandomWord: function() {
		this.currentWord = words[Math.floor(Math.random() * Math.floor(words.length))];
	}
}

// sets the value of guesses allowed base of length of the word
function setGuessCount(word,difficulty){
	switch (difficulty) {
		case "easy":
			return word.length + 15;
			break;
		case "medium":
			return word.length + 10;
			break;
		case "hard":
			return word.length + 5;
			break;
		default:
			return 13;
	}
}

// removes the used word from the array so that it will not be picked again while playing.
function removeUsedWord(){
	var index = words.indexOf(game.currentWord);
	if(index > -1){
		words.splice(index, 1);
	}
}

//returns a random word for the user to guess
// function getRandomWord(arr) {
// 	return arr[Math.floor(Math.random() * Math.floor(arr.length))];
// }

//updates the string with letters guessed
function addToLettersGuessed(guess){
	game.lettersGuessed += " " + guess;
}
//create the underscores where letters have not been guessed
function makeAGuess(guess){
	game.progressWord = "";
	for(i=0;i<game.currentWord.length;i++){
		if(game.currentWord.charAt(i) === guess){
			game.progressWord += guess;
		}else{
			game.progressWord += "_";
		}
	}
	game.guessCount++;
	if(game.progressWord === game.currentWord){
		game.wins++;
		removeUsedWord;
		getRandomWord;
	}
}