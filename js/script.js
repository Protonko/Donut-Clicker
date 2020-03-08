document.addEventListener('DOMContentLoaded', () => {
	let donut = document.querySelector('.donut');
	let total = document.querySelector('.block-score__total');
	let upgrades = document.querySelector('.block-shop__upgrades');
	let improvements = document.querySelector('.block-shop__improvements');
	let upgradesArray = {
		'hand' : {
			'bonus' : 2,
			'cost' : 100
		},
		'duff' : {
			'bonus' : 3,
			'cost' : 1000
		},
		'simpsons' : {
			'bonus' : 5,
			'cost' : 4000
		}
	}
	let improvementsArray = {
		'character' : {
			'icon' : '',
			'bonus' : 4,
			'cost' : 300,
		},
		'krusty' : {
			'icon': '',
			'bonus' : 40,
			'cost' : 5000,
		},
		'SpringfieldNPP' : {
			'icon' : '',
			'bonus' : 400,
			'cost' : 18000,
		}
	}
	let count = localStorage.getItem('dataCount');
	let donutsPerClick = localStorage.getItem('dataDonuts');
	let passiveIncrease = localStorage.getItem('dataPassiveIncrease');

	window.addEventListener('load', initCounter);
	donut.addEventListener('click', increaseCounter);
	upgrades.addEventListener('click', upgradeCoocking);
	improvements.addEventListener('click', upgradePassive);

	function initCounter() {
		(count == null) ? 0 : total.textContent = `${count} donuts`;
		if (donutsPerClick == null) donutsPerClick = 1;
		localStorage.setItem('dataCount', count);
		localStorage.setItem('dataDonuts', donutsPerClick);
		localStorage.setItem('dataPassiveIncrease', passiveIncrease);
	}
	// Увеличение баланса
	function increaseCounter() {
		count = Number(donutsPerClick) + Number(count);
		total.textContent = `${count} donuts`;
		localStorage.setItem('dataCount', count);
	}
	// Увеличение количества пончиков за клик
	function upgradeCoocking(e) {
		if (!e.target.closest('.block-shop__item')) return;
		let boost = e.target.closest('.block-shop__item').dataset.upgrade;
		if (count >= upgradesArray[boost].cost) {
			count -= upgradesArray[boost].cost;
			donutsPerClick = donutsPerClick * upgradesArray[boost].bonus;
			localStorage.setItem('dataDonuts', donutsPerClick);
			localStorage.setItem('dataCount', count);
			total.textContent = `${count} donuts`;
			e.target.closest('.block-shop__item').remove();
		} else {
			errorMessage(upgrades);
		}
	}
	// Пассивное увеличение пончиков (в секунду)
	function upgradePassive(e) {
		if (!e.target.closest('.block-shop__improve')) return;
		let improve = e.target.closest('.block-shop__improve').dataset.improve;
		if (count >= improvementsArrayArray[improve].cost) {
			count -= improvementsArray[improve].cost;
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
	}
});








