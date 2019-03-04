'use strict';
module.exports = (sequelize, DataTypes) => {
	const Coffee = sequelize.define('Coffee', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4
		},
		name: DataTypes.STRING(50),
		type: DataTypes.STRING(30),
		description: DataTypes.STRING
	}, {});
	Coffee.associate = function(models) {
		Coffee.Shop = Coffee.belongsTo(models.Shop, {foreignKey: 'shopId'});
	};
	return Coffee;
};
