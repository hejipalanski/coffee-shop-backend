'use strict';
module.exports = (sequelize, DataTypes) => {
	const MenuList = sequelize.define('MenuList', {
		id: {
			allowNull: false,
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
			validate: {
				isUUID: 4
			},
			notNull: {
				msg: 'UUID cannot be null.'
			}
		}
	}, {});
	MenuList.associate = function(models) {
		MenuList.ShopMenuList = MenuList.belongsTo(models.Shop,{
			foreignKey: {
				allowNull: false
			}
		});
		MenuList.Coffee = MenuList.hasMany(models.Coffee);
	};
	return MenuList;
};
