document.addEventListener('DOMContentLoaded', () => {
	'use strict';
	
	const options = {
		eventType: 'keydown',
		keystrokeDelay: 2200
	};
	
	keyMapper(checkKonami, options);
});


function keyMapper(callback, options) {
	const delay = hasProperty('keystrokeDelay', options) && options.keystrokeDelay >= 300 && options.keystrokeDelay;
	const keystrokeDelay = delay || 1000;
	const eventType = hasProperty('eventType', options) && options.eventType || 'keydown';
	
	let state = {
		buffer: [],
		lastKeyTime: Date.now()
	};
	
	document.addEventListener(eventType, event => {
		const key = event.key;
		const currentTime = Date.now();
		let buffer = [];
		
		if (currentTime - state.lastKeyTime > keystrokeDelay) {
			buffer = [key];
		} else {
			buffer = [...state.buffer, key];
		}
		
		state = {buffer: buffer, lastKeyTime: currentTime};
		callback(buffer);
	});
	
	function hasProperty(property, object) {
		return object && object.hasOwnProperty(property);
	}
}


function checkKonami(keySequence) {
	//const userInput = keySequence.join('').toLowerCase();   // Case insensitive
	const userInput = keySequence.join('');   // Case sensitive
	const keySequences = {
		'idfa': 'All Weapons + Ammo',
		'idkfa': 'All Weapons + Ammo + Keys',
		'idbeholds': 'Beserk Pack',
		'idclev31': 'Bonus Level',
		'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightab': 'Yay!!!'
	};
	const userInputDisplay = document.querySelector('#user_input');
	userInputDisplay.textContent = userInput;
	
	const cheatMessage = document.querySelector('#cheat_message');
	cheatMessage.textContent = keySequences[userInput] || '';
}
