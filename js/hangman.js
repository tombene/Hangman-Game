var words = ["thomas", "kayak","skiing"], difficulty = ["easy", "medium", "hard"];

var game = {
	score: 0,
	lastLetter: "",
	lettersGuessed: "",
	difficulty: "easy",
	guessCount: 0,
	allowedGuesses: 0,
	wins: 0,
	losses: 0,
	usedWords: [],
	currentWord: "",
	progressWord: "",
	populateUsedWords: function () {
		this.usedWords.push(currentWord);
	},
	//sets a random word for the user to guess
	getRandomWord: function () {
		this.currentWord = words[Math.floor(Math.random() * Math.floor(words.length))].toUpperCase();
	},
	//updates the string with letters guessed
	addLettersGuessed: function (guess) {
		if (lettersGuessed.length < 1) {
			this.lettersGuessed = guess;
		} else {
			this.lettersGuessed += " " + guess;
		}
	},
	returnDisplayableProgressWord: function () {
		var tempProgressWord = "";
		for( var i=0; i < this.progressWord.length; i++){
			if(i === 0){
				tempProgressWord = this.progressWord.charAt(i);
			}else{
				tempProgressWord += " " + this.progressWord.charAt(i);
			}
		}
		return tempProgressWord;
	},
	updateProgressWord: function (index,replacement) {
		console.log("substr " + this.progressWord);
			return this.progressWord.substr(0, index) + replacement + this.progressWord.substr(index + replacement.length);
			// console.log("substr " + this.progressWord);
	}
}

// sets the value of guesses allowed base of length of the word
function setGuessCount() {
	switch (game.difficulty) {
		case "easy":
			return game.currentWord.length + 10;
			break;
		case "medium":
			return game.currentWord.length + 8;
			break;
		case "hard":
			return game.currentWord.length + 2;
			break;
		default:
			return 13;
	}
}

// initialize progressWord with underscores
function setUp() {
	//initialize
	game.lettersGuessed = "";
	game.guessCount = 0;
	setGuessCount();
	game.getRandomWord();
	game.progressWord = "";
	for (var i = 0; i < game.currentWord.length; i++) {
		game.progressWord += "_";
	}
	game.allowedGuesses = setGuessCount();
}

// removes the used word from the array so that it will not be picked again while playing.
function removeUsedWord() {
	var index = words.indexOf(game.currentWord);
	if (index > -1) {
		words.splice(index, 1);
	}
}

function makeAGuess(guess) {
	//create the underscores where letters have not been guessed
	for (var i = 0; i < game.currentWord.length; i++) {
		if (game.currentWord.charAt(i) === guess) {
			game.progressWord = game.updateProgressWord(i,guess);
		}
	}
	game.guessCount++;
	
	if (game.progressWord === game.currentWord) {
		game.wins++;
		removeUsedWord();
		setUp();
	}
	if ((game.allowedGuesses - game.guessCount) === 0){
		game.losses++;
		removeUsedWord();
		setUp();
	}
}

//use this function to initialize everything
setUp();

document.onkeyup = function (event) {
	$('#warning').hide();
	var userGuess = event.key.toUpperCase();

	//Verify that a letter in the alphabet is used
	if (/^[a-zA-Z]+$/.test(userGuess) && userGuess.length < 2) {
		game.addLettersGuessed(userGuess);
		makeAGuess(userGuess);

		//display everything on the page
		$('#progressWord').text(game.returnDisplayableProgressWord());
		$('#lettersGuessed').text(game.lettersGuessed);
		$('#guessesRemaining').text(game.allowedGuesses - game.guessCount);
		$('#wins').text(game.wins);
		$('#losses').text(game.losses);

	} else {
		document.querySelector("#warning").innerHTML = "Please press only letters!";
		$('#warning').show();
	}
}


//Allow user to select a difficulty by pressing easy mediam or hard
$(document).ready( function () {
	$("#easy").on("click", function () {
		game.difficulty = "easy";
		$('#difficulty').text("Taking it easy");
		setUp();
	});
	
	$("#medium").on("click", function () {
		game.difficulty = "medium";
		$('#difficulty').text("I'm okay with average.");
		setUp();
	});
	
	$("#hard").on("click", function () {
		game.difficulty = "hard";
		$('#difficulty').text("Bring it on!!");
		setUp();
	});
});