let guessedNumberElement1 = document.getElementById('guessed_number1');
let guessedNumberElement2 = document.getElementById('guessed_number2');
let guessedNumberElement3 = document.getElementById('guessed_number3');
let guessedNumberElement4 = document.getElementById('guessed_number4');
let guessButtonElement = document.getElementById('guess_button');
let formElement = document.getElementById('form');
let nameFormElement = document.getElementById('name-form');
let resultElement = document.getElementById('result');
let msgElement = document.getElementById('user-msg');
let timeElement = document.getElementById('time');
let nameElement = document.getElementById('name');
let startMsgElement = document.getElementById('start-new-game');
let modals = document.querySelectorAll('[data-modal]');
let hintElements;

let gSecretNumbersArray = [];
let gGuessNumberArray = [];
let gGuessNumber = null;
let gTotalStatus = [];
let gGuessStatus;
let gAllGuessesArray = [];
let gScore = { name: '', tries: '', time: '', hinted: '' };
let gTotalScores = [];
let startTime, endTime;
let gTime;
let gTries;
let gName = null;
let gSpecialNumber = [];
let gDataForHint = [];

const init = () => {
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

const userMsg = (msg, color) => {
	msgElement.innerText = msg;
	msgElement.classList.add(color);
	setTimeout(() => {
		msgElement.innerText = '';
		msgElement.classList.remove(color);
	}, 3000);
};

const newGame = () => {
	formElement.classList.contains('hidden') ? formElement.classList.remove('hidden') : null;
	userMsg('I picked new number for you', 'msg');

	startMsgElement.innerText = 'New Game';

	clearData();
	gSecretNumbersArray = generateNumber();
	localStorage.setItem('NumToGuess', JSON.stringify(gSecretNumbersArray));
	console.log('Number to guess: ', Number(gSecretNumbersArray.join('')));
	guessedNumberElement1.focus();
	startTimer();
};

const clearData = () => {
	gScore = { name: '', tries: '', time: '' };
	gName = null;
	// gTotalScores = [];
	gTotalStatus = [];
	gAllGuessesArray = [];
	gSpecialNumber = [];
	gDataForHint = [];
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
	gettingTheGuessNumber();
	let data = gGuessNumberArray;

	if (gGuessNumber / 1000 < 1) {
		userMsg('4 digits required!', 'error');
		return false;
	}

	for (let i = 0; i < gAllGuessesArray.length; i++) {
		console.log(gAllGuessesArray[i]);
		console.log(gGuessNumber);
		if (gAllGuessesArray[i] == gGuessNumber) {
			userMsg('You already tried that number...', 'error');
			return false;
		}
	}

	for (let i = 0; i < data.length; i++) {
		for (let j = 0; j < data.length; j++) {
			if (i !== j) {
				if (data[i] === data[j]) {
					userMsg('No repetitions allowed.', 'error');
					return false;
				}
			}
		}
	}
	return true;
};

const checkGuess = () => {
	gGuessStatus = getHint(gSecretNumbersArray, gGuessNumberArray);
	storData();
	checkWin(gGuessStatus);
	formElement.reset();
	guessedNumberElement1.focus();
};

formElement.addEventListener('submit', e => {
	e.preventDefault();
	let validateData;
	validateData = validate();
	if (validateData) {
		checkGuess();
	} else {
		formElement.reset();
		guessedNumberElement4.blur();
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

const markBulls = (secret, guessesArray) => {
	gSpecialNumber = [];
	let temp = [...guessesArray];
	for (let i = 0; i < guessesArray.length; i++) {
		for (let j = 0; j < secret.length; j++) {
			if (secret[j] == guessesArray[i][j]) {
				temp[i][j] = `<span class="hint_number">${guessesArray[i][j]}</span>`;
			}
		}
		gSpecialNumber.push(temp[i].join(''));
	}
};

const showBull = () => {
	for (let i = 0; i < hintElements.length; i++) {
		hintElements[i].classList.add('show');
	}
	gScore.hinted = '💡';
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
		strHtml += `<tr><td >${i + 1}</td><td >${scores[i].name}</td><td >${scores[i].tries}</td><td >${
			scores[i].time
		} sec</td><td >${scores[i].hinted ? scores[i].hinted : ''}</td></tr>`;
	}

	var elScoreTab = document.getElementById('scores-table');
	elScoreTab.innerHTML = strHtml;
};
const checkWin = guessStatus => {
	switch (guessStatus) {
		case '4A0B':
			endTimer();
			userMsg('You did it!', 'msg');
			formElement.classList.add('hidden');
			gTries = gAllGuessesArray.length;

			modals.forEach(function (trigger) {
				{
					let modal = document.getElementById(trigger.dataset.modal);
					modal.classList.add('open');
					nameElement.focus();

					timeElement.innerText = `You did it with ${gTries} tries in ${gTime} seconds `;
					nameFormElement.addEventListener('submit', e => {
						e.preventDefault();

						modal.classList.remove('open');
					});
					let exits = modal.querySelectorAll('.modal-exit');
					exits.forEach(function (exit) {
						exit.addEventListener('click', function (event) {
							event.preventDefault();
							modal.classList.remove('open');
						});
					});
				}
			});
			break;
		case '0A0B':
			userMsg('Try again...', 'msg');
			break;
		case '1A0B':
		case '2A0B':
			userMsg('You`r  getting close...', 'msg');
			break;
		case '3A0B':
		case '0A3B':
		case '2A2B':
		case '1A3B':
		case '0A4B':
			userMsg('You`r  almost there...', 'msg');
			break;
		default:
			userMsg('Nice try, but not enough...', 'msg');
	}
};

nameFormElement.addEventListener('submit', e => {
	e.preventDefault();
	gName = nameElement.value;
	storData(gName, gTime, gTries);
});

const sortRecords = records => {
	records.sort((a, b) => parseFloat(a.time) - parseFloat(b.time));
};

const storData = (gName, gTime, gTries) => {
	if (gName) {
		gScore.name = gName;
		gScore.time = gTime;
		gScore.tries = gTries;
		gTotalScores.push(gScore);
		sortRecords(gTotalScores);
		localStorage.setItem('totalScores', JSON.stringify(gTotalScores));
		renderScoresTable(gTotalScores);
		return;
	}
	gTotalStatus.push(gGuessStatus);
	gAllGuessesArray.push(gGuessNumberArray.join(''));
	gDataForHint.push(gGuessNumberArray);
	markBulls(gSecretNumbersArray, gDataForHint);
	renderTable(gTotalStatus, gSpecialNumber);
	hintElements = document.getElementsByClassName('hint_number');
	localStorage.setItem('totalGuesses', JSON.stringify(gSpecialNumber));
	localStorage.setItem('totalStatus', JSON.stringify(gTotalStatus));
};

function startTimer() {
	startTime = new Date();
}

function endTimer() {
	endTime = new Date();
	let timeDiff = endTime - startTime;
	timeDiff /= 1000;
	gTime = Math.round(timeDiff);
}

// for debugging
const print = () => {
	console.log('gSpecialNumber', gSpecialNumber);
	console.log('gAllGuessesArray', gAllGuessesArray);

	console.log('gGuessNumber', gGuessNumber);
	console.log('gGuessNumberArray', gGuessNumberArray);
	console.log('gSecretNumbersArray', gSecretNumbersArray);
	console.log('hintElements', hintElements);
};
