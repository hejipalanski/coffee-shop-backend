'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('Coffees', 'id', {
			autoIncrement: false,
			type: Sequelize.UUID
		})
		.then(() => {
			return queryInterface.changeColumn('Coffees', 'shopId', {
				type: Sequelize.UUID
			});
		});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('Coffees', 'id', {
			autoIncrement: true,
			type: Sequelize.INTEGER
		})
		.then(() => {
			return queryInterface.changeColumn('Coffees', 'shopId', {
				type: Sequelize.INTEGER
			});
		});
	}
};
