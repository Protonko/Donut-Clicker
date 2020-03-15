document.addEventListener('DOMContentLoaded', () => {
	let donut = document.querySelector('.donut');
	let total = document.querySelector('.block-score__total');
	let donutsPerSecondText = document.querySelector('.block-score__second');
	let upgrades = document.querySelector('.block-shop__upgrades');
	let improvements = document.querySelector('.block-shop__improvements');
	let achievements = document.querySelector('.block-achievements');
	let clickAudio = document.getElementById('click');
	let buyAudio = document.getElementById('buy');
	let errorAudio = document.getElementById('error-sound');
	let isSound = true;
	let upgradesArray = {
		'hand' : {
			'bonus' : 1,
			'cost' : 100
		},
		'duff' : {
			'bonus' : 10,
			'cost' : 1000
		},
		'simpsons' : {
			'bonus' : 2,
			'cost' : 10000
		}
	}
	let improvementsArray = {
		'character' : {
			'icon' : 'img/bart.png',
			'bonus' : 4,
			'cost' : 300,
			'background' : 'img/characters-background.png',
		},
		'lisa' : {
			'icon': 'img/lisa.png',
			'bonus' : 40,
			'cost' : 5000,
			'background' : 'img/kitchen.jpg',
		},
		'springfieldNPP' : {
			'icon' : 'img/MrBurns.png',
			'bonus' : 400,
			'cost' : 25000,
			'background' : 'img/springfieldNPP.png',
		}
	}
	let count = +localStorage.getItem('dataCount');
	let donutsPerClick = +localStorage.getItem('dataDonuts');
	let passiveIncrease = +localStorage.getItem('dataPassiveIncrease');

	window.addEventListener('load', initCounter);
	passiveIncome();
	donut.addEventListener('click', increaseCounter);
	upgrades.addEventListener('click', upgradeCoocking);
	improvements.addEventListener('click', upgradePassive);

	function initCounter() {
		if (donutsPerClick == 0) donutsPerClick = 1;
		//(passiveIncrease == 0) ? passiveIncrease = 0 : donutsPerSecondText.textContent = `per second ${passiveIncrease}`;
		(isNaN(count)) ? count = 0 : total.textContent = `${count} donuts`;
		donutsPerSecondText.textContent = `per second ${passiveIncrease}`;
		localStorage.setItem('dataCount', count);
		localStorage.setItem('dataDonuts', donutsPerClick);
	}
	// Увеличение баланса при клике на пончик
	function increaseCounter() {
		count = donutsPerClick + count;
		total.textContent = `${Math.round(count)} donuts`;
		localStorage.setItem('dataCount', count);
		playAudio(clickAudio)
	}
	// Увеличение количества пончиков за клик
	function upgradeCoocking(e) {
		if (!e.target.closest('.block-shop__item')) return;
		let boostBlock = e.target.closest('.block-shop__item');
		let boost = boostBlock.dataset.upgrade;
		if (count >= upgradesArray[boost].cost) {
			playAudio(buyAudio);
			count -= upgradesArray[boost].cost;
			(boost == 'simpsons') ?
				  donutsPerClick = donutsPerClick * Number(upgradesArray[boost].bonus)
				: donutsPerClick = donutsPerClick + Number(upgradesArray[boost].bonus);
			increaseBoost(boostBlock, donutsPerClick, 'dataDonuts');
		} else {
			errorMessage(upgrades);
		}
	}
	// Пассивное увеличение пончиков (в секунду)
	function upgradePassive(e) {
		if (!e.target.closest('.block-shop__improve')) return;
		let improveBlock =  e.target.closest('.block-shop__improve')
		let improve = improveBlock.dataset.improve;
		if (count >= improvementsArray[improve].cost) {
			playAudio(buyAudio);
			count -= improvementsArray[improve].cost;
			passiveIncrease = passiveIncrease + Number(improvementsArray[improve].bonus);
			increaseBoost(improveBlock, passiveIncrease, 'dataPassiveIncrease');
			donutsPerSecondText.textContent = `per second ${passiveIncrease}`;
			drawAchievement(improve);
		} else {
			errorMessage(improvements);
		}
	}
	// Сообщение о недостатке пончиков для покупки
	function errorMessage(place) {
		let errorInsufficient = document.createElement('p');
		errorInsufficient.className = 'block-shop__message';
		errorInsufficient.textContent = `Insufficient donuts`;
		place.append(errorInsufficient);
		setTimeout(() => errorInsufficient.remove(), 400);
		playAudio(errorAudio);
	}
	// Обновляем localStorage
	function increaseBoost(increaseBlock, increase, dataIncrease) {
		localStorage.setItem(dataIncrease, increase);
		localStorage.setItem('dataCount', count);
		total.textContent = `${ Math.round(count)} donuts`; // вычитаем пончики при покупке
		increaseBlock.classList.add('block-message__clicked'); // уведомляем о клике
		setTimeout(() => increaseBlock.classList.remove('block-message__clicked'), 500);
	}
	//Пассивный доход каждую секунду
	function passiveIncome() {
		setInterval(() => {
			count = Math.ceil(count + passiveIncrease / 10);
			localStorage.setItem('dataCount',  count);
			total.textContent = `${count} donuts`;
		}, 100);
	}
	// Отрисовка персонажей
	function drawAchievement(nameObj) {
		// создаем персонажа
		let character = document.createElement('div');
		character.className = 'block-achievements-container__character';
		let characterImage = document.createElement('img');
		characterImage.setAttribute('src', improvementsArray[nameObj].icon);
		// Проверяем, отрисован ли "дом" персонажа
		if (achievements.querySelector(`div[data-title="${nameObj}"]`)) {
			let achievementBlock = achievements.querySelector(`div[data-title="${nameObj}"]`);
			achievementBlock.append(character);
			character.append(characterImage);
		} else {
			let achievementBlock = document.createElement('div');
			achievementBlock.dataset.title = nameObj;
			achievementBlock.className = 'block-achievements-container';
			achievements.append(achievementBlock);
			achievementBlock.style.backgroundImage = `url("${improvementsArray[nameObj].background}")`;
			achievementBlock.append(character);
			character.append(characterImage);
		}
	}
	// Воспроизведение звука
	function playAudio(sound) {
		(isSound) ? sound.play() : false;
	}
});