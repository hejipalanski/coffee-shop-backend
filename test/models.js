'use-strict'

const shop = require('../models').Shop;
const coffee = require('../models').Coffee;

shop.create({
	name: 'Starbucks, G.M.A, Cavite',
	location: 'GMA, Cavite, 4117',
	franchisee: 'Heji Palanski'
}).then((newShop) => {
	console.log(`Opening new shop at ${newShop.location}`);
	newShop.createCoffee({
		name: 'Espresso',
		type: 'hot',
		description: 'Hot espresso'
	}).then((newCoffeeDrink) => {
		console.log('new coffee is available in shop');
	});
});
