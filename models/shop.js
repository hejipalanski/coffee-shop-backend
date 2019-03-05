'use strict';
module.exports = (sequelize, DataTypes) => {
	const Shop = sequelize.define('Shop', {
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
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: false,
			validate: {
				len: {
					args: 5,
					msg: "Name must be atleast 5 characters in length"
				}
			},
			notNull: {
				msg: 'Name cannot be null.'
			}
		},
		location: {
			type:	DataTypes.STRING(100),
			allowNull: false,
			validate: {
				len: {
						args: 10,
						msg: "Name must be atleast 10 characters in length"
				}
			},
			notNull: {
				msg: 'Location cannot be null.'
			}
		},
		franchisee: {
			type: DataTypes.STRING(100),
			allowNull: false,
			validate: {
				len: {
						args: 10,
						msg: "franchisee must be atleast 10 characters in length"
				}
			},
			notNull: {
				msg: 'Franchisee cannot be null.'
			}
		},
		status: {
			type: DataTypes.STRING(10),
			allowNull: false,
			defaultValue: 'close',
			validate: {
					len: {
						args: 4,
						msg: "status must be atleast 4 characters in length"
				}
			}
		}
	}, {});
	Shop.associate = function(models) {
		Shop.MenuList = Shop.hasOne(models.MenuList);
	};
	return Shop;
};
