'use-strict'

const shop = require('../models').Shop;
const coffee = require('../models').Coffee;

shop.findByPk("00b3bcdd-3d14-4068-8941-6bd1870974b3").then((foundShop) => {
	console.log(foundShop);
	foundShop.createCoffee({
		name: 'Espresso',
		type: 'hot',
		description: 'Hot espresso'
	}).then((newCoffeeDrink) => {
		console.log(newCoffeeDrink);
		console.log('new coffee is available in shop');
	});
});
