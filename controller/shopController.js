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
	let payload = req.body;
	if(Object.keys(payload).length > 0) {
		const missingParams = util.getMissingRequiredParams([
			'name',
			'location',
			'franchisee'
		], payload);
		if(missingParams.length > 0) {
			return util.sendResponse(res, {
				message: `Missing required field(s) ${missingParams}`
			}, 422);
		}
		return shop.create(payload)
		.then(newShop => {
			menu.create({
				ShopId: newShop.id
			})
			.then(newMenu => {
				if(newMenu) {
					return util.sendResponse(res, {
						data: newShop
					}, 201);
				}
			})
			.catch(err => {
				let errors = util.getErrorsFrom(err.errors);
				return util.sendResponse(res, {
					message: 'Error occurred while creating menu for shop.',
					errors
				}, 400);
			});
		})
		.catch(err => {
			let errors = util.getErrorsFrom(err.errors);
			return util.sendResponse(res, {
				message: 'Error occurred while saving shop details.',
				errors
			}, 400);
		});
	}
	return util.sendResponse(res, {
		message: 'Cannot process request, empty payload'
	}, 400);
};

const createMenuItem = (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	//TODO
};

const createBulk = (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let payload = req.body;
	if(payload.length > 0) {
		let shopIdList = [];
		return shop.bulkCreate(payload)
		.then(() => {
			return shop.findAndCountAll();
		})
		.then(shops => {
			if(shops) {
				newShops = shops;
				let i; length = shops.count;
				for(i = 0; i < length; i++) {
					shopIdList.push({
						ShopId: shops.rows[i].dataValues.id
					});
				}
				return [shopIdList, shops, length];
			}
			return;
		})
		.then(([shopIdList, shops, length]) => {
			if(shopIdList.length > 0) {
				if(shopIdList.length == length) {
					menu.bulkCreate(shopIdList)
					.then((menus) => {
						return util.sendResponse(res, {
							data: shops
						}, 201);
					})
					.catch(err => {
						console.log(err);
						return util.sendResponse(res, {
							message: 'Error occured while generation menu list for newly created shops.'
						});
					});
				}
				return;
			}
			return;
		})
		.catch(err => {
			console.log(err);
			let errors = util.getErrorsFrom(err.errors);
			return util.sendResponse(res, {
				message: 'Error occurred while saving shop details.',
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
	let shopId = req.params.id;
	if(util.isUUID(shopId)) {
		return shop.findByPk(shopId)
		.then(shop => {
			if(shop) {
				return util.sendResponse(res, {
					data: shop
				});
			}
			return util.sendResponse(res, {
				message: `No shop with id: ${shopId} found.`
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
		if(shops.count > 0) {
			return util.sendResponse(res, {
				data: shops.rows,
				found: shops.count,
				offset,
				limit,
				page,
				totalPages: Math.ceil((shops.count/limit)) || 1
			}, 200);
		}
		return util.sendResponse(res, {
			message: `No matching shop found.`
		}, 404);
	})
	.catch(err => {
		console.log(err);
		return util.sendResponse(res, {
			message: `Error occurred while retrieving shops.`
		}, 400);
	});
};

const retrieveMenu = (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let shopId = req.params.shopId;
	if(util.isUUID(shopId)) {
		return menu.findOne({
			where: {
				shopId
			}
		})
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
				option.include = [coffee];
				return menu.findAndCountAll(option)
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
	let shopId = req.params.id;
	if(!util.isUUID(shopId)) {
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
				let errors = util.getErrorsFrom(err.errors);
				return util.sendResponse(res, {
					message: 'Error occurred while saving shop details.',
					errors
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
	createMenuItem,
	createBulk,
	retrieveById,
	retrieveAll,
	retrieveMenu,
	updateById,
	deleteById
};
