'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('Coffees', 'shopId', {
			autoIncrement: false,
      allowNull: false,
			type: Sequelize.UUID
		});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('Coffees', 'shopId', {
			autoIncrement: true,
			type: Sequelize.INTEGER
		});
	}
};
