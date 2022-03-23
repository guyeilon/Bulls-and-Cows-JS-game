function getRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createArrayOfNumbers(start, end) {
	let myArray = [];
	for (let i = start; i <= end; i++) {
		myArray.push(i);
	}
	return myArray;
}

const randomNumber = () => {
	let number = Math.floor(Math.random() * 10);
	return number;
};

const generateNumber = () => {
	let secretNumberArray = [];
	let numbersArray = createArrayOfNumbers(1, 9);
	for (let i = 1; i <= 4; i++) {
		let randomIndex = getRandomNumber(0, numbersArray.length - 1);
		let randomNumber = numbersArray[randomIndex];
		numbersArray.splice(randomIndex, 1);
		secretNumberArray.push(randomNumber);
	}
	// secretNumber = secretNumberArray.join('');
	return secretNumberArray;
};

// Add active class to the current links (highlight it)
let navbar = document.getElementById('navbar');
let btns = navbar.getElementsByClassName('btn');
for (let i = 0; i < btns.length; i++) {
	btns[i].addEventListener('click', function () {
		let current = document.getElementsByClassName('active');
		current[0].className = current[0].className.replace(' active', '');
		this.className += ' active';
	});
}

document.querySelector('input').focus();

document.querySelector('.digits').addEventListener('input', function ({ target, data }) {
	data && (target.value = data.replace(/[^1-9]/g, ''));

	const hasValue = target.value !== '';
	const hasSibling = target.nextElementSibling;
	const hasSiblingInput = hasSibling && target.nextElementSibling.nodeName === 'INPUT';

	if (hasValue && hasSiblingInput) {
		target.nextElementSibling.focus();
	}
});
