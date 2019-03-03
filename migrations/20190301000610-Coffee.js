'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('Coffees', 'shopId', {
			type: Sequelize.UUID,
			allowNull: false
		});
	},

	down: (queryInterface, Sequelize) => {

	}
};
