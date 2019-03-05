'use-strict'

const util = require('../helpers/util');
const db = require('../models');
const shop = db.Shop;
const coffee = db.Coffee;
const menu = db.MenuList;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const create = (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	const payload = req.body;
	if(Object.keys(payload).length > 0) {
		const missingParams = util.getMissingRequiredParams([
			'name',
			'type'
		], payload);
		if(missingParams.length > 0) {
			return util.sendResponse(res, {
				message: `Missing required field(s) ${missingParams}`
			}, 422);
		}
		return coffee.create(payload)
		.then(newCoffee => {
			if(newCoffee) {
				return util.sendResponse(res, {
					data: newCoffee
				});
			}
		})
		.catch(err => {
			console.log(err);
			let errors = util.getErrorsFrom(err.errors);
			return util.sendResponse(res, {
				message: `Error occured while saving coffe details.`,
				errors
			}, 400);
		});
	}
	return util.sendResponse(res, {
		message: 'Cannot process request, empty payload.'
	}, 400);
};

const createBulk = (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let payload = req.body;
	if(payload.length > 0) {
		return coffee.bulkCreate(payload)
		.then(() => {
			return coffee.findAndCountAll();
		})
		.then((coffees) => {
			return util.sendResponse(res, {
				data: coffees.rows
			}, 201);
		})
		.catch(err => {
			let errors = util.getErrorsFrom(err.errors);
			return util.sendResponse(res, {
				message: 'Error occurred while saving coffee details.',
				errors
			}, 400);
		});
	}
	return util.sendResponse(res, {
		message: 'Cannot process request, empty payload'
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
	return coffee.findAndCountAll(option)
	.then(coffees => {
		if(coffees.count == 0) {
			return util.sendResponse(res, {
				message: 'No coffees found'
			},404);
		}
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
	createBulk,
	retrieveById,
	retrieveAll,
	updateById,
	deleteById
};
