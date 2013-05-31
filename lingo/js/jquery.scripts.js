$(document).ready(function () {

	// load data into homescreen
	loadTeams();
	loadGames();
	
	//set home and nav buttons
	loadButtons();
	
	//set number handler
	$(".number").click(function () {
		clickNumber($(this));
	});
	
	//set tune button handler
	$("#btnTune").click(function () {
		playSound('Lingo_Theme_ 19892000.mp3');
	});
	
	//set event handler for input box
	$("#spellingBox").keyup(function (key) {
		handleInput(key);
	});
	
	// show home screen
	showScreen("home");
	
});

function playSound(soundfile, callback) {
	$("#dummy").html("").append(
		$("<audio></audio>").attr('src', soundDir+'/'+soundfile).css('visibility', 'hidden').attr('autoplay', '1')
		.bind("ended", callback)
	);
 }

function setLetterCorrect(selector, c) {
	playSound("lingo_beep.mp3", c);
	$(selector).css("background-color", "rgb(2, 241, 2)");
}

function setLetterInWord(selector, c) {
	playSound("lingo_beep_verkeerd.mp3", c);
	$(selector).css("background-color", "#ffff00");
}

function resetLetter(selector) {
	$(selector).css("background-color", "#FFFFFF");
}

function setNumberActive(selector, c) {
	$(selector).css("background-color", "#ffff00");
	playSound('Lingo_Bal.mp3', c);
}

function setNumberInActive(selector) {
	$(selector).css("background-color", "#FFFFFF");
}

function clickNumber(object) {
	
	var number = object.html();
	var indexOfNumber = $.inArray(number, active.numbersDrawn);
	if (indexOfNumber >= 0) {
		active.numbersDrawn.splice(indexOfNumber, 1);
		setNumberInActive(".number" + number);
	} else {
		active.numbersDrawn.push(number);
		setNumberActive(".number" + number);
		checkForLingo();
	}
	
}

function checkForLingo() {
	if (	(isDrawn(1) && isDrawn(3) && isDrawn(5) && isDrawn(7)) ||
			(isDrawn(9) && isDrawn(11) && isDrawn(13) && isDrawn(15)) ||
			(isDrawn(17) && isDrawn(19) && isDrawn(21) && isDrawn(23)) ||
			(isDrawn(25) && isDrawn(27) && isDrawn(29) && isDrawn(31)) ||
			(isDrawn(1) && isDrawn(9) && isDrawn(17) && isDrawn(25)) ||
			(isDrawn(3) && isDrawn(11) && isDrawn(19) && isDrawn(27)) ||
			(isDrawn(5) && isDrawn(13) && isDrawn(21) && isDrawn(29)) ||
			(isDrawn(7) && isDrawn(15) && isDrawn(23) && isDrawn(31)) ||
			(isDrawn(1) && isDrawn(11) && isDrawn(21) && isDrawn(31)) ||
			(isDrawn(7) && isDrawn(13) && isDrawn(19) && isDrawn(25))) {
				//team 1 lingo
				playSound('Lingo_Goed_Word.mp3');
				active.score1 += 150;
				for (var i = 1; i < 33; i = i + 2) {
					var indexOfNumber = $.inArray(i + "", active.numbersDrawn);
					if (indexOfNumber >= 0)
						active.numbersDrawn.splice(indexOfNumber, 1);
				}
				setTimeout("clearNumberScreen1()", 5000);
			}
			
	if (	(isDrawn(2) && isDrawn(4) && isDrawn(6) && isDrawn(8)) ||
			(isDrawn(10) && isDrawn(12) && isDrawn(14) && isDrawn(16)) ||
			(isDrawn(18) && isDrawn(20) && isDrawn(22) && isDrawn(24)) ||
			(isDrawn(26) && isDrawn(28) && isDrawn(30) && isDrawn(32)) ||
			(isDrawn(2) && isDrawn(10) && isDrawn(18) && isDrawn(26)) ||
			(isDrawn(4) && isDrawn(12) && isDrawn(20) && isDrawn(28)) ||
			(isDrawn(6) && isDrawn(14) && isDrawn(22) && isDrawn(30)) ||
			(isDrawn(8) && isDrawn(16) && isDrawn(24) && isDrawn(32)) ||
			(isDrawn(2) && isDrawn(12) && isDrawn(22) && isDrawn(32)) ||
			(isDrawn(8) && isDrawn(14) && isDrawn(20) && isDrawn(26))) {
				//team 2 lingo
				playSound('Lingo_Goed_Word.mp3');
				active.score2 += 150;
				for (var i = 2; i < 33; i = i + 2) {
					var indexOfNumber = $.inArray(i + "", active.numbersDrawn);
					if (indexOfNumber >= 0)
						active.numbersDrawn.splice(indexOfNumber, 1);
				}
				setTimeout("clearNumberScreen2()", 5000);
			}
			
	refreshScore();
}

function isDrawn(number) {
	return ($.inArray(number + "", active.numbersDrawn) >= 0);
}

function showScreen(screen) {

	// hide all screens
	$(".screencontainer").fadeOut();

	// show the correct screen
	switch (screen) {
		case "home":
			$("#homecontainer").fadeIn();
			break;
		case "word":
			$("#wordcontainer").fadeIn();
			break;
		case "chart1":
			$("#chartcontainer1").fadeIn();
			break;
		case "chart2":
			$("#chartcontainer2").fadeIn();
			break;
	}
	
}

function startWord() {
	active.word++;
	clearWordScreen();
	active.guess = ".......";
	active.attempt = 1;
	prepareWordLine();
	showScreen("word");
	playSound("Lingo_Eerste_Letter.mp3");
}

function clearWordScreen() {
	$(".letter").html("");
	resetLetter(".letter");
	$(".word6").hide();
	$("#timer").html("");
}

function clearNumberScreen1() {
	resetLetter($("#chartcontainer1 .numbers .number"));
	
	for (var i = 1; i < 33; i = i + 2) {
		var indexOfNumber = $.inArray(i + "", active.numbersDrawn);
		if (indexOfNumber >= 0)
			active.numbersDrawn.splice(indexOfNumber, 1);
	}
}

function clearNumberScreen2() {
	resetLetter($("#chartcontainer2 .numbers .number"));
	
	for (var i = 2; i < 33; i = i + 2) {
		var indexOfNumber = $.inArray(i + "", active.numbersDrawn);
		if (indexOfNumber >= 0)
			active.numbersDrawn.splice(indexOfNumber, 1);
	}
}

function prepareWordLine() {
	
	//if first attempt, prepare line
	if (active.attempt == 1) {
		active.guess = games[active.game][active.word].charAt(0);
		for (var i = 1; i < games[active.game][active.word].length; i++) {
			active.guess += ".";
		}
	}
	
	//set the letters
	for (var i = 0; i < active.guess.length; i++) {
		var selector = ".word" + active.attempt + " .letter" + i;
		$(selector).html(active.guess.charAt(i));
	}

	//refresh control
	refreshControl();
	
	//focus on input screen
	$("#spellingBox").focus();


	
}

function handleInput(key) {
	//13 enter
	//8 backspace
	//>= 65 && <= 90 letters
	
	var key = key.keyCode;
	
	if (key == 8 || (key >= 65 && key <= 90)) {
		//set the letters
		for (var i = 0; i < games[active.game][active.word].length; i++) {
			var selector = ".word" + active.attempt + " .letter" + i;
			if (i < $("#spellingBox").val().length)
				$(selector).html($("#spellingBox").val().charAt(i));
			else
				$(selector).html(active.guess.charAt(i));
		}
	} 
	
	if (key == 13) {
		if ($("#spellingBox").val().length == games[active.game][active.word].length) {
			doAttempt($("#spellingBox").val());
		}
	}
}

function doAttempt(attemptWord) {
	
	var wordToGuess = games[active.game][active.word];
	
	if (attemptWord.length == games[active.game][active.word].length) {
		
		//check which letters should be made yellow
		var containsLetter = wordToGuess;
		for (var i = 0; i < attemptWord.length; i++) {
			if (attemptWord.charAt(i) == wordToGuess.charAt(i)) {
				containsLetter = replaceAt(containsLetter, ".", i);
			}
		}
		
		var stack = attemptWord.split("");
		function step(){
			letter = stack.shift();
			var i = wordToGuess.length - stack.length - 1;
			if(letter)
			{
				var selector = ".word" + active.attempt + " .letter" + i;
				if (letter == wordToGuess.charAt(i)) {
					setLetterCorrect(selector, step);
					active.guess = replaceAt(active.guess, letter, i);
				} else if (containsLetter.indexOf(letter) !== -1) {
					setLetterInWord(selector, step);
					containsLetter = replaceAt(containsLetter, ".", containsLetter.indexOf(letter));
				} else {
					playSound("lingo_beep_niks.mp3", step);
				}
				i++;
			}
			else
			{
				$("#spellingBox").val("").focus();
				if (attemptWord == wordToGuess) {
					guessedWord();
					playSound("lingo_goed.mp3");
				} else if (active.attempt == 5) {
					playSound("lingo_fout.mp3");
					setTimeout("notGuessedWord()", 2000);
				} else {
					active.attempt++;
					prepareWordLine();
				}
				$("#spellingBox").val("").focus();
			}
		}
		step();
	}
	
}

function guessedWord() {

	if (active.word % 2 == 0) {
		//team 1
		active.score1 += 175 - (25 * active.attempt);
		refreshScore();
		setTimeout("showScreen('chart1')", 2000);
	} else {
		//team 2
		active.score2 += 175 - (25 * active.attempt);
		refreshScore();
		setTimeout("showScreen('chart2')", 2000);
	}
	setTimeout("clearWordScreen()", 2500);
	
}

function notGuessedWord() {
	$(".word6").fadeIn();

	//set the letters
	for (var i = 0; i < games[active.game][active.word].length; i++) {
		(function(i){
			setTimeout(function(){
		
				var selector = ".word6 .letter" + i;
				$(selector).html(games[active.game][active.word].charAt(i));
				setLetterCorrect(selector);
		
			}, 500 + (250 * i));
		}(i));
	}
	
	if (active.word % 2 == 0) {
		setTimeout("showScreen('chart1')", 2500 + (250 * games[active.game][active.word].length));
	} else {
		setTimeout("showScreen('chart2')", 2500 + (250 * games[active.game][active.word].length));
	}
	setTimeout("clearWordScreen()", 3000 + (250 * games[active.game][active.word].length));
	
}

function replaceAt(x, c, i) {
	return x.substring(0, i) + c + x.substring(i+1);
}

function refreshScore() {
	$("#score1").html(active.score1);
	$("#score2").html(active.score2);
}

function refreshControl() {
	$("#ctrlGame").html(active.game);
	if (active.word == -1)
		$("#ctrlWord").html("0");
	else
		$("#ctrlWord").html(active.word);
	$("#ctrlAttempt").html(active.attempt);
}

function startNewGame() {
	
	if (active.status == "nostart") {
		//set active object
		active.status = "settingup";
		active.game = $("#selGame").val();
		active.word = -1;
		active.team1 = $("#selTeam1").val();
		active.team2 = $("#selTeam2").val();
		active.score1 = 0;
		active.score2 = 0;
		active.numbersDrawn = [];
		
		//set teams and score
		$("#teamname1").html(teams[active.team1]);
		$("#teamname2").html(teams[active.team2]);
		$("#score1").html(active.score1);
		$("#score2").html(active.score2);
		$("#navChart1").html(teams[active.team1]);
		$("#navChart2").html(teams[active.team2]);
		
		//set control data
		$("#ctrlGame").html(active.game);
		$("#ctrlWord").html(0);
		$("#ctrlAttempt").html(0);
		
		//set ready status
		active.status = "ready";
		
		//set the chart screen
		showScreen("chart1");
	}
	
}

function loadButtons() {

	$("#btnStart").click(function () {
		startNewGame();
	});

	$("#btnReset").click(function () {
		window.location.reload();
	});
	
	$("#navHome").click(function () {
		showScreen("home");
	});
	
	$("#navWords").click(function () {
		if (active.status == "ready") 
			showScreen("word");
	});
	
	$("#navChart1").click(function () {
		if (active.status == "ready") 
			showScreen("chart1");
	});
	
	$("#navChart2").click(function () {
		if (active.status == "ready") 
			showScreen("chart2");
	});
	
	$("#ctrlStartWord").click(function () {
		if (active.status == "ready") 
			startWord();
	});

}

function loadTeams() {
	
	$.each(teams, function(index, value) {
		var optionString = 
			"<option value=" + index + ">" + value + "</option>";
		$("#selTeam1").append(optionString);
		$("#selTeam2").append(optionString);
	});
	
}

function loadGames() {

	$.each(games, function(index, value) {
		if (checkGame(games[index])) {
			var optionString = 
				"<option value=" + index + ">Game " + (index + 1) + "</option>";
			$("#selGame").append(optionString);
		}
	});
}

function checkGame(game) {

	return checkWord(game[0], 5) &&
		   checkWord(game[1], 5) &&
		   checkWord(game[2], 6) &&
		   checkWord(game[3], 6) &&
		   checkWord(game[4], 7) &&
		   checkWord(game[5], 7);
}

function checkWord(word,wLength) {
	
	if (word.length != wLength)
		return false;
		
	//TODO: add check for alphabet chars (no numeric)
	
	return true;
	
}