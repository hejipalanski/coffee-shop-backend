'use strict';
module.exports = (sequelize, DataTypes) => {
	const Coffee = sequelize.define('Coffee', {
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
			type: DataTypes.STRING(50),
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
		type: {
			type: DataTypes.STRING(30),
			validate: {
				len: {
					args: 5,
					msg: "Type must be atleast 5 characters in length"
				}
			},
			notNull: {
				msg: 'Name cannot be null.'
			}
		},
		description: {
			type: DataTypes.STRING
		},
		deletedAt: {
			allowNull: true,
			type: DataTypes.DATE
		}
	}, {});
	Coffee.associate = function(models) {
		Coffee.MenuList = Coffee.belongsToMany(models.MenuList, {through: 'coffee_menu'});
	};
	return Coffee;
};
