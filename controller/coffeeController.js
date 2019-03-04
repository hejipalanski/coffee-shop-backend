'use-strict'

const util = require('../helpers/util');
const db = require('../models');
const shop = db.Shop;
const coffee = db.Coffee;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const create = (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let shopId = req.params.shopId;
	const payload = req.body;
	if(Object.keys(payload).length > 0) {
		if(util.isUUID(shopId)) {
			return shop.findByPk(shopId)
			.then(foundShop => {
				if(foundShop) {
					return foundShop.createCoffee(payload)
					.then(newCoffeeDrink => {
						return util.sendResponse(res, {
							data: newCoffeeDrink
						}, 201);
					})
					.catch(err => {
						console.log(err);
						return util.sendResponse(res, {
							message: 'Error occured while saving coffee details.'
						}, 400);
					});
				}
				return util.sendResponse(res, {
					message: `Shop with id ${shopId} does not exists.`
				}, 404);
			})
			.catch(err => {
				console.log(err);
				return util.sendResponse(res, {
					message: `Error occured while retrieving shop with id ${shopId}.`
				}, 400);
			});
		}
		return util.sendResponse(res, {
			message: 'Cannot process request, invalid shop id.'
		}, 400);
	}
	return util.sendResponse(res, {
		message: 'Cannot process request, empty payload.'
	}, 400);
};

const retrieveById = (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let shopId = req.params.shopId;
	let id = req.params.id;
	if(util.isUUID(shopId)) {
		return shop.findByPk(shopId)
		.then(_shop => {
			_shop.getCoffees()
			.then(coffees => {
				return util.sendResponse(res, {
					data: coffees
				}, 200);
			})
			.catch(err => {
				console.log(err);
				return util.sendResponse(res, {
					message: `Error occurred while retrieving menu from shop id: ${shopId}`
				}, 400);
			});
		})
		.catch(err => {
			console.log(err);
			return util.sendResponse(res, {
				message: `Error occurred while retrieving shop with id ${shopId}`
			}, 400);
		});
	}
	return util.sendResponse(res, {
		message: 'Cannot process request, invalid shop id.'
	}, 400);
};

const retrieveAll = (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let shopId = req.params.shopId;
	if(util.isUUID(shopId)) {
		return shop.findByPk(shopId)
		.then(foundShop => {
			if(foundShop) {
				let page = req.query.page || 1;
				let limit = req.query.limit || 10;
				let offset, q = req.query.q;
				let order = coffee.hasOwnProperty(req.query.orderBy) ? [req.query.orderBy] : ['createdAt'];
				page = isNaN(page) ? undefined : parseInt(page);
				limit = isNaN(limit) ? undefined : parseInt(limit);
				let option = {
					where: {},
					order
				};
				if(limit) {
					offset = (page - 1) * limit;
					option.limit = limit;
					option.offset = offset;
				}
				if(q) {
					option.where[Op.or] = [
						{ name: { [Op.like]: `%${q}%`} },
						{ type: { [Op.like]: `%${q}%`} },
						{ description: { [Op.like]: `%${q}%`} }
					];
				}
				else {
					option.where = util.getOptionsFromQuery({
						name:'',
						type:'',
						description:''
					}, req.query);
				}
				option.where.shopId = shopId;
				return coffee.findAndCountAll(option)
				.then(coffees => {
					return util.sendResponse(res, {
						data: coffees.rows,
						found: coffees.count,
						offset,
						limit,
						page,
						totalPages: Math.ceil((coffees.count/limit)) || 1
					}, 200);
				})
				.catch(err => {
					console.log(err);
					return util.sendResponse(res, {
						message: `Error occurred while retrieving menu from shop id: ${shopId}`
					}, 400);
				});
			}
			return util.sendResponse(res, {
				message: `Shop with id ${shopId} does not exist.`
			}, 404);
		})
		.catch(err => {
			console.log(err);
			return util.sendResponse(res, {
				message: `Error occurred while retrieving shop with id ${shopId}`
			}, 400);
		});
	}
	return util.sendResponse(res, {
		message: 'Cannot process request, invalid shop id.'
	}, 400);
};

const updateById = (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	//TODO
};

const deleteById = (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	//TODO
};


module.exports = {
	create,
	retrieveById,
	retrieveAll,
	updateById,
	deleteById
};
