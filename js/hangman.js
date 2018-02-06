//Function to handle sound
(function ($) {
	$.extend({
		playSound: function () {
			return $(
				'<audio class="sound-player" autoplay="autoplay" style="display:none;">'
				+ '<source src="' + arguments[0] + '" />'
				+ '<embed src="' + arguments[0] + '" hidden="true" autostart="true" loop="false"/>'
				+ '</audio>'
			).appendTo('body');
		},
		stopSound: function () {
			$(".sound-player").remove();
		}
	});
})(jQuery);

//All the game options
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
	audioUrl: "",
	words: ["thomas", "kayak", "skiing", "snowboarding", "hiking", "boardgames", "snowmobile"],
	populateUsedWords: function () {
		this.usedWords.push(currentWord);
	},
	//sets a random word for the user to guess
	getRandomWord: function () {
		this.currentWord = this.words[Math.floor(Math.random() * Math.floor(this.words.length))].toUpperCase();
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
		for (var i = 0; i < this.progressWord.length; i++) {
			if (i === 0) {
				tempProgressWord = this.progressWord.charAt(i);
			} else {
				tempProgressWord += " " + this.progressWord.charAt(i);
			}
		}
		return tempProgressWord;
	},
	updateProgressWord: function (index, replacement) {
		console.log("substr " + this.progressWord);
		return this.progressWord.substr(0, index) + replacement + this.progressWord.substr(index + replacement.length);
		// console.log("substr " + this.progressWord);
	},
	updateChalkBoard: function () {
		//display everything on the chalkboard
		$('#progressWord').text(this.returnDisplayableProgressWord());
		$('#lettersGuessed').text(this.lettersGuessed);
		$('#guessesRemaining').text(this.allowedGuesses - this.guessCount);
		$('#wins').text(this.wins);
		$('#losses').text(this.losses);
	},
	//Set up the game
	setUp: function () {
		this.lettersGuessed = "";
		this.guessCount = 0;
		setGuessCount();
		this.getRandomWord();
		this.progressWord = "";
		for (var i = 0; i < this.currentWord.length; i++) {
			this.progressWord += "_";
		}
		this.allowedGuesses = setGuessCount();
		this.updateChalkBoard();
	},
	// removes the used word from the array so that it will not be picked again while playing.
	removeUsedWord: function () {
		this.words.splice($.inArray(this.currentWord.toLowerCase(), this.words), 1);
		console.log(this.words);
	},
	checkFile: function () {
		$.ajax({
			url: 'audio/' + this.currentWord.toLowerCase() + '.wav',
			error: function () {
				//file does not exist
				return false;
			},
			success: function () {
				//file exists
				return true;
			}
		});
	},
	winner: function () {
		var imgSource = '<img class="win-img" src="images/' + this.currentWord.toLowerCase() + '.jpg">'
		this.wins++;
		this.removeUsedWord();
		$('#displayImage').append(imgSource);
		// console.log(this.checkFile());
		// if(this.checkFile()){
		// 	$.playSound('audio/' + this.currentWord.toLowerCase() + '.wav');
		// }else{
		// 	$.playSound('audio/default.wav');
		// }
		
		if ($.inArray(this.currentWord.toLowerCase(), this.words) === -1) {
			$.playSound('audio/default.wav');
		} else {
			$.playSound('audio/' + this.currentWord.toLowerCase() + '.wav');
		}
		this.setUp();
	},
	loser: function () {
		this.losses++;
		this.removeUsedWord();
		this.setUp();
	}
}

// sets the value of guesses allowed base of length of the word
function setGuessCount() {
	var difficultyValue = 0;
	switch (game.difficulty) {
		case "easy":
			return game.currentWord.length + 10;
			break;
		case "medium":
			return game.currentWord.length + 5;
			break;
		case "hard":
			return game.currentWord.length + 2;
			break;
		default:
			return 13;
	}
}

function makeAGuess(guess) {
	//create the underscores where letters have not been guessed
	for (var i = 0; i < game.currentWord.length; i++) {
		if (game.currentWord.charAt(i) === guess) {
			game.progressWord = game.updateProgressWord(i, guess);
		}
	}
	game.guessCount++;

	if (game.progressWord === game.currentWord) {
		game.winner();
	}
	if ((game.allowedGuesses - game.guessCount) === 0) {
		game.loser();
	}
}

//use this function to initialize everything
game.setUp();

document.onkeyup = function (event) {
	$('#warning').hide();
	var userGuess = event.key.toUpperCase();

	//Verify that a letter in the alphabet is used
	if (/^[a-zA-Z]+$/.test(userGuess) && userGuess.length < 2) {
		game.addLettersGuessed(userGuess);
		makeAGuess(userGuess);
		game.updateChalkBoard();
	} else {
		document.querySelector("#warning").innerHTML = "Please press only letters!";
		$('#warning').show();
	}
}


//Allow user to select a difficulty by pressing easy mediam or hard
$(document).ready(function () {
	$("#easy").on("click", function () {
		game.difficulty = "easy";
		$('#difficulty').text("Taking it easy");
		game.setUp();
	});

	$("#medium").on("click", function () {
		game.difficulty = "medium";
		$('#difficulty').text("I'm okay with average.");
		game.setUp();
	});

	$("#hard").on("click", function () {
		game.difficulty = "hard";
		$('#difficulty').text("Bring it on!!");
		game.setUp();
	});
});

