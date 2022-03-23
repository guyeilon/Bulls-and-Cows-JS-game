let guessedNumberElement1 = document.getElementById('guessed_number1');
let guessedNumberElement2 = document.getElementById('guessed_number2');
let guessedNumberElement3 = document.getElementById('guessed_number3');
let guessedNumberElement4 = document.getElementById('guessed_number4');
let guessButtonElement = document.getElementById('guess_button');
let formElement = document.getElementById('form');
let nameFormElement = document.getElementById('name-form');
let resultElement = document.getElementById('result');
let errorElement = document.getElementById('error_validation');
let timeElement = document.getElementById('time');
let nameElement = document.getElementById('name');
let modals = document.querySelectorAll('[data-modal]');

let gSecretNumbersArray = [];
let gGuessNumberArray = [];
let gGuessNumber = null;
let gTotalStatus = [];
let gAllGuessesArray = [];
let gErrors = null;
let gScore = { name: '', tries: '', time: '' };
let gTotalScores = [];
let startTime, endTime;
let gTime;
let gTries;
let gName;

function startTimer() {
	startTime = new Date();
}

function endTimer() {
	endTime = new Date();
	let timeDiff = endTime - startTime;
	timeDiff /= 1000;
	gTime = Math.round(timeDiff);
}

const init = () => {
	startTimer();
	if (localStorage.getItem('NumToGuess')) {
		gSecretNumbersArray = JSON.parse(localStorage.getItem('NumToGuess'));
		console.log('Number to guess: ', Number(gSecretNumbersArray.join('')));
	}
	if (localStorage.getItem('totalStatus') && localStorage.getItem('totalGuesses')) {
		gTotalStatus = JSON.parse(localStorage.getItem('totalStatus'));
		gAllGuessesArray = JSON.parse(localStorage.getItem('totalGuesses'));
		renderTable(gTotalStatus, gAllGuessesArray);
	}
	if (localStorage.getItem('totalScores')) {
		gTotalScores = JSON.parse(localStorage.getItem('totalScores'));
		renderScoresTable(gTotalScores);
	}
};

const newGame = () => {
	endTimer();
	clearData();
	gSecretNumbersArray = generateNumber();
	localStorage.setItem('NumToGuess', JSON.stringify(gSecretNumbersArray));
	console.log('Number to guess: ', Number(gSecretNumbersArray.join('')));
	guessedNumberElement1.focus();
	startTimer();
};

const clearData = () => {
	gTotalStatus = [];
	gAllGuessesArray = [];
	guessedNumberElement1.value = '';
	guessedNumberElement2.value = '';
	guessedNumberElement3.value = '';
	guessedNumberElement4.value = '';
	localStorage.removeItem('NumToGuess');
	localStorage.removeItem('totalStatus');
	localStorage.removeItem('totalGuesses');
	renderTable(gTotalStatus, gAllGuessesArray);
	resultElement.innerText = '';
};

const gettingTheGuessNumber = () => {
	gGuessNumberArray = [
		guessedNumberElement1.value,
		guessedNumberElement2.value,
		guessedNumberElement3.value,
		guessedNumberElement4.value,
	];
	gGuessNumber = +gGuessNumberArray.join('');
};

const validate = () => {
	gErrors = null;
	gettingTheGuessNumber();
	let data = gGuessNumberArray;

	if (gGuessNumber / 1000 < 1) {
		gErrors = '4 digits required!';
		return false;
	}

	for (let i = 0; i < gAllGuessesArray.length; i++) {
		if (gAllGuessesArray[i] === gGuessNumber) {
			gErrors = 'You already tried that number...';
			return false;
		}
	}

	for (let i = 0; i < data.length; i++) {
		for (let j = 0; j < data.length; j++) {
			if (i !== j) {
				if (data[i] === data[j]) {
					gErrors = 'No repetitions allowed.';
					return false;
				}
			}
		}
	}
	return true;
};

const checkGuess = e => {
	e.preventDefault();

	let guessStatus = getHint(gSecretNumbersArray, gGuessNumberArray);
	gAllGuessesArray.push(gGuessNumber);

	localStorage.setItem('totalGuesses', JSON.stringify(gAllGuessesArray));
	gTotalStatus.push(guessStatus);
	localStorage.setItem('totalStatus', JSON.stringify(gTotalStatus));

	renderTable(gTotalStatus, gAllGuessesArray);
	checkWin(guessStatus);

	formElement.reset();
	guessedNumberElement1.focus();
};

formElement.addEventListener('submit', e => {
	let validateData = true;
	validateData = validate();
	if (validateData) {
		checkGuess(e);
	} else {
		e.preventDefault();
		errorElement.innerText = gErrors;
		setTimeout(() => {
			errorElement.innerText = '';
		}, 2000);
	}
});

const getHint = (secret, guess) => {
	let guessArr = new Array(10).fill(0);
	let secretArr = new Array(10).fill(0);
	let bull = 0;
	let cow = 0;

	getBulls();
	getCows();
	cow = cow - bull;

	return `${bull}A${cow}B`;

	function getBulls() {
		for (let i = 0; i < secret.length; i++) {
			secretArr[Number(secret[i])]++;
			guessArr[Number(guess[i])]++;

			if (secret[i] == guess[i]) {
				bull++;
			}
		}
	}

	function getCows() {
		for (let i = 0; i < 10; i++) {
			cow += Math.min(Number(guessArr[i]), Number(secretArr[i]));
		}
	}
};

const renderTable = (status, guesses) => {
	var strHtml = '';
	for (let i = 0; i < status.length; i++) {
		strHtml += `<tr><td >${i + 1}</td><td >${guesses[i]}</td><td >${status[i]}</td></tr>`;
	}

	var elTab = document.getElementById('game-status');
	elTab.innerHTML = strHtml;
};
const renderScoresTable = scores => {
	var strHtml = '';
	for (let i = 0; i < scores.length; i++) {
		strHtml += `<tr><td >${scores[i].name}</td><td >${scores[i].tries}</td><td >${scores[i].time} seconds</td></tr>`;
	}

	var elScoreTab = document.getElementById('scores-table');
	elScoreTab.innerHTML = strHtml;
};

const checkWin = guessStatus => {
	if (guessStatus === '4A0B') {
		endTimer();
		gTries = gAllGuessesArray.length;

		modals.forEach(function (trigger) {
			{
				var modal = document.getElementById(trigger.dataset.modal);
				modal.classList.add('open');
				nameElement.focus();

				timeElement.innerText = `You did it with ${gTries} tries in ${gTime} seconds `;
				nameFormElement.addEventListener('submit', e => {
					e.preventDefault();
					gName = nameElement.value;
					gScore.name = gName;
					gScore.time = gTime;
					gScore.tries = gTries;
					gTotalScores.push(gScore);
					localStorage.setItem('totalScores', JSON.stringify(gTotalScores));
					renderScoresTable(gTotalScores);
					modal.classList.remove('open');
				});
				var exits = modal.querySelectorAll('.modal-exit');
				exits.forEach(function (exit) {
					exit.addEventListener('click', function (event) {
						event.preventDefault();
						modal.classList.remove('open');
					});
				});
			}
		});
		newGame();
	}
};
