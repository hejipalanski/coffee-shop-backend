'use strict';
module.exports = (sequelize, DataTypes) => {
	const Shop = sequelize.define('Shop', {
		name: DataTypes.STRING,
		location: DataTypes.STRING,
		franchisee: DataTypes.STRING,
		status: DataTypes.STRING
	}, {});
	Shop.associate = function(models) {
		Shop.Coffee = Shop.hasMany(models.Coffee);
	};
	return Shop;
};
