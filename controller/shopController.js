'use-strict'

const util = require('../helpers/util');
const db = require('../models');
const shop = db.Shop;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const create = (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let payload = req.body;
	if(Object.keys(payload).length > 0) {
		if(payload.hasOwnProperty('name')) {
			return shop.create(payload)
			.then(newShop => {
				return util.sendResponse(res, {
					data: newShop
				}, 201);
			})
			.catch(err => {
				console.log(err);
				return util.sendResponse(res, {
					message: 'Error occured while saving shop details.'
				}, 400);
			})
		}
		return util.sendResponse(res, {
			message: `Missing required field 'name'`
		}, 400);
	}
	return util.sendResponse(res, {
		message: 'Cannot process request, empty payload'
	}, 400);
};

const retrieveById = (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let shopId = req.params.id;
	if(util.isUUID(shopId)) {
		return shop.findByPk(shopId)
		.then(shop => {
			return util.sendResponse(res, {
				data: shop
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
		message: 'Cannot process request, invalid id format'
	}, 400);
};

const retrieveAll = (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let page = req.query.page || 1;
	let limit = req.query.limit || 10;
	let offset, q = req.query.q;
	let order = shop.hasOwnProperty(req.query.orderBy) ? [req.query.orderBy] : ['createdAt'];
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
			{ location: { [Op.like]: `%${q}%`} },
			{ franchisee: { [Op.like]: `%${q}%`} }
		];
	}
	else {
		option.where = util.getOptionsFromQuery({
			name:'',
			location:'',
			franchisee:'',
			status:''
		}, req.query);
	}
	return shop.findAndCountAll(option)
	.then(shops => {
		return util.sendResponse(res, {
			data: shops.rows,
			found: shops.count,
			offset,
			limit,
			page,
			totalPages: Math.ceil((shops.count/limit)) || 1
		}, 200);
	})
	.catch(err => {
		console.log(err);
		return util.sendResponse(res, {
			message: `Error occurred while retrieving shops.`
		}, 400);
	});
};

const updateById = (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let shopId = req.params.id;
	if(isNaN(shopId)) {
		return util.sendResponse(res, {
			message: `Invalid shop id: ${shopId}`
		}, 400);
	}
	let payload = req.body;
	if(Object.keys(payload).length > 0) {
			let validProps = {
			name:'',
			location:'',
			franchisee:'',
			status:''
		};
		let params = util.getOptionsFromQuery(validProps, payload);
		if(Object.keys(params).length > 0) {
			return shop.update(
				params, {
				returning: true,
				where: {
					id: shopId
				}
			})
			.then((result) => {
				shop.findByPk(shopId)
				.then(shop => {
					return util.sendResponse(res, {
						data: shop
					}, 201);
				})
				.catch(err => {
					console.log(err);
					return util.sendResponse(res, {
						message: `Error occurred while retrieving updated shop.`
					}, 400);
				});
			})
			.catch(err => {
				console.log(err);
				return util.sendResponse(res, {
					message: `Error occurred while updating shop with id ${shopId}.`
				}, 400);
			});
		}
		return util.sendResponse(res, {
			message: 'Cannot process request, invalid payload.'
		}, 400);
	}
	return util.sendResponse(res, {
		message: 'Cannot process request, empty payload'
	}, 400);
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
