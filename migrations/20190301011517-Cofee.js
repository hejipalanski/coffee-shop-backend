'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.renameColumn('Coffees', 'uuid', 'id');
	},

	down: (queryInterface, Sequelize) => {
	}
};
