let guessedNumberElement1 = document.getElementById('guessed_number1');
let guessedNumberElement2 = document.getElementById('guessed_number2');
let guessedNumberElement3 = document.getElementById('guessed_number3');
let guessedNumberElement4 = document.getElementById('guessed_number4');
let guessedNumberElement5 = document.getElementById('guessed_number5');
let guessButtonElement = document.getElementById('guess_button');
let formElement = document.getElementById('form');
let nameFormElement = document.getElementById('name-form');
let resultElement = document.getElementById('result');
let msgElement = document.getElementById('user-msg');
let timeElement = document.getElementById('time');
let nameElement = document.getElementById('name');
let startMsgElement = document.getElementById('start-new-game');
let modals = document.querySelectorAll('[data-modal]');
let svgLampElement = document.getElementById('lamp');
let levelElement = document.getElementById('level');
let boardElement = document.getElementById('board-container');
let descriptionElement = document.getElementById('description');
let hintElements;

let gSecretNumbersArray = [];
let gGuessNumberArray = [];
let gGuessNumber = null;
let gTotalStatus = [];
let gGuessStatus;
let gAllGuessesArray = [];
let gScore = { name: '', tries: '', time: '', hinted: '', level: '' };
let gTotalScores = [];
let startTime, endTime;
let gTime;
let gTries;
let gName = null;
let gSpecialNumber = [];
let gDataForHint = [];
let msgTimeout;
let gLevel = 4;
let gLevels = {
	3: 'easy',
	4: 'medium',
	5: 'hard',
};

const getLevel = () => {
	gLevel = Number(levelElement.value);

	if (gLevel === 3) {
		guessedNumberElement5?.classList.add('hidden');
		guessedNumberElement4?.classList.add('hidden');
	}
	if (gLevel === 4) {
		guessedNumberElement5?.classList.add('hidden');
		guessedNumberElement4.classList.remove('hidden');
	}
	if (gLevel === 5) {
		guessedNumberElement5.classList.remove('hidden');
		guessedNumberElement4.classList.remove('hidden');
	}
	newGame();
};

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
	msgElement.classList.contains('error') ? msgElement.classList.remove('error') : null;
	msgElement.classList.contains('msg') ? msgElement.classList.remove('msg') : null;
	clearTimeout(msgTimeout);
	msgElement.innerText = msg;
	msgElement.classList.add(color);

	msgTimeout = setTimeout(() => {
		msgElement.innerText = '';
		msgElement.classList.remove(color);
	}, 3000);
};

const newGame = () => {
	formElement.classList.contains('hidden') ? formElement.classList.remove('hidden') : null;
	levelElement.classList.contains('hidden') ? levelElement.classList.remove('hidden') : null;

	userMsg('I picked new number for you', 'msg');

	startMsgElement.innerText = 'New Game';

	clearData();
	gSecretNumbersArray = generateNumber(gLevel);
	localStorage.setItem('NumToGuess', JSON.stringify(gSecretNumbersArray));
	console.log('Number to guess: ', Number(gSecretNumbersArray.join('')));
	guessedNumberElement1.focus();
	startTimer();
};

const clearData = () => {
	gScore = { name: '', tries: '', time: '', hinted: '', level: '' };
	gName = '';
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
	svgLampElement.classList.remove('light');
};

const gettingTheGuessNumber = () => {
	gGuessNumberArray = [
		guessedNumberElement1.value,
		guessedNumberElement2.value,
		guessedNumberElement3.value,
		// guessedNumberElement4.value,
		// guessedNumberElement5.value,
	];
	if (gLevel === 4) {
		gGuessNumberArray.push(guessedNumberElement4.value);
	}
	if (gLevel === 5) {
		gGuessNumberArray.push(guessedNumberElement4.value);
		gGuessNumberArray.push(guessedNumberElement5.value);
	}
	gGuessNumber = +gGuessNumberArray.join('');
};

const validate = () => {
	gettingTheGuessNumber();
	let data = gGuessNumberArray;

	if (gLevel === 3 && gGuessNumber / 100 < 1) {
		userMsg('3 digits required!', 'error');
		return false;
	}
	if (gLevel === 4 && gGuessNumber / 1000 < 1) {
		userMsg('4 digits required!', 'error');
		return false;
	}
	if (gLevel === 5 && gGuessNumber / 10000 < 1) {
		userMsg('5 digits required!', 'error');
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
					console.log(data[i]);
					console.log(data[j]);
					userMsg('No repetitions allowed.', 'error');
					return false;
				}
			}
		}
	}
	return true;
};

const checkGuess = () => {
	boardElement.classList.contains('hidden') ? boardElement.classList.remove('hidden') : null;
	svgLampElement.classList.remove('light');
	gGuessStatus = getHint(gSecretNumbersArray, gGuessNumberArray);
	storData();
	checkWin(gGuessStatus, gLevel);
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
	if (!svgLampElement.classList.contains('light')) {
		if (hintElements && hintElements.length === 0) {
			userMsg(`Can't help you yet...keep trying`, 'msg');
		}
		if (hintElements && hintElements.length > 0) {
			svgLampElement.classList.add('light');
			for (let i = 0; i < hintElements.length; i++) {
				hintElements[i].classList.add('show');
			}
			gScore.hinted = '💡';
			userMsg(`Here you go...`, 'msg');
		}
	} else {
		svgLampElement.classList.remove('light');
		for (let i = 0; i < hintElements.length; i++) {
			hintElements[i].classList.remove('show');
		}
		userMsg(`You're on your on!`, 'msg');
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
		strHtml += `<tr>
		<td >${i + 1}</td>
		<td >${scores[i].name}</td>
		<td >${scores[i].tries}</td>
		<td >${scores[i].level}</td>
		<td >${scores[i].time} sec</td>
		<td >${scores[i].hinted ? scores[i].hinted : ''}</td>
		</tr>`;
	}

	var elScoreTab = document.getElementById('scores-table');
	elScoreTab.innerHTML = strHtml;
};
const checkWin = (status, level) => {
	switch (true) {
		case status === '3A0B' && level === 3:
		case status === '4A0B' && level === 4:
		case status === '5A0B' && level === 5:
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
		case status === '0A0B':
			userMsg('Try again...', 'msg');
			break;
		case status === '1A0B':
		case status === '2A0B':
			userMsg('You`r  getting close...', 'msg');
			break;
		case status === '3A0B':
		case status === '0A3B':
		case status === '2A2B':
		case status === '1A3B':
		case status === '0A4B':
			userMsg('You`r  almost there...', 'msg');
			break;
		default:
			userMsg('Want help? click me 💡 ', 'msg');
	}
};

nameFormElement.addEventListener('submit', e => {
	e.preventDefault();
	gName = nameElement.value;
	storData(gName, gTime, gTries, gLevel);
});

const sortRecords = records => {
	records.sort((a, b) => parseFloat(a.time) - parseFloat(b.time));
};

const storData = (gName, gTime, gTries, gLevel) => {
	if (gName) {
		gScore.name = gName;
		gScore.time = gTime;
		gScore.tries = gTries;
		gScore.level = gLevels[gLevel];
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
